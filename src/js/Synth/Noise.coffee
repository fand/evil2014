CONSTANT = require '../Constant'

# Noise Oscillator.
class Noise
    constructor: (@ctx) ->
        @node = @ctx.createScriptProcessor(CONSTANT.STREAM_LENGTH)
        @node.onaudioprocess = (event) =>
            data_L = event.outputBuffer.getChannelData(0);
            data_R = event.outputBuffer.getChannelData(1);
            for i in [0...data_L.length]
                data_L[i] = data_R[i] = Math.random()

    connect: (dst) -> @node.connect(dst)
    setOctave: (@octae) ->
    setFine: (@fine) ->
    setNote: ->
    setInterval: (@interval) ->
    setFreq: ->
    setKey:  ->
    setShape: (@shape) ->

    getParam: ->
        shape: @shape, octave: @octave, interval: @interval, fine: @fine

    setParam: (p) ->
        @shape = p.shape
        @octave = p.octave
        @interval = p.interval
        @fine = p.fine


module.exports = Noise
