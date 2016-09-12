const $ = require('jquery');

class FX {

    constructor (ctx) {
        this.ctx = ctx;
        this.in  = this.ctx.createGain();
        this.dry = this.ctx.createGain();
        this.wet = this.ctx.createGain();
        this.out = this.ctx.createGain();
        this.in.gain.value  = 1.0;
        this.dry.gain.value = 1.0;
        this.wet.gain.value = 1.0;
        this.out.gain.value = 1.0;
    }

    connect (dst) {
        this.out.connect(dst);
    }

    disconnect () {
        this.out.disconnect();
    }

    setInput (d) {
        this.in.gain.value  = d;
    }

    setOutput (d) {
        this.out.gain.value = d;
    }

    setDry (d) {
        this.dry.gain.value = d;
    }

    setWet (d) {
        this.wet.gain.value = d;
    }

    /**
     * Called by SidebarView.
     * @param {HTMLElement} dst
     */
    appendTo (dst) {
        $(dst).append(this.view.dom);
        this.view.initEvent();
    }

    remove () {
        this.source.removeEffect(this);
    }

    /**
     * @param {(Sampler|Synth|Mixer)}
     */
    setSource (source) {
        this.source = source;
    }

}

module.exports = FX;
