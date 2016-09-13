const React = require('react');

const EFFECT_NAMES = [
  'Fuzz',
  'Double',
  'Comp',
  'Delay',
  'Reverb',
];


class SidebarFooter extends React.Component {

  onClick () {
    this.props.onAdd(this.select.value);
  }

  render () {
    return (
      <fieldset className="sidebar-module sidebar-add-effect clearfix">
        <select className="add-type" ref={(s) => { this.select = s; }}>
          {EFFECT_NAMES.map(f => <option key={f}>{f}</option>)}
        </select>
        <button type="button" className="add-btn"
          onClick={() => this.onClick()}>
          add
        </button>
      </fieldset>
    );
  }

}

SidebarFooter.propTypes = {
  onAdd: React.PropTypes.func.isRequired,
};

module.exports = SidebarFooter;
