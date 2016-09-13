const FX = require('./FX');

class Delay extends FX {

    constructor (ctx) {
        super(ctx);
        this.FX_TYPE = 'DELAY';

        this.delay = this.ctx.createDelay();
        this.delay.delayTime.value = 0.23;

        this.lofi                 = this.ctx.createBiquadFilter();
        this.lofi.type            = 'peaking';
        this.lofi.frequency.value = 1200;
        this.lofi.Q.value         = 0.0;  // range is [0.0, 5.0]
        this.lofi.gain.value      = 1.0;

        this.feedback = this.ctx.createGain();
        this.feedback.gain.value = 0.2;

        this.in.connect(this.lofi);
        this.lofi.connect(this.delay);
        this.delay.connect(this.wet);
        this.delay.connect(this.feedback);
        this.feedback.connect(this.lofi);

        this.wet.connect(this.out);
        this.in.connect(this.out);
    }

    setDelay (d) {
        this.delay.delayTime.value = d;
    }

    setFeedback (d) {
        this.feedback.gain.value = d;
    }

    setLofi (d) {
        this.lofi.Q.value = d;
    }

    setParam (p) {
        if (p.delay) { this.setDelay(p.delay); }
        if (p.feedback) { this.setFeedback(p.feedback); }
        if (p.lofi) { this.setLofi(p.lofi); }
        if (p.wet) { this.setWet(p.wet); }
        this.view.setParam(p);
    }

    getParam () {
        return {
            name     : 'Delay',
            delay    : this.delay.delayTime.value,
            feedback : this.feedback.gain.value,
            lofi     : this.lofi.Q.value,
            wet      : this.wet.gain.value,
        };
    }
}

module.exports = Delay;
