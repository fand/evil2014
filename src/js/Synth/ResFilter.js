// Manages filter params.
class ResFilter {

    constructor (ctx) {
        this.ctx = ctx;
        this.lpf = this.ctx.createBiquadFilter();
        this.lpf.type = 'lowpass';  // lowpass == 0
        this.lpf.gain.value = 1.0;
    }

    connect (dst) {
        this.lpf.connect(dst);
    }

    disconnect () {
        this.lpf.disconnect();
    }

    getResonance () {
        return this.lpf.Q.value;
    }

    setQ (Q) {
        this.lpf.Q.value = Q;
    }

    getQ () {
        return this.lpf.Q.value;
    }

}

module.exports = ResFilter;
