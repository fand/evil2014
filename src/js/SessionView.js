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

        // DOMs for session view.
        this.wrapper_mixer      = $('#mixer-tracks');
        this.wrapper_master     = $('#session-master-wrapper');
        this.wrapper_tracks     = $('#session-tracks-wrapper');
        this.wrapper_tracks_sub = $('#session-tracks-wrapper-sub');

        this.color = ['rgba(200, 200, 200, 1.0)', 'rgba(  0, 220, 250, 0.7)', 'rgba(100, 230, 255, 0.7)',
                  'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)', 'rgba(100, 230, 255, 0.2)'];
        this.color_schemes = {
            REZ: ['rgba(200, 200, 200, 1.0)', 'rgba(  0, 220, 250, 0.7)', 'rgba(100, 230, 255, 0.7)',
                  'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)', 'rgba(100, 230, 255, 0.2)',],
            SAMPLER: ['rgba(230, 230, 230, 1.0)', 'rgba(  255, 100, 192, 0.7)', 'rgba(255, 160, 216, 0.7)',
                      'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)', 'rgba(255, 160, 216, 0.2)'],
        };

        this.track_color = [0,1,2,3,4,5,6,7].map(i => this.color);

        this.last_active   = [];
        this.current_cells = [];

        this.hover_pos  = { x : -1, y : -1 };
        this.click_pos  = { x : -1, y : -1 };
        this.select_pos = { x : 0, y  : 0, type: 'master' };
        this.last_clicked = performance.now();

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

        this.readSong(this.song, this.current_cells);
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
    readSong (song, current_cells) {
        this.song          = song;
        this.current_cells = current_cells;

        this.sessionTracks.setState({ song });

        // Draw tracks
        for (let x = 0; x < Math.max(this.song.tracks.length + 1, 8); x++) {
            const t = this.song.tracks[x];
            if (t != null) {
                if (t.type != null) {
                    this.track_color[x] = this.color_schemes[t.type];
                }
            }
        }

        this.selectCellMaster(this.select_pos);

        // set Global info
        this.song_title.val(this.song.title);
        this.song_creator.val(this.song.creator);
    }

    drawTrackName (x, name, type) {
        if (type != null) {
            this.track_color[x] = this.color_schemes[type];
        }
    }

    drawScene (pos, cells) {
        if (cells != null) {
            this.current_cells = cells;
        }

        this.scene_pos = pos;

        if (this.select_pos.type === 'tracks') {
            this.selectCell(this.select_pos);
        }
        else if (this.select_pos.type === 'master') {
            this.selectCellMaster(this.select_pos);
        }
    }

    drawDrag (ctx, pos) {
        // this.click_pos is NOT empty
        if (this.song.tracks[this.click_pos.x] == null) { return; }
        if (this.song.tracks[this.click_pos.x].patterns == null) { return; }
        if (this.song.tracks[this.click_pos.x].patterns[this.click_pos.y] == null) { return; }
        const name = this.song.tracks[this.click_pos.x].patterns[this.click_pos.y].name;

        if (pos.y >= Math.max(this.song.length, 10) || pos.y < 0) { return; }

        if (this.track_color[pos.x] == null) {
            this.track_color[pos.x] = this.color_schemes[this.song.tracks[pos.x].type];
        }

        this.hover_pos = pos;
    }

    drawDragMaster (ctx, pos) {
        // this.click_pos is NOT empty
        if (this.song.master[this.click_pos.y] == null) { return; }
        const name = this.song.master[this.click_pos.y].name;

        if (pos.y >= Math.max(this.song.length, 10)) { return; }

        this.hover_pos = pos;
    }

    drawHover (ctx, pos) {
        this.hover_pos = pos;
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
        if (this.song.master[y] != null) {
            this.model.cueScene(y)
        }
    }

    // Light the play buttons on beat.
    beat (is_master, cells) {}

    editPattern (pos) {
        const pat = this.model.editPattern(pos.x, pos.y);
    }

    addSynth (song) {
        this.song = song;
        this.readSong(this.song, this.current_cells);
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

    changeSynth (song) {
        this.song = song;
        this.readSong(this.song, this.current_cells);
    }

    // Copy cells by drag.
    copyCell (src, dst) {
        if (this.song.tracks[src.x] == null || this.song.tracks[src.x].patterns[src.y] == null) {
            return;
        }

        this.model.savePattern(src.x, src.y);

        // addSynth when tracks[dst.x] is empty.
        if (this.song.tracks[dst.x] == null) {
            dst.x = this.model.readTrack(this.song, src, dst);
            this.current_cells.length = dst.x + 1;
            this.song.tracks[dst.x].type = this.song.tracks[src.x].type;
        }

        if (this.song.tracks[src.x].type !== this.song.tracks[dst.x].type) { return; }

        // Deep copy the pattern
        this.song.tracks[dst.x].patterns[dst.y] = $.extend(true, {}, this.song.tracks[src.x].patterns[src.y]);

        this.model.readPattern(this.song.tracks[dst.x].patterns[dst.y], dst.x, dst.y);
    }

    copyCellMaster (src, dst) {
        if (this.song.master[src.y] == null) { return; }

        // Deep copy the pattern
        this.song.master[dst.y] = $.extend(true, {}, this.song.master[src.y]);

        // save this.song.master to this.session.song.master
        this.model.readMaster(this.song.master[dst.y], dst.y);
    }

    // Select cell on click.
    selectCell (pos) {
        if (this.song.tracks[pos.x] == null || this.song.tracks[pos.x].patterns[pos.y] == null) {
            return;
        }

        if (this.track_color[pos.x] == null) {
            this.track_color[pos.x] = this.color_schemes[this.song.tracks[pos.x].type];
        }

        this.select_pos = pos;
        this.select_pos.type = 'tracks';

        this.model.player.sidebar.show(this.song, this.select_pos);
    }

    selectCellMaster (pos) {
        if (this.song.master[pos.y] == null) { return; }

        this.select_pos = pos;
        this.select_pos.type = 'master';

        // TODO:なんとかする
        // this.model.player.sidebar.show(this.song, this.select_pos);
    }

    getSelectPos () {
        if (this.select_pos.x !== -1 && this.select_pos.y !== -1) {
            return this.select_pos;
        }
        return null;
    }

}

module.exports = SessionView;
