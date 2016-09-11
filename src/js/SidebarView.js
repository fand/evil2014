const $ = require('jquery');

class SidebarView {

    constructor (model) {
        this.model = model;

        this.wrapper = $('#sidebar-wrapper');
        this.tracks  = this.wrapper.find('#sidebar-tracks');
        this.master  = this.wrapper.find('#sidebar-master');

        this.master_display  = this.master.find('.display');
        this.master_control  = this.master.find('.control');

        this.master_display_label  = this.master.find('.display-current-control');
        this.master_edit  = this.master.find('[name=edit]');

        this.master_name  = this.master.find('[name=name]');
        this.master_bpm   = this.master.find('[name=bpm]');
        this.master_key   = this.master.find('[name=key]');
        this.master_scale = this.master.find('[name=mode]');
        this.master_save  = this.master.find('[name=save]');

        this.master_effects = this.master.find('.sidebar-effects');
        this.add_master     = this.master.find('.add-type');
        this.add_master_btn = this.master.find('.add-btn');
        this.tracks_effects = this.tracks.find('.sidebar-effects');
        this.add_tracks     = this.tracks.find('.add-type');
        this.add_tracks_btn = this.tracks.find('.add-btn');

        this.pattern_is_on       = this.tracks.find('.is-on');
        this.pattern_is_on_label = this.tracks.find('.is-on-label');

        this.initEvent();
    }

    initEvent () {
        this.master_name
            .on('focus', () => window.keyboard.beginInput())
            .on('blur', () => window.keyboard.endInput())
            .on('change', () => this.saveMaster());

        [this.master_bpm, this.master_key, this.master_scale].forEach(m => {
            m.on('focus', () => window.keyboard.beginInput())
                .on('blur', () => window.keyboard.endInput());
        });

        this.master_save.on('click', () => { this.saveMaster(); this.hideMasterControl(); });
        this.master_edit.on('click', () => this.showMasterControl());

        this.tracks.find('.sidebar-effect').each((i) => {
            $(this).on('change', () => {
                // change i-th effect
                this.model.readTracksEffect(i);
            });
        });

        this.add_master_btn.on('click', () =>
            this.addMasterEffect(this.add_master.val())
        );

        this.add_tracks_btn.on('click', () =>
            this.addTracksEffect(this.add_tracks.val())
        );

        this.pattern_is_on.on('change', () => {
            this.setPatternOnOff(this.pattern_is_on.prop('checked'));
        });
    }

    saveMaster () {
        const name  = this.master_name.val();
        const bpm   = this.master_bpm.val();
        const key   = this.master_key.val();
        const scale = this.master_scale.val();

        const obj = {};
        if (name != null) { obj.name  = name; }
        if (bpm != null) { obj.bpm   = bpm; }
        if (key != null) { obj.key   = key; }
        if (scale != null) { obj.scale = scale; }
        this.model.saveMaster(obj);
        this.showMaster(obj);
    }

    clearMaster () {
        const o = {name: this.master_name.val()};
        this.model.saveMaster(o);
        this.showMaster(o);
    }

    saveTracksEffect () {
        // save してない……？
        this.tracks_effects.forEach(f => f.getParam());
    }

    showTracks (track, pattern) {
        const is_on = (pattern.isOn != null ? pattern.isOn : true);
        this.pattern_is_on.prop('checked', is_on);
        this.setPatternOnOff(is_on);
        this.tracks_effects.find('.sidebar-effect').remove();
        track.effects.forEach(f => f.appentTo(this.tracks_effects));
        this.wrapper.css('left', '0px');
    }

    showMaster (o) {
        this.hideMasterControl();
        if (o.name) {
            this.master_name.val(o.name);
        }

        let s = '';
        if (o.bpm != null) { s += o.bpm + ' BPM '; }
        if (o.key != null) { s += o.key + '     '; }
        if (o.scale != null) {
            s += o.scale;
        }
        this.master_display_label.text(s);

        this.wrapper.css('left', '-223px');
    }

    showMasterControl () {
        this.master_control.show();
        this.master_display.hide();
    }

    hideMasterControl () {
        this.master_display.show();
        this.master_control.hide();
    }

    addMasterEffect (name) {
        const fx = this.model.addMasterEffect(name);
        fx.appendTo(this.master_effects);
    }

    addTracksEffect (name) {
        const fx = this.model.addTracksEffect(name);
        fx.appendTo(this.tracks_effects);
    }

    setBPM (b) {
        this.master_bpm.val(b);
    }

    setKey (k) {
        this.master_key.val(k);
    }

    setScale (s) {
        this.master_scale.val(s);
    }

    readMasterEffect (fx) {
        fx.appendTo(this.master_effects);
    }

    setPatternOnOff (val) {
        this.pattern_is_on_label.html('Default: ' + (val ? 'On' : 'Off'));
        this.model.setPatternOnOff(val);
    }

}

module.exports = SidebarView;
