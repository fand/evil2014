const React = require('react');

class SidebarTracksHeader extends React.Component {

  onToggleOnOff () {
    this.props.onToggleOnOff(this.onOff.value);
  }

  onChangeTrackName (e) {
    this.props.onChangeTrackName(e.target.value);
  }

  render () {
    const onOrOff = this.props.pattern.isOn ? 'On' : 'Off';
    return (
      <fieldset className="sidebar-tracks-header">
        <legend>
          <input name="name" type="text"
            className="track-name"
            value={this.props.track.name}
            onChange={(e) => this.onChangeTrackName(e)}/>
        </legend>
        <input className="is-on" name="isOn" type="checkbox"
          ref={i => { this.onOff = i; }}
          value={this.props.pattern.isOn}
          onChange={() => this.onToggleOnOff()}/>
        <label htmlFor="isOn" className="is-on-label">Default: {onOrOff}</label>
      </fieldset>
    );
  }

}

SidebarTracksHeader.propTypes = {
  track             : React.PropTypes.any,
  pattern           : React.PropTypes.any,
  onToggleOnOff     : React.PropTypes.func.isRequired,
  onChangeTrackName : React.PropTypes.func.isRequired,
};

module.exports = SidebarTracksHeader;
