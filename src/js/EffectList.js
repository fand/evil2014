const React          = require('react');
const FuzzView       = require('./FX/FuzzView');
const DoubleView     = require('./FX/DoubleView');
const DelayView      = require('./FX/DelayView');
const CompressorView = require('./FX/CompressorView');
const ReverbView     = require('./FX/ReverbView');

const renderFX = (fx, key) => {
    if (fx.FX_TYPE === 'FUZZ') {
        return <FuzzView model={fx} key={key}/>;
    }
    if (fx.FX_TYPE === 'DOUBLE') {
        return <DoubleView model={fx} key={key}/>;
    }
    if (fx.FX_TYPE === 'DELAY') {
        return <DelayView model={fx} key={key}/>;
    }
    if (fx.FX_TYPE === 'COMPRESSOR') {
        return <CompressorView model={fx} key={key}/>;
    }
    if (fx.FX_TYPE === 'REVERB') {
        return <ReverbView model={fx} key={key}/>;
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
