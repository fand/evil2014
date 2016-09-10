CONSTANT = require '../Constant'

TIME_OFFSET = [2, 3, 5, 7, 11, 13, 17]
FREQ_OFFSET = [-3, 7, -11, 17, -23, 29, -31]

OSC_TYPE =
    SINE:     'sine'
    RECT:     'square'
    SAW:      'sawtooth'
    TRIANGLE: 'triangle'


# Oscillators.
class VCO
    constructor: (@ctx) ->
        @freq_key = 55
        @octave = 4
        @interval = 0
        @fine = 0
        @note = 0
        @freq = Math.pow(2, @octave) * @freq_key

        @node = @ctx.createGain()
        @node.gain.value = 1.0
        @osc = @ctx.createOscillator()
        @osc.type = 'sine'

        @oscs = [@ctx.createOscillator(), @ctx.createOscillator(), @ctx.createOscillator(), @ctx.createOscillator(),
                 @ctx.createOscillator(), @ctx.createOscillator(), @ctx.createOscillator()]
        @oscs[i].detune.setValueAtTime(@fine + FREQ_OFFSET[i], 0) for i in [1...7]

        @setFreq(0)
        @osc.start(0)
        @oscs[i].start(TIME_OFFSET[i]) for i in [0...7]


    setOctave: (@octave) ->
    setNote: (@note) ->
    setKey: (@freq_key) ->
    setInterval: (@interval) ->

    setFine: (@fine) ->
        @osc.detune.value = @fine
        @oscs[i].detune.value = @fine + FREQ_OFFSET[i] for i in [1...7]

    setShape: (@shape) ->
        if @shape == 'SUPERSAW'
            for o in @oscs
                o.type = OSC_TYPE['SAW']
                o.connect(@node)
            @osc.disconnect()
            @node.gain.value = 0.9
        else if @shape == 'SUPERRECT'
            for o in @oscs
                o.type = OSC_TYPE['RECT']
                o.connect(@node)
            @osc.disconnect()
            @node.gain.value = 0.9
        else
            o.disconnect() for o in @oscs
            @osc.type = OSC_TYPE[@shape]
            @osc.connect(@node)
            @node.gain.value = 1.0

    setFreq: (delay) ->
        note_oct = Math.floor(@note / 12)
        note_shift = @note % 12
        @freq = (Math.pow(2, @octave + note_oct) * Math.pow(CONSTANT.SEMITONE, note_shift) * @freq_key) + @fine

        if @shape == 'SUPERSAW' or @shape == 'SUPERRECT'
            for i in [0...7]
                @oscs[i].frequency.setValueAtTime(@freq, delay)
        else
            @osc.frequency.setValueAtTime(@freq, delay)

    connect: (@dst) ->
        @osc.connect(@node)
        o.connect(@node) for o in @oscs
        @node.connect(@dst)

    disconnect:    -> @node.disconnect()

    getParam: ->
        shape: @shape, octave: @octave, interval: @interval, fine: @fine

    setParam: (p) ->
        @octave = p.octave
        @interval = p.interval
        @fine = p.fine
        @setShape(p.shape)


module.exports = VCO
