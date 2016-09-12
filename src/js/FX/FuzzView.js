const FXView = require('./FXView');
const $      = require('jquery');
const React  = require('react');

class FuzzView extends React.Component {

  constructor () {
    super();
    this.state = {};
  }

  componentWillReceiveProps (nextProps) {
    this.setState(nextProps.model.getParam());
  }

  onChangeInput (e) {
    this.props.model.setInput(e.target.value / 100.0);
    this.setState(this.props.model.getParam());
  }
  onChangeOutput (e) {
    this.props.model.setOutput(e.target.value / 100.0);
    this.setState(this.props.model.getParam());
  }
  onChangeGain (e) {
    this.props.model.setGain(e.target.value / 100.0);
    this.setState(this.props.model.getParam());
  }
  onChangeType (e) {
    this.props.model.setType(e.target.value);
    this.setState(this.props.model.getParam());
  }

  render () {
    return (
      <div className="sidebar-effect">
        <fieldset className="sidebar-module">
          <legend>Fuzz</legend>
          <i className="fa fa-minus sidebar-effect-minus"></i>

          <div className="clearfix">
            <label>input</label>
            <input name="input"
              type="range" min="0" max="100"
              value={this.state.input * 100}
              onChange={(e) => this.onChangeInput(e)}/>
          </div>

          <div className="clearfix">
            <label>type</label>
            <select name="type"
              value={this.state.type}
              onChange={(e) => this.onChangeType(e)}>
              <option value="Sigmoid">Sigmoid</option>
              <option value="Octavia">Octavia</option>
            </select>
          </div>

          <div className="clearfix">
            <label>gain</label>
            <input name="gain"
              type="range" min="3" max="99"
              value={this.state.gain * 100}
              onChange={(e) => this.onChangeGain(e)}/>
          </div>

          <div className="clearfix">
            <label>output</label>
            <input name="output" type="range"
              min="0" max="100"
              value={this.state.output * 100}
              onChange={(e) => this.onChangeOutput(e)}/>
          </div>

        </fieldset>
      </div>
    );
  }

}

module.exports = FuzzView;
