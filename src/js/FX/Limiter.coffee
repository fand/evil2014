# DON'T NEED to extend FX
# FX = require './FX'

class Limiter
    constructor: (@ctx) ->
        @in = @ctx.createDynamicsCompressor()
        @out = @ctx.createDynamicsCompressor()

        @in.connect(@out)

        @in.threshold.value  = -6
        @out.threshold.value = -10
        @out.ratio.value     = 20

    connect: (dst) -> @out.connect(dst)

module.exports = Limiter
