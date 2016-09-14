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
      scene     : {},
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

  onChangeSceneName (e) {
    const newScene = {
      ...this.state.scene,
      name : e.target.value,
    };
    this.setState({ scene : newScene });
    this.props.onChangeScene(newScene);
  }

  renderDisplay () {
    return (
      <div className="sidebar-input">
        <span>
          <span>{this.state.scene.bpm} BPM</span>&nbsp;
          <span>{this.state.scene.key}</span>&nbsp;
          <span>{this.state.scene.scale}</span>&nbsp;
        </span>
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
        <div className="sidebar-input">
          <label className="sidebar-input-left">key</label>
          <select name="key"
            value={this.state.scene.key}
            onChange={(e) => this.onChangeKey(e)}>
            {KEYS.map(k => <option key={k}>{k}</option>)}
          </select>
        </div>

        <div className="sidebar-input">
          <label className="sidebar-input-left">scale</label>
          <select name="mode"
            value={this.state.scene.scale}
            onChange={(e) => this.onChangeScale(e)}>
            {SCALES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="sidebar-input">
          <label className="sidebar-input-left">bpm</label>
          <input name="bpm" type="number"
            min="0" max="50000"
            value={this.state.scene.bpm}
            onChange={(e) => this.onChangeBPM(e)}/>
        </div>

        <button name="save" type="button"
          onClick={() => this.saveEditor()}>
          save
        </button>

      </div>
    );
  }

  render () {
    return (
      <fieldset className="sidebar-module sidebar-name">
        <legend>
          <input name="name" type="text"
            value={this.state.scene.name || '-'}
            onChange={(e) => this.onChangeSceneName(e)}/>
        </legend>
        {this.state.isEditing ? this.renderControl() : this.renderDisplay()}
      </fieldset>
    );
  }

}

SidebarMasterHeader.propTypes = {
  scene         : React.PropTypes.any.isRequired,
  onChangeScene : React.PropTypes.func.isRequired,
};

module.exports = SidebarMasterHeader;
