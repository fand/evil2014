const CONSTANT = require('../Constant');

const TIME_OFFSET = [2, 3, 5, 7, 11, 13, 17];
const FREQ_OFFSET = [-3, 7, -11, 17, -23, 29, -31];

const OSC_TYPE = {
    SINE     : 'sine',
    RECT     : 'square',
    SAW      : 'sawtooth',
    TRIANGLE : 'triangle',
};

// Oscillators.
class VCO {

    constructor (ctx) {
        this.ctx = ctx;

        this.freq_key = 55;
        this.octave   = 4;
        this.interval = 0;
        this.fine     = 0;
        this.note     = 0;
        this.freq     = Math.pow(2, this.octave) * this.freq_key;

        this.node            = this.ctx.createGain();
        this.node.gain.value = 1.0;
        this.osc             = this.ctx.createOscillator();
        this.osc.type        = 'sine';

        this.oscs = [
            this.ctx.createOscillator(), this.ctx.createOscillator(),
            this.ctx.createOscillator(), this.ctx.createOscillator(),
            this.ctx.createOscillator(), this.ctx.createOscillator(),
            this.ctx.createOscillator()
        ];
        this.oscs.forEach((o, i) => o.detune.setValueAtTime(this.fine + FREQ_OFFSET[i], 0));

        this.setFreq(0);
        this.osc.start(0);
        this.oscs.forEach((o, i) => o.start(TIME_OFFSET[i]));
    }

    setOctave (octave) {
        this.octave = octave;
    }

    setNote (note) {
        this.note = note;
    }

    setKey (freq_key) {
        this.freq_key = freq_key;
    }

    setInterval (interval) {
        this.interval = interval;
    }

    setFine (fine) {
        this.file = fine;
        this.osc.detune.value = this.fine;
        this.oscs.forEach((o, i) => {
            o.detune.value = this.fine + FREQ_OFFSET[i];
        });
    }

    setShape (shape) {
        this.shape = shape;
        if (this.shape === 'SUPERSAW') {
            this.oscs.forEach((o) => {
                o.type = OSC_TYPE.SAW;
                o.connect(this.node);
            });
            this.osc.disconnect();
            this.node.gain.value = 0.9
        }
        else if (this.shape === 'SUPERRECT') {
            this.oscs.forEach((o) => {
                o.type = OSC_TYPE.RECT;
                o.connect(this.node);
            });
            this.osc.disconnect();
            this.node.gain.value = 0.9;
        }
        else {
            this.oscs.forEach(o => o.disconnect());
            this.osc.type = OSC_TYPE[this.shape];
            this.osc.connect(this.node);
            this.node.gain.value = 1.0;
        }
    }

    setFreq (delay) {
        const note_oct   = Math.floor(this.note / 12);
        const note_shift = this.note % 12;
        this.freq = (Math.pow(2, this.octave + note_oct) * Math.pow(CONSTANT.SEMITONE, note_shift) * this.freq_key) + this.fine;

        if (this.shape === 'SUPERSAW' || this.shape === 'SUPERRECT') {
            this.oscs.forEach((o) => {
                o.frequency.setValueAtTime(this.freq, delay);
            });
        }
        else {
            this.osc.frequency.setValueAtTime(this.freq, delay);
        }
    }

    connect (dst) {
        this.dst = dst;
        this.osc.connect(this.node);
        this.oscs.forEach(o => o.connect(this.node));
        this.node.connect(this.dst);
    }

    disconnect () {
        this.node.disconnect();
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
        this.octave   = p.octave;
        this.interval = p.interval;
        this.fine     = p.fine;
        this.setShape(p.shape);
    }

}

module.exports = VCO;
