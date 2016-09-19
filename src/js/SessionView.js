const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const SocialButtons = require('./SocialButtons');
const Dialog = require('./Dialog');
const SessionComponent = require('./SessionComponent');

class SessionView {

    constructor (model, song) {
        this.model = model;
        this.song  = song;

        this.color = ['rgba(200, 200, 200, 1.0)', 'rgba(  0, 220, 250, 0.7)', 'rgba(100, 230, 255, 0.7)',
                  'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)', 'rgba(100, 230, 255, 0.2)'];
        this.color_schemes = {
            REZ: ['rgba(200, 200, 200, 1.0)', 'rgba(  0, 220, 250, 0.7)', 'rgba(100, 230, 255, 0.7)',
                  'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)', 'rgba(100, 230, 255, 0.2)',],
            SAMPLER: ['rgba(230, 230, 230, 1.0)', 'rgba(  255, 100, 192, 0.7)', 'rgba(255, 160, 216, 0.7)',
                      'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)', 'rgba(255, 160, 216, 0.2)'],
        };

        this.select_pos = { x : 0, y  : 0, type: 'master' };

        // DOMs to save songs.
        this.btn_save       = $('#btn-save');
        this.btn_clear      = $('#btn-clear');
        this.song_info      = $('#song-info');
        this.song_title     = this.song_info.find('#song-title');
        this.song_creator   = this.song_info.find('#song-creator');
        this.initEvent();

        this.social = ReactDOM.render(<SocialButtons song={this.model.song}/>, document.querySelector('#social'));

        this.dialog = ReactDOM.render(<Dialog/>, document.querySelector('#dialog'));

        this.sessionTracks = ReactDOM.render(<SessionComponent model={this.model}/>, document.querySelector('#session-tracks-wrapper2'));

        this.readSong(this.song);
    }

    getCSRFToken () {
        return $('#ajax-form > input[name=csrf_token]').val();
    }

    initEvent () {
        this.btn_save.on('click', () => this.model.saveSong());
        this.song_title
            .on('focus', () => window.keyboard.beginInput())
            .on('change', () => this.setSongTitle())
            .on('blur', () => window.keyboard.endInput());
        this.song_creator
            .on('focus', () => window.keyboard.beginInput())
            .on('change', () => this.setCreatorName())
            .on('blur', () => window.keyboard.endInput());
    }

    // Set params for this.song (ref to this.model.song).
    setSongTitle () {
        this.song.title = this.song_title.val()
    }

    setCreatorName () {
        this.song.creator = this.song_creator.val();
    }

    // Read song from this.song.
    readSong (song) {
        this.song = song;

        this.sessionTracks.setState({ song });
        this.selectCellMaster(this.select_pos);

        // set Global info
        this.song_title.val(this.song.title);
        this.song_creator.val(this.song.creator);
    }

    /**
     * 実質「あるcellにfocusする」という役割しか持たない
     */
    drawScene (pos) {
        if (pos.type === 'tracks') {
            this.selectCell(this.pos);
        }
        else if (pos.type === 'master') {
            this.selectCellMaster(this.pos);
        }
    }

    // Select cell on click.
    // TODO: focus に名前かえる
    selectCell (pos) {
        if (this.song.tracks[pos.x] == null || this.song.tracks[pos.x].patterns[pos.y] == null) {
            return;
        }
        this.select_pos = pos;
    }

    selectCellMaster (pos) {
        if (this.song.master[pos.y] == null) { return; }

        this.select_pos = pos;

        // TODO:なんとかする
        // this.model.player.sidebar.show(this.song, this.select_pos);
    }

    // Cue the cells to play
    cueTracks (x, y) {
        if (this.song.tracks[x] == null) { return; }
        if (this.song.tracks[x].patterns[y] != null) {
            this.model.cuePattern(x, y);
        }
        else {
            this.model.cueOff(x);
        }
    }

    cueMaster (x, y) {
        if (this.song.master[y] == null) { return; }
        this.model.cueScene(y);
    }

    // Light the play buttons on beat.
    beat () {}

    editPattern (pos) {
        this.model.editPattern(pos.x, pos.y);
    }

    /**
     * Called by Session.
     */
    showSuccess (_url, songTitle, userName) {
        const songUrl = `http://evil.gmork.in/${_url}`;
        this.dialog.setState({
            isVisible : true,
            isSuccess : true,
            userName  : userName,
            songTitle : songTitle,
            songUrl   : songUrl,
        });
    }

    /**
     * Called by Session.
     */
    showError () {
        this.dialog.setState({
            isVisible : true,
            isSuccess : false,
        });
    }

    getSelectPos () {
        if (this.select_pos.x !== -1 && this.select_pos.y !== -1) {
            return this.select_pos;
        }
        return null;
    }

}

module.exports = SessionView;
