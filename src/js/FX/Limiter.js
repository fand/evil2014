// DON'T NEED to extend FX
// FX = require './FX'

class Limiter {

    constructor (ctx) {
        this.ctx = ctx;
        this.in  = this.ctx.createDynamicsCompressor();
        this.out = this.ctx.createDynamicsCompressor();

        this.in.connect(this.out);

        this.in.threshold.value  = -6;
        this.out.threshold.value = -10;
        this.out.ratio.value     = 20;
    }

    connect (dst) {
        this.out.connect(dst);
    }

}

module.exports = Limiter;
