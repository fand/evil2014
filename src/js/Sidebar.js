const SidebarView = require('./SidebarView');

class Sidebar {

    constructor (ctx, player, session, mixer) {
        this.ctx     = ctx;
        this.player  = player;
        this.session = session;
        this.mixer   = mixer;

        this.sidebar_pos = { x:0, y:1, type: 'master' };
        this.view = new SidebarView(this);
    }

    show (song, select_pos) {
        this.song       = song;
        this.select_pos = select_pos;

        if (this.select_pos.type == 'tracks') {
            if (this.sidebar_pos.x == this.select_pos.x && this.sidebar_pos.y == this.select_pos.y && this.sidebar_pos.type == this.select_pos.type) { return; }
            this.saveTracksEffect(this.sidebar_pos.x);
            this.sidebar_pos = this.select_pos;
            const synth = this.player.synth[this.select_pos.x];
            this.view.showTracks(synth, this.session.song.tracks[this.select_pos.x].patterns[this.select_pos.y])
        }
        else {
            if (this.sidebar_pos.y == this.select_pos.y && this.sidebar_pos.type == this.select_pos.type) { return; }
            this.sidebar_pos = this.select_pos;
            this.view.showMaster(this.song.master[this.select_pos.y]);
        }
    }

    saveMaster (obj) {
        if (this.sidebar_pos.y == -1) { return; }
        this.session.saveMaster(this.sidebar_pos.y, obj)
    }

    saveTracksEffect () {
        // TODO: make sure this is impossible / delete this line
        if (this.sidebar_pos.type == 'master') { return; }
        this.session.saveTracksEffect(this.sidebar_pos);
    }

    addMasterEffect (name) {
        this.mixer.addMasterEffect(name);
    }

    addTracksEffect (name) {
        this.mixer.addTracksEffect(this.sidebar_pos.x, name);
    }

    setBPM (b) {
        this.view.setBPM(b);
    }

    setKey (k) {
        this.view.setKey(k);
    }

    setScale (s) {
        this.view.setScale(s);
    }

    update () {
        this.mixer.effects_master.forEach(f => this.view.readMasterEffect(f));
    }

    setPatternOnOff (val) {
        this.session.song.tracks[this.select_pos.x].patterns[this.select_pos.y].isOn = val;
    }

}

module.exports = Sidebar;
