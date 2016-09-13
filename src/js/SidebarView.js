const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const EffectList = require('./EffectList');
const SidebarFooter = require('./SidebarFooter');
const SidebarTracksHeader = require('./SidebarTracksHeader');

class SidebarView {

    /**
     * @param {Sidebar} model
     * Called by Sidebar.prototype.constructor.
     */
    constructor (model) {
        this.model = model;

        this.$wrapper = $('#sidebar-wrapper');
        this.$tracks  = this.$wrapper.find('#sidebar-tracks');
        this.$master  = this.$wrapper.find('#sidebar-master');

        this.$masterDisplay  = this.$master.find('.display');
        this.$masterControl  = this.$master.find('.control');

        this.$masterDisplayLabel  = this.$master.find('.display-current-control');
        this.$masterEdit  = this.$master.find('[name=edit]');

        this.$masterName  = this.$master.find('[name=name]');
        this.$masterBpm   = this.$master.find('[name=bpm]');
        this.$masterKey   = this.$master.find('[name=key]');
        this.$masterScale = this.$master.find('[name=mode]');
        this.$masterSave  = this.$master.find('[name=save]');

        this.$masterEffects = this.$master.find('.sidebar-effects');
        this.$tracksEffects = this.$tracks.find('.sidebar-effects');
        this.masterEffectList = ReactDOM.render(<EffectList/>, this.$masterEffects[0]);
        this.tracksEffectList = ReactDOM.render(<EffectList/>, this.$tracksEffects[0]);

        this.$masterFooter = this.$master.find('.sidebar-footer');
        this.$tracksFooter = this.$tracks.find('.sidebar-footer');
        this.masterFooter  = ReactDOM.render(
          <SidebarFooter onAdd={v => this.addMasterEffect(v)}/>, this.$masterFooter[0]);
        this.tracksFooter  = ReactDOM.render(
          <SidebarFooter onAdd={v => this.addTracksEffect(v)}/>, this.$tracksFooter[0]);


        this.$tracksHeader = this.$tracks.find('.sidebar-header');
        this.tracksHeader  = ReactDOM.render(
          <SidebarTracksHeader
            onToggleOnOff={v => this.setPatternOnOff(v)}
            onChangeTrackName={n => console.log('change track name')}/>, this.$tracksHeader[0]);  // TODO: change track name

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
        this.renderTracksHeader(track, pattern);
        this.renderEffects();
        this.$wrapper.css('left', '0px');
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

        this.$wrapper.css('left', '-223px');
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
        this.renderEffects();
    }

    addTracksEffect (name) {
        const fx = this.model.addTracksEffect(name);
        this.renderEffects();
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

    /**
     * @param {boolean} val
     */
    setPatternOnOff (val) {
        this.model.setPatternOnOff(val);
    }

    renderTracksHeader (track, pattern) {
        this.tracksHeader.setState({ track, pattern });
    }

    renderEffects () {
        const masterEffects = this.model.getMasterEffects();
        this.masterEffectList.setState({ effects: masterEffects });

        const tracksEffects = this.model.getTracksEffects();
        this.tracksEffectList.setState({ effects: tracksEffects });
    }

}

module.exports = SidebarView;
