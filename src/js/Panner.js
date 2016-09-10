class Panner {

    constructor (ctx) {
        this.ctx = ctx;
        this.in  = this.ctx.createChannelSplitter(2);
        this.out = this.ctx.createChannelMerger(2);
        this.l   = this.ctx.createGain();
        this.r   = this.ctx.createGain();
        this.in.connect(this.l, 0);
        this.in.connect(this.r, 1);
        this.l.connect(this.out, 0, 0);
        this.r.connect(this.out, 0, 1);
        this.setPosition(0.5);
    }

    connect (dst) {
        this.out.connect(dst);
    }

    setPosition (pos) {
        if (!Number.isFinite(pos)) { return; }
        this.pos          = pos;
        this.l.gain.value = pos;
        this.r.gain.value = 1.0 - pos;
    }

}

module.exports = Panner;
