// Envelope generator.
class EG {

    constructor (ctx, target, min, max) {
        this.ctx    = ctx;
        this.target = target;
        this.min    = min;
        this.max    = max;

        this.attack  = 0;
        this.decay   = 0;
        this.sustain = 0.0;
        this.release = 0;
    }

    getADSR () {
        return [this.attack, this.decay, this.sustain, this.release];
    }

    setADSR (attack, decay, sustain, release) {
        this.attack  = attack  / 50000.0;
        this.decay   = decay   / 50000.0;
        this.sustain = sustain / 100.0;
        this.release = release / 50000.0;
    }

    getRange () {
        return [this.min, this.max];
    }

    setRange  (min, max, delay) {
        if (delay == null) {
            delay = this.ctx.currentTime;
        }

        const range = max - min;
        const ratio = (this.target.value - this.min) / (this.max - this.min);
        let value = range * ratio;

        if (Number.isFinite(value)) {
            value = 0;
        }

        this.target.setValueAtTime(value, delay);
        [this.min, this.max] = [min, max];
    }

    getParam () {
        return {
            adsr  : this.getADSR(),
            range : this.getRange(),
        };
    }

    setParam (p) {
        [this.attack, this.decay, this.sustain, this.release] = p.adsr;
        this.setRange(p.range[0], p.range[1]);
    }

    noteOn (time) {
        this.target.cancelScheduledValues(time - 0.001);
        this.target.setValueAtTime(this.min, time);
        this.target.linearRampToValueAtTime(this.max, time + this.attack);  // Attack
        this.target.linearRampToValueAtTime(this.sustain * (this.max - this.min) + this.min, (time + this.attack + this.decay)); // Decay
    }

    noteOff (time) {
        this.target.linearRampToValueAtTime(this.min, time + this.release);
        this.target.cancelScheduledValues(time + this.release + 0.001);
    }

}

module.exports = EG;
