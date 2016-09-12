const $ = require('jquery');

class SidebarView {

    /**
     * @param {Sidebar} model
     * Called by Sidebar.prototype.constructor.
     */
    constructor (model) {
        this.model = model;

        this.wrapper = $('#sidebar-wrapper');
        this.tracks  = this.wrapper.find('#sidebar-tracks');
        this.master  = this.wrapper.find('#sidebar-master');

        this.$masterDisplay  = this.master.find('.display');
        this.$masterControl  = this.master.find('.control');

        this.$masterDisplayLabel  = this.master.find('.display-current-control');
        this.$masterEdit  = this.master.find('[name=edit]');

        this.$masterName  = this.master.find('[name=name]');
        this.$masterBpm   = this.master.find('[name=bpm]');
        this.$masterKey   = this.master.find('[name=key]');
        this.$masterScale = this.master.find('[name=mode]');
        this.$masterSave  = this.master.find('[name=save]');

        this.$masterEffects = this.master.find('.sidebar-effects');
        this.$addMaster     = this.master.find('.add-type');
        this.$addMasterBtn  = this.master.find('.add-btn');
        this.$tracksEffects = this.tracks.find('.sidebar-effects');
        this.$addTracks     = this.tracks.find('.add-type');
        this.$addTracksBtn  = this.tracks.find('.add-btn');

        this.$patternIsOn      = this.tracks.find('.is-on');
        this.$patternIsOnLabel = this.tracks.find('.is-on-label');

        this.initEvent();
    }

    initEvent () {
        this.$masterName
            .on('focus', () => window.keyboard.beginInput())
            .on('blur', () => window.keyboard.endInput())
            .on('change', () => this.saveMaster());

        [this.$masterBpm, this.$masterKey, this.$masterScale].forEach(m => {
            m.on('focus', () => window.keyboard.beginInput())
                .on('blur', () => window.keyboard.endInput());
        });

        this.$masterSave.on('click', () => {
            this.saveMaster();
            this.hideMasterControl();
        });
        this.$masterEdit.on('click', () => this.showMasterControl());

        this.tracks.find('.sidebar-effect').each((i) => {
            $(this).on('change', () => {
                // change i-th effect
                this.model.readTracksEffect(i);
            });
        });

        this.$addMasterBtn.on('click', () =>
            this.addMasterEffect(this.$addMaster.val())
        );

        this.$addTracksBtn.on('click', () =>
            this.addTracksEffect(this.$addTracks.val())
        );

        this.$patternIsOn.on('change', () => {
            this.setPatternOnOff(this.$patternIsOn.prop('checked'));
        });
    }

    saveMaster () {
        const name  = this.$masterName.val();
        const bpm   = this.$masterBpm.val();
        const key   = this.$masterKey.val();
        const scale = this.$masterScale.val();

        const obj = {};
        if (name != null) { obj.name  = name; }
        if (bpm != null) { obj.bpm   = bpm; }
        if (key != null) { obj.key   = key; }
        if (scale != null) { obj.scale = scale; }
        this.model.saveMaster(obj);
        this.showMaster(obj);
    }

    clearMaster () {
        const o = { name: this.$masterName.val() };
        this.model.saveMaster(o);
        this.showMaster(o);
    }

    saveTracksEffect () {
        // save してない……？
        this.$tracksEffects.forEach(f => f.getParam());
    }

    showTracks (track, pattern) {
        const isOn = (pattern.isOn != null ? pattern.isOn : true);
        this.$patternIsOn.prop('checked', isOn);
        this.setPatternOnOff(isOn);
        this.$tracksEffects.find('.sidebar-effect').remove();
        track.effects.forEach(f => f.appentTo(this.$tracksEffects));
        this.wrapper.css('left', '0px');
    }

    showMaster (o) {
        this.hideMasterControl();
        if (o.name) {
            this.$masterName.val(o.name);
        }

        let s = '';
        if (o.bpm != null) { s += o.bpm + ' BPM '; }
        if (o.key != null) { s += o.key + '     '; }
        if (o.scale != null) {
            s += o.scale;
        }
        this.$masterDisplayLabel.text(s);

        this.wrapper.css('left', '-223px');
    }

    showMasterControl () {
        this.$masterControl.show();
        this.$masterDisplay.hide();
    }

    hideMasterControl () {
        this.$masterDisplay.show();
        this.$masterControl.hide();
    }

    addMasterEffect (name) {
        const fx = this.model.addMasterEffect(name);
        fx.appendTo(this.$masterEffects);
    }

    addTracksEffect (name) {
        const fx = this.model.addTracksEffect(name);
        fx.appendTo(this.$tracksEffects);
    }

    setBPM (b) {
        this.$masterBpm.val(b);
    }

    setKey (k) {
        this.$masterKey.val(k);
    }

    setScale (s) {
        this.$masterScale.val(s);
    }

    readMasterEffect (fx) {
        fx.appendTo(this.$masterEffects);
    }

    /**
     * @param {boolean} val
     */
    setPatternOnOff (val) {
        this.$patternIsOnLabel.html('Default: ' + (val ? 'On' : 'Off'));
        this.model.setPatternOnOff(val);
    }

}

module.exports = SidebarView;
