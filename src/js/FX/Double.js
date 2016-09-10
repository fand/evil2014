const FX         = require('./FX');
const DoubleView = require('./DoubleView');
const Panner     = require('../Panner');

class Double extends FX {

    constructor (ctx) {
        super(ctx);

        this.delay = ctx.createDelay();
        this.delay.delayTime.value = 0.03;

        this.pan_l = new Panner(ctx);
        this.pan_r = new Panner(ctx);
        this.setWidth([0, 0, -1]);

        this.in.connect(this.pan_l.in);
        this.in.connect(this.delay);
        this.delay.connect(this.pan_r.in);
        this.pan_l.connect(this.out);
        this.pan_r.connect(this.out);

        this.out.gain.value = 0.6;

        this.view = new DoubleView(this);
    }

    setDelay (d) {
        this.delay.delayTime.value = d;
    }

    setWidth (pos) {
        this.pos = pos;
        this.pan_l.setPosition( this.pos);
        this.pan_r.setPosition(-this.pos);
    }

    setParam (p) {
        if (p.delay) { this.setDelay(p.delay); }
        if (p.width) { this.setWidth(p.width); }
        this.view.setParam(p);
    }

    getParam () {
        return {
            name  : 'Double',
            delay : this.delay.delayTime.value,
            width : this.pos,
        };
    }
}

module.exports = Double;
