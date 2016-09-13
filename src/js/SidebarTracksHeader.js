const React = require('react');

class SidebarTracksHeader extends React.Component {

  constructor () {
    super();
    this.state = {
      track   : null,
      pattern : null,
    };
  }

  onToggleOnOff () {
    this.props.onToggleOnOff(this.onOff.value);
  }

  onChangeTrackName (e) {
    this.props.onChangeTrackName(e.target.value);
  }

  render () {
    if (!(this.state.pattern && this.state.track)) { return null; }

    const onOrOff = this.state.pattern.isOn ? 'On' : 'Off';
    return (
      <fieldset className="sidebar-tracks-header">
        <legend>
          <input name="name" type="text"
            className="track-name"
            value={this.state.track.name}
            onChange={(e) => this.onChangeTrackName(e)}/>
        </legend>
        <input className="is-on" name="isOn" type="checkbox"
          ref={i => { this.onOff = i; }}
          value={this.state.pattern.isOn}
          onChange={() => this.onToggleOnOff()}/>
        <label htmlFor="isOn" className="is-on-label">Default: {onOrOff}</label>
      </fieldset>
    );
  }

}

SidebarTracksHeader.propTypes = {
  onToggleOnOff     : React.PropTypes.func.isRequired,
  onChangeTrackName : React.PropTypes.func.isRequired,
};

module.exports = SidebarTracksHeader;
