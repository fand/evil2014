const React  = require('react');
const Reverb = require('./Reverb');

class ReverbView extends React.Component {

  constructor () {
    super();
    this.state = {};
  }

  componentWillReceiveProps (nextProps) {
    this.setState(nextProps.model.getParam());
  }

  onChangeIRname (e) {
    this.props.model.setIRname(e.target.value);
    this.setState(this.props.model.getParam());
  }
  onChangeWet (e) {
    this.props.model.setWet(e.target.value / 100.0);
    this.setState(this.props.model.getParam());
  }

  render () {
    return (
      <fieldset className="sidebar-effect sidebar-module">
        <legend>Reverb</legend>
        <i className="fa fa-minus sidebar-effect-minus"/>

        <div className="clearfix">
          <label>type</label>
          <select name="name"
            value={this.state.IRname}
            onChange={(e) => this.onChangeIRname(e)}>
            {Object.keys(Reverb.IR_URL).map(i => <option value={i} key={i}>{i}</option>)}
          </select>
        </div>

        <div className="clearfix">
          <label>wet</label>
          <input name="wet" type="range"
            min="0" max="100"
            value={this.state.wet * 100}
            onChange={(e) => this.onChangeWet(e)}/>
        </div>

      </fieldset>

    );
  }

}

module.exports = ReverbView;
