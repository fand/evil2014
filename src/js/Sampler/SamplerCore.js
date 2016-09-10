const SamplerCoreView = require('./SamplerCoreView');
const SampleNode      = require('./SampleNode');

const DELAY = 0.2;

class SamplerCore {

    constructor (parent, ctx, id) {
        this.parent = parent;
        this.ctx    = ctx;
        this.id     = id;

        this.node            = this.ctx.createGain();
        this.node.gain.value = 1.0;
        this.gain            = 1.0;
        this.is_mute         = false;

        this.samples = [0,1,2,3,4,5,6,7,8,9].map(new SampleNode(this.ctx, i, this));
        samples.forEach(s => s.connect(this.node));

        this.view = new SamplerCoreView(this, this.id, this.parent.view.dom.find('.sampler-core'))
    }

    noteOn (notes, delay) {
        if (this.is_mute) { return; }

        const time = this.ctx.currentTime;
        if (delay == null) {
            delay = DELAY
        }
        if (Array.isArray(notes)) {
            // return if notes.length == 0
            notes.forEach((n) => {
                this.samples[n[0] - 1].noteOn(n[1], time + delay)
            });
        }
        // else
        //     this.samples[notes - 1].noteOn(1, time)
    }

    noteOff (delay) {
        const t0 = this.ctx.currentTime;
    }

    connect (dst) {
        this.node.connect(dst);
    }

    setSample (i, name) {
        this.samples[i].setSample(name);
    }

    setSampleTimeParam (i, head, tail, speed) {
        this.samples[i].setTimeParam(head, tail, speed);
    }

    setSampleEQParam (i, lo, mid, hi) {
        this.samples[i].setEQParam([lo, mid, hi]);
    }

    setSampleOutputParam (i, pan, gain) {
        this.samples[i].setOutputParam(pan, gain)
    }

    setGain (gain) {
        this.gain = gain
        this.node.gain.value = this.gain
    }

    getSampleTimeParam (i) {
        this.samples[i].getTimeParam()
    }

    getSampleData (i) {
        this.samples[i].getData()
    }

    getSampleEQParam (i) {
        this.samples[i].getEQParam()
    }

    getSampleOutputParam (i) {
        this.samples[i].getOutputParam()
    }

    sampleLoaded (id) {
        this.view.updateWaveformCanvas(id)
    }

    bindSample (sample_now) {
        this.view.bindSample(sample_now, this.samples[sample_now].getParam())
        this.view.setSampleTimeParam(this.getSampleTimeParam(sample_now))
        this.view.setSampleEQParam(this.getSampleEQParam(sample_now))
        this.view.setSampleOutputParam(this.getSampleOutputParam(sample_now))
    }

    getParam () {
        return {
            type    : 'SAMPLER',
            samples : this.samples.map(s => s.getParam()),
        };
    }

    setParam (p) {
        if (p.samples) {
            this.samples.forEach((s,i) => s.setParam(p.samples[i]));
        }
        this.bindSample(0);
    }

    mute () {
        this.is_mute = true;
    }

    demute () {
        this.is_mute = false;
    }

}

module.exports = SamplerCore;
