const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const EffectList = require('./EffectList');
const SidebarFooter = require('./SidebarFooter');
const SidebarTracksHeader = require('./SidebarTracksHeader');
const SidebarMasterHeader = require('./SidebarMasterHeader');

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

        this.$masterHeader = this.$master.find('.sidebar-header');
        this.masterHeader  = ReactDOM.render(
          <SidebarMasterHeader
            onChangeScene={s => this.saveMaster(s)}/>, this.$masterHeader[0]);
    }

    saveMaster (obj) {
        this.model.saveMaster(obj);
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
        this.renderMasterHeader(o);
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

    renderMasterHeader (scene) {
        this.masterHeader.setState({ scene });
    }

    renderEffects () {
        const masterEffects = this.model.getMasterEffects();
        this.masterEffectList.setState({ effects: masterEffects });

        const tracksEffects = this.model.getTracksEffects();
        this.tracksEffectList.setState({ effects: tracksEffects });
    }

}

module.exports = SidebarView;
