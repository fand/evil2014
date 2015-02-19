# Manages filter params.
class ResFilter
    constructor: (@ctx) ->
        @lpf = @ctx.createBiquadFilter()
        @lpf.type = 'lowpass'  # lowpass == 0
        @lpf.gain.value = 1.0

    connect:    (dst)  -> @lpf.connect(dst)
    disconnect:    ()  -> @lpf.disconnect()
    getResonance:      -> @lpf.Q.value
    setQ: (Q) -> @lpf.Q.value = Q
    getQ: ()  -> @lpf.Q.value

module.exports = ResFilter
