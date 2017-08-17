const SynthCoreView = require('./SynthCoreView');
const CONSTANT      = require('../Constant');

const VCO       = require('./VCO');
const EG        = require('./EG');
const ResFilter = require('./ResFilter');
const Noise     = require('./Noise');

const DELAY = 0.2;

// Manages VCO, Noise, ResFilter, EG.
class SynthCore {

    constructor (parent, ctx, id) {
        this.parent = parent;
        this.ctx    = ctx;
        this.id     = id;

        this.node = this.ctx.createGain();
        this.node.gain.value = 0;
        this.gain            = 1.0;
        this.is_mute         = false;
        this.is_on           = false;
        this.is_harmony      = true;

        this.scale = this.parent.scale;
        this.vcos  = [new VCO(this.ctx), new VCO(this.ctx), new Noise(this.ctx)];
        this.gains = [this.ctx.createGain(), this.ctx.createGain(), this.ctx.createGain()];

        this.vcos.forEach((v, i) => {
            v.connect(this.gains[i]);
            this.gains[i].gain.value = 0;
            this.gains[i].connect(this.node);
        });

        this.filter = new ResFilter(this.ctx);

        this.eg  = new EG(this.ctx, this.node.gain, 0.0, this.gain);
        this.feg = new EG(this.ctx, this.filter.lpf.frequency, 0, 4080);

        // Noise generator for resonance.
        this.gain_res = this.ctx.createGain();
        this.gain_res.gain.value = 0;
        this.vcos[2].connect(this.gain_res);
        this.gain_res.connect(this.node);

        this.view = new SynthCoreView(this, this.id, this.parent.view.dom.find('.synth-core'));
    }

    getParam () {
        return {
            type    : 'REZ',
            vcos    : this.vcos.map(v => v.getParam()),
            gains   : this.gains.map(g => g.gain.value),
            eg      : this.eg.getParam(),
            feg     : this.feg.getParam(),
            filter  : [this.feg.getRange()[1], this.filter.getQ()],
            harmony : this.is_harmony,
        };
    }

    setParam (p) {
        if (p.vcos != null) {
            this.vcos.forEach((v, i) => v.setParam(p.vcos[i]));
        }

        if (p.gains != null) {
            this.gains.forEach((g, i) => { g.gain.value = p.gains[i]; });
        }

        if (p.eg != null) { this.eg.setParam(p.eg); }
        if (p.feg != null) { this.feg.setParam(p.feg); }

        if (p.filter != null) {
            this.feg.setRange(this.feg.getRange()[0], p.filter[0], this.ctx.currentTime);
            this.filter.setQ(p.filter[1]);
        }

        this.view.setParam(p);
    }

    setVCOParam (i, shape, oct, interval, fine, harmony) {
        this.vcos[i].setShape(shape);
        this.vcos[i].setOctave(oct);
        this.vcos[i].setInterval(interval);
        this.vcos[i].setFine(fine);
        this.vcos[i].setFreq(DELAY);
        if (harmony != null) {
            this.is_harmony = (harmony === 'harmony');
        }
    }

    setEGParam (a, d, s, r) {
        this.eg.setADSR(a, d, s, r);
    }

    setFEGParam (a, d, s, r) {
        this.feg.setADSR(a, d, s, r);
    }

    setFilterParam (freq, q) {
        this.feg.setRange(80, Math.pow(freq/1000, 2.0) * 25000 + 80, this.ctx.currentTime);
        this.filter.setQ(q);
        if (q > 1) {
            this.gain_res.gain.value = 0.1 * (q / 1000.0);
        }
    }

    setVCOGain (i, gain) {
        // Keep total gain <= 0.9
        this.gains[i].gain.value = (gain / 100.0) * 0.3;
    }

    setGain (gain) {
        this.gain = gain;
        this.eg.setRange(0.0, this.gain, this.ctx.currentTime);
    }

    noteOn (delay) {
        if (this.is_mute || this.is_on) { return; }
        delay = delay || DELAY;
        const t0 = this.ctx.currentTime;
        this.eg.noteOn(t0 + delay);
        this.feg.noteOn(t0 + delay);
        this.is_on = true;
    }

    noteOff () {
        if (!this.is_on) { return; }
        const delay = DELAY;
        const t0 = this.ctx.currentTime;
        this.eg.noteOff(t0 + delay);
        this.feg.noteOff(t0 + delay);
        this.is_on = false;
    }

    setKey (key) {
        const freq_key = CONSTANT.KEY_LIST[key];
        this.vcos.forEach(v => v.setKey(freq_key));
    }

    setScale (scale) {
        this.scale = scale;
    }

    connect (dst) {
        this.node.connect(this.filter.lpf);
        this.filter.connect(dst);
    }

    disconnect () {
        this.filter.disconnect();
        this.node.disconnect();
    }

    // Converts interval (n-th note) to semitones.
    noteToSemitone (note, shift) {
        if (this.is_harmony) {
            note = note + shift;
            if (shift > 0) {
                note--;
            }
            if (shift < 0) {
                note++;
            }
            return Math.floor((note-1)/this.scale.length) * 12 + this.scale[(note-1) % this.scale.length]
        }
        else {
            return Math.floor((note-1)/this.scale.length) * 12 + this.scale[(note-1) % this.scale.length] + shift;
        }
    }

    setNote (note, delay) {
        this.note = note;
        const t0 = this.ctx.currentTime;
        delay = delay || DELAY;
        this.vcos.forEach((v) => {
            v.setNote(this.noteToSemitone(this.note, v.interval));
            v.setFreq(t0 + delay);
        });
    }

    mute () {
        this.is_mute = true;
    }

    demute () {
        this.is_mute = false;
    }

}

module.exports = SynthCore;
