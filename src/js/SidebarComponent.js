const React = require('react');
const EffectList = require('./EffectList');
const SidebarFooter = require('./SidebarFooter');
const SidebarTracksHeader = require('./SidebarTracksHeader');
const SidebarMasterHeader = require('./SidebarMasterHeader');

const STATE = {
  MASTER : 'MASTER',
  TRACKS : 'TRACKS',
};

class SidebarComponent extends React.Component {

  constructor () {
    super();
    this.state = {
      mode    : STATE.MASTER,
      track   : {},
      pattern : {},
      scene   : {},
    };
  }

  saveMaster (obj) {
    this.props.model.saveMaster(obj);
  }

  addMasterEffect (name) {
    this.props.model.addMasterEffect(name);
    this.forceUpdate(); // TODO: どうにかする
  }

  addTracksEffect (name) {
    this.props.model.addTracksEffect(name);
    this.forceUpdate(); // TODO: どうにかする
  }

  /**
   * @param {boolean} val
   */
  setPatternOnOff (val) {
    this.props.model.setPatternOnOff(val);
  }

  renderTracks () {
    const effects = this.props.model.getTracksEffects();
    return (
      <div className="SidebarTracks">
        <SidebarTracksHeader
          track={this.state.track}
          pattern={this.state.pattern}
          onToggleOnOff={v => this.setPatternOnOff(v)}
          onChangeTrackName={(n) => console.log('change track name', n)}/>
        <EffectList effects={effects}/>
        <SidebarFooter onAdd={v => this.addTracksEffect(v)}/>
      </div>
    );
  }

  renderMaster () {
    const effects = this.props.model.getMasterEffects();
    return (
      <div className="SidebarMaster">
        <SidebarMasterHeader
          scene={this.state.scene}
          onChangeScene={s => this.saveMaster(s)}/>
        <EffectList effects={effects}/>
        <SidebarFooter onAdd={v => this.addMasterEffect(v)}/>
      </div>
    );
  }

  render () {
    if (this.state.mode === STATE.MASTER) {
      return this.renderMaster();
    }
    else {
      return this.renderTracks();
    }
  }

}

SidebarComponent.propTypes = {
  model : React.PropTypes.any.isRequired,
};

module.exports = SidebarComponent;
