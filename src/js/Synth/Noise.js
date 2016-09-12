const CONSTANT = require('../Constant');

// Noise Oscillator.
class Noise {

    constructor (ctx) {
        this.ctx = ctx;
        this.node = this.ctx.createScriptProcessor(CONSTANT.STREAM_LENGTH);
        this.node.onaudioprocess = (event) => {
            const data_L = event.outputBuffer.getChannelData(0);
            const data_R = event.outputBuffer.getChannelData(1);
            data_L.forEach((d, i) => {
                data_L[i] = data_R[i] = Math.random();
            });
        };
    }

    connect (dst) {
        this.node.connect(dst);
    }

    setOctave (octave) {
        this.octave = octave;
    }

    setFine (fine) {
        this.fine = fine;
    }

    setNote () {

    }

    setInterval (interval) {
        this.interval = interval;
    }

    setFreq () {
        console.log('Not implemented: Noise.prototype.setFreq');
    }

    setKey () {
        console.log('Not implemented: Noise.prototype.setKey');
    }

    setShape (shape) {
        this.shape = shape;
    }

    getParam () {
        return {
            shape    : this.shape,
            octave   : this.octave,
            interval : this.interval,
            fine     : this.fine,
        };
    }

    setParam (p) {
        this.shape    = p.shape;
        this.octave   = p.octave;
        this.interval = p.interval;
        this.fine     = p.fine;
    }

}

module.exports = Noise;
