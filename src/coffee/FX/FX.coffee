class FX
    constructor: (@ctx) ->
        @in  = @ctx.createGain()
        @dry = @ctx.createGain()
        @wet = @ctx.createGain()
        @out = @ctx.createGain()
        @in.gain.value  = 1.0
        @dry.gain.value = 1.0
        @wet.gain.value = 1.0
        @out.gain.value = 1.0

    connect: (dst) -> @out.connect(dst)
    disconnect: () -> @out.disconnect()

    setInput:  (d) -> @in.gain.value  = d
    setOutput: (d) -> @out.gain.value = d
    setDry:    (d) -> @dry.gain.value = d
    setWet:    (d) -> @wet.gain.value = d

    appendTo: (dst) ->
        $(dst).append(@view.dom)
        @view.initEvent()

    remove: () ->
        @source.removeEffect(this)

    setSource: (@source) ->

module.exports = FX
