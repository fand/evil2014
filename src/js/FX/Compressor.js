const FX             = require('./FX');
const CompressorView = require('./CompressorView');

class Compressor extends FX {

    constructor (ctx) {
        super(ctx);
        this.comp = this.ctx.createDynamicsCompressor();
        this.in.connect(this.comp);
        this.comp.connect(this.out);
        this.in.gain.value  = 1.0;
        this.out.gain.value = 1.0;

        this.view = new CompressorView(this);
    }

    setAttack (d) {
        this.comp.attack.value = d;
    }

    setRelease (d) {
        this.comp.release.value = d;
    }

    setThreshold (d) {
        this.comp.threshold.value = d;
    }

    setRatio (d) {
        this.comp.ratio.value = d;
    }

    setKnee (d) {
        this.comp.knee.value = d;
    }

    setParam (p) {
        if (p.attack != null)    { this.setAttack(p.attack); }
        if (p.release != null)   { this.setRelease(p.release); }
        if (p.threshold != null) { this.setThreshold(p.threshold); }
        if (p.ratio != null)     { this.setRatio(p.ratio); }
        if (p.knee != null)      { this.setKnee(p.knee); }
        if (p.input != null)     { this.setInput(p.input); }
        if (p.output != null)    { this.setOutput(p.output); }
        this.view.setParam(p);
    }

    getParam () {
        return {
            name      : 'Compressor',
            attack    : this.comp.attack.value,
            release   : this.comp.release.value,
            threshold : this.comp.threshold.value,
            ratio     : this.comp.ratio.value,
            knee      : this.comp.knee.value,
            input     : this.in.gain.value,
            output    : this.out.gain.value,
        };
    }

}

module.exports = Compressor;
