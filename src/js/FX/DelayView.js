const React = require('react');

class DelayView extends React.Component {

  constructor () {
    super();
    this.state = {};
  }

  componentWillReceiveProps (nextProps) {
    this.setState(nextProps.model.getParam());
  }

  onChangeDelay (e) {
    this.props.model.setDelay(e.target.value / 1000.0);
    this.setState(this.props.model.getParam());
  }

  onChangeWidth (e) {
    this.props.model.setWidth(e.target.value / 200.0 + 0.5);
    this.setState(this.props.model.getParam());
  }

  render () {
    return (
      <fieldset className="sidebar-effect sidebar-module">
        <legend>Delay</legend>
        <i className="fa fa-minus sidebar-effect-minus"/>

        <div className="clearfix">
          <label>delay</label>
          <input name="delay" type="range"
            min="50" max="1000"
            value={this.state.delay * 1000}
            onChange={(e) => this.onChangeDelay(e)}/>
        </div>

        <div className="clearfix">
          <label>feedback</label>
          <input name="feedback" type="range"
            min="0" max="100"
            value={this.state.feedback * 100}
            onChange={(e) => this.onChangeFeedback(e)}/>
        </div>

        <div className="clearfix">
          <label>lofi</label>
          <input name="lofi" type="range"
            min="0" max="100"
            value={this.state.lofi * 20}
            onChange={(e) => this.onChangeLofi(e)}/>
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

module.exports = DelayView;
