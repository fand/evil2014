const React  = require('react');

class DoubleView extends React.Component {

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
        <legend>Double</legend>
        <i className="fa fa-minus sidebar-effect-minus"/>

        <div className="clearfix">
          <label>delay</label>
          <input name="delay" type="range"
            min="10" max="100"
            value={this.state.delay * 1000}
            onChange={(e) => this.onChangeDelay(e)}/>
         </div>

        <div className="clearfix">
          <label>width</label>
          <input name="width" type="range"
            min="0" max="100"
            value={(this.state.width - 0.5) * 200}
            onChange={(e) => this.onChangeWidth(e)}/>
        </div>

      </fieldset>
    );
  }

}

module.exports = DoubleView;
