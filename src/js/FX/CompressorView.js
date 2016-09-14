const React  = require('react');

class CompressorView extends React.Component {

  constructor () {
    super();
    this.state = {};
  }

  componentWillReceiveProps (nextProps) {
    this.setState(nextProps.model.getParam());
  }

  update (e) {
    this.props.model.setInput(this.input.value / 100.0);
    this.props.model.setOutput(this.output.value / 100.0);
    this.props.model.setAttack(this.attack.value / 1000.0);
    this.props.model.setRelease(this.release.value / 1000.0);
    this.props.model.setThreshold(this.threshold.value / -10.0);
    this.props.model.setRatio(this.ratio.value);
    this.props.model.setKnee(this.knee.value / 1000.0);
    this.setState(this.props.model.getParam());
  }

  render () {
    return (
      <fieldset className="sidebar-effect sidebar-module">
        <legend>Comp</legend>
        <i className="fa fa-minus sidebar-effect-minus"/>

        <div className="clearfix">
          <label>input</label>
          <input name="input" type="range"
            min="0" max="100"
            ref={i => { this.input = i; }}
            value={this.state.input * 100}
            onChange={() => this.update()}/>
        </div>

        <div className="clearfix">
          <label>attack</label>
          <input name="attack" type="range"
            min="0" max="1000"
            ref={i => { this.attack = i; }}
            value={this.state.attack * 1000}
            onChange={() => this.update()}/>
        </div>

        <div className="clearfix">
          <label>release</label>
          <input name="release" type="range"
            min="1" max="1000"
            ref={i => { this.release = i; }}
            value={this.state.release * 1000}
            onChange={() => this.update()}/>
        </div>

        <div className="clearfix">
          <label>threshold</label>
          <input name="threshold" type="range"
            min="0" max="1000"
            ref={i => { this.threshold = i; }}
            value={this.state.threshold * -10}
            onChange={() => this.update()}/>
        </div>

        <div className="clearfix">
          <label>ratio</label>
          <input name="ratio" type="range"
            min="1" max="20"
            ref={i => { this.ratio = i; }}
            value={this.state.ratio}
            onChange={() => this.update()}/>
        </div>

        <div className="clearfix">
          <label>knee</label>
          <input name="knee" type="range"
            min="0" max="40"
            ref={i => { this.knee = i; }}
            value={this.state.knee * 1000}
            onChange={() => this.update()}/>
        </div>

        <div className="clearfix">
          <label>output</label>
          <input name="output" type="range"
            min="0" max="100"
            ref={i => { this.output = i; }}
            value={this.state.output * 100}
            onChange={() => this.update()}/>
        </div>

      </fieldset>
    );
  }

}

module.exports = CompressorView;
