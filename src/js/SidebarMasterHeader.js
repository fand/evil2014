const React = require('react');

const SCALES = [
  'Major',
  'minor',
  'Pentatonic',
  'Harm-minor',
  'Dorian',
  'Phrygian',
  'Lydian',
  'Mixolydian',
  'CHROMATIC',
];

const KEYS = [
  'A',
  'D',
  'G',
  'C',
  'F',
  'Bb',
  'Eb',
  'Ab',
  'Db',
  'Gb',
  'B',
  'E',
];

class SidebarMasterHeader extends React.Component {

  constructor () {
    super();
    this.state = {
      isEditing : false,
      scene     : null,
    };
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ scene : nextProps.scene });
  }

  showEditor () {
    this.setState({ isEditing : true });
  }

  saveEditor () {
    this.setState({ isEditing : false });
    this.props.onChangeScene(this.state.scene);
  }

  onChangeBPM (e) {
    const newScene = {
        ...this.state.scene,
        bpm : e.target.value,
    };
    this.setState({ scene : newScene });
  }

  onChangeScale (e) {
    const newScene = {
        ...this.state.scene,
        scale : e.target.value,
    };
    this.setState({ scene : newScene });
  }

  onChangeKey (e) {
    const newScene = {
        ...this.state.scene,
        key : e.target.value,
    };
    this.setState({ scene : newScene });
  }

  renderDisplay () {
    return (
      <div className="display clearfix">
        <div className="display-current-control"/>
        <button name="edit" type="button"
          onClick={() => this.showEditor()} value="edit">
          edit
        </button>
      </div>
    );
  }

  renderControl () {
    return (
      <div>
        <div className="control clearfix">
          <label>key</label>
          <select name="key"
            value={this.state.scene.key}
            onChange={(e) => this.onChangeScale(e)}>
            {KEYS.map(k => <option key={k}>{k}</option>)}
          </select>
        </div>

        <div className="control clearfix">
          <label>scale</label>
          <select name="mode"
            value={this.state.scene.scale}
            onChange={(e) => this.onChangeScale(e)}>
            {SCALES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="control clearfix">
          <label>bpm</label>
          <input name="bpm" type="number"
            min="0" max="50000"
            value={this.state.scene.bpm}
            onChange={(e) => this.onChangeBPM(e)}/>
        </div>

        <div className="control clearfix">
          <input name="save" type="button" value="save"
            onClick={() => this.saveEditor()}/>
        </div>
      </div>
    );
  }

  render () {
    return (
      <fieldset className="sidebar-module sidebar-name">
        <legend><input name="name" type="text" value="section-0" /></legend>
        {this.state.isEditing ? this.renderControl() : this.renderDisplay()}
      </fieldset>
    );
  }

}

SidebarMasterHeader.propTypes = {
  onChangeScene : React.PropTypes.func.isRequired,
};

module.exports = SidebarMasterHeader;
