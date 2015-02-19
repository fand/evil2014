SynthCoreView = require './SynthCoreView'
CONSTANT = require '../Constant'

VCO       = require './VCO'
EG        = require './EG'
ResFilter = require './ResFilter'
Noise     = require './Noise'

DELAY = 0.2

# Manages VCO, Noise, ResFilter, EG.
class SynthCore
    constructor: (@parent, @ctx, @id) ->
        @node = @ctx.createGain()
        @node.gain.value = 0
        @gain            = 1.0
        @is_mute         = false
        @is_on           = false
        @is_harmony      = true

        @scale = @parent.scale
        @vcos  = [new VCO(@ctx), new VCO(@ctx), new Noise(@ctx)]
        @gains = [@ctx.createGain(), @ctx.createGain(), @ctx.createGain()]
        for i in [0...3]
            @vcos[i].connect(@gains[i])
            @gains[i].gain.value = 0
            @gains[i].connect(@node)

        @filter = new ResFilter(@ctx)

        @eg  = new EG(@ctx, @node.gain, 0.0, @gain)
        @feg = new EG(@ctx, @filter.lpf.frequency, 0, 4080)

        # Noise generator for resonance.
        @gain_res = @ctx.createGain()
        @gain_res.gain.value = 0
        @vcos[2].connect(@gain_res)
        @gain_res.connect(@node)

        @view = new SynthCoreView(this, @id, @parent.view.dom.find('.synth-core'))

    getParam: ->
        type: 'REZ'
        vcos: (v.getParam() for v in @vcos)
        gains: (g.gain.value for g in @gains)
        eg:  @eg.getParam()
        feg: @feg.getParam()
        filter: [@feg.getRange()[1], @filter.getQ()]
        harmony: @is_harmony

    setParam: (p) ->
        if p.vcos?
            for i in [0...p.vcos.length]
                @vcos[i].setParam(p.vcos[i])
        if p.gains?
            for i in [0...p.gains.length]
                @gains[i].gain.value = p.gains[i]
        @eg.setParam(p.eg) if p.eg?
        @feg.setParam(p.feg) if p.feg?
        if p.filter?
            @feg.setRange(@feg.getRange()[0], p.filter[0], @ctx.currentTime)
            @filter.setQ(p.filter[1])
        @view.setParam(p)

    setVCOParam: (i, shape, oct, interval, fine, harmony) ->
        @vcos[i].setShape(shape)
        @vcos[i].setOctave(oct)
        @vcos[i].setInterval(interval)
        @vcos[i].setFine(fine)
        @vcos[i].setFreq(DELAY)
        if harmony?
            @is_harmony = (harmony == 'harmony')

    setEGParam:  (a, d, s, r) -> @eg.setADSR(a, d, s, r)
    setFEGParam: (a, d, s, r) -> @feg.setADSR(a, d, s, r)

    setFilterParam: (freq, q) ->
        @feg.setRange(80, Math.pow(freq/1000, 2.0) * 25000 + 80, @ctx.currentTime)
        @filter.setQ(q)
        @gain_res.gain.value = 0.1 * (q / 1000.0) if q > 1

    setVCOGain: (i, gain) ->
        ## Keep total gain <= 0.9
        @gains[i].gain.value = (gain / 100.0) * 0.3

    setGain: (@gain) ->
        @eg.setRange(0.0, @gain, @ctx.currentTime)

    noteOn: (delay) ->
        return if @is_mute
        return if @is_on
        delay = DELAY unless delay?
        t0 = @ctx.currentTime
        @eg.noteOn(t0 + delay)
        @feg.noteOn(t0 + delay)
        @is_on = true

    noteOff: ->
        return if not @is_on
        delay = DELAY unless delay?
        t0 = @ctx.currentTime
        @eg.noteOff(t0 + delay)
        @feg.noteOff(t0+ delay)
        @is_on = false

    setKey: (key) ->
        freq_key = CONSTANT.KEY_LIST[key]
        v.setKey(freq_key) for v in @vcos

    setScale: (@scale) ->

    connect: (dst) ->
        @node.connect(@filter.lpf)
        @filter.connect(dst)

    disconnect: () ->
        @filter.disconnect()
        @node.disconnect()

    # Converts interval (n-th note) to semitones.
    noteToSemitone: (note, shift) ->
        if @is_harmony
            note = note + shift
            note-- if shift > 0
            note++ if shift < 0
            semitone = Math.floor((note-1)/@scale.length) * 12 + @scale[(note-1) % @scale.length]
        else
            semitone = Math.floor((note-1)/@scale.length) * 12 + @scale[(note-1) % @scale.length] + shift

    setNote: (@note, delay) ->
        t0 = @ctx.currentTime
        delay = DELAY unless delay?
        for v in @vcos
            v.setNote(@noteToSemitone(@note, v.interval))
            v.setFreq(t0 + delay)

    mute:   -> @is_mute = true
    demute: -> @is_mute = false


module.exports = SynthCore
