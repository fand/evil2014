const SidebarView = require('./SidebarView');

class Sidebar {

    /**
     * @param {AudioContext} ctx
     * @param {Player} player
     * @param {Session} sessioin
     * @param {AudioContext} mixer
     * Called by Player.prototype.constructor.
     */
    constructor (ctx, player, session, mixer) {
        this.ctx     = ctx;
        this.player  = player;
        this.session = session;
        this.mixer   = mixer;

        this.pos = { x: 0, y: 1, type: 'master' };
        this.view = new SidebarView(this);
    }

    /**
     * Show info for selected cell.
     * Called by SessionView.
     * @param {Object} song
     * @param {Pos} pos
     */
    show (song, pos) {
        this.song = song;

        if (this.select_pos.type === 'tracks') {
            if (
                this.pos.x    === pos.x &&
                this.pos.y    === pos.y &&
                this.pos.type === pos.type
            ) { return; }

            this.saveTracksEffect(this.pos.x);
            this.pos = pos;
            const synth = this.player.synth[pos.x];
            this.view.showTracks(synth, this.session.song.tracks[pos.x].patterns[pos.y])
        }
        else {
            if (this.pos.y === pos.y && this.pos.type === pos.type) { return; }
            this.pos = pos;
            this.view.showMaster(this.song.master[pos.y]);
        }
    }

    // Playerから呼ばれる
    setBPM (b) {
        this.view.setBPM(b);
    }

    // Playerから呼ばれる
    setKey (k) {
        this.view.setKey(k);
    }

    // Playerから呼ばれる
    setScale (s) {
        this.view.setScale(s);
    }

    // Playerから呼ばれる
    update () {
        this.mixer.effects_master.forEach(f => this.view.readMasterEffect(f));
    }

    // viewから呼ばれる
    saveMaster (obj) {
        if (this.pos.y === -1) { return; }
        this.session.saveMaster(this.pos.y, obj)
    }

    // viewから呼ばれる
    saveTracksEffect () {
        // TODO: make sure this is impossible / delete this line
        if (this.pos.type === 'master') { return; }
        this.session.saveTracksEffect(this.pos);
    }

    // viewから呼ばれる
    addMasterEffect (name) {
        return this.mixer.addMasterEffect(name);
    }

    // viewから呼ばれる
    addTracksEffect (name) {
        return this.mixer.addTracksEffect(this.pos.x, name);
    }

    // viewから呼ばれる
    setPatternOnOff (val) {
        this.session.song.tracks[this.select_pos.x].patterns[this.select_pos.y].isOn = val;
    }

}

module.exports = Sidebar;
