const React = require('react');
const FuzzView = require('./FX/FuzzView');

const renderFX = (fx, key) => {
    if (fx.FX_TYPE === 'FUZZ') {
        console.log(fx);
        return <FuzzView model={fx} key={key}/>;
    }
    return null;
};

class EffectList extends React.Component {

    constructor () {
        super();
        this.state = {
            effects : [],
        };
    }

    render () {
        const rendered = this.state.effects.map((f, i) => renderFX(f, i));
        return (
          <div className="effect-list">
            {rendered}
          </div>
        );
    }

}

module.exports = EffectList;
