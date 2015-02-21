_ = require 'underscore'

SynthView = require './SynthView'
SynthCore = require './Synth/SynthCore'
Panner    = require './Panner'

Fuzz       = require './FX/Fuzz'
Delay      = require './FX/Delay'
Reverb     = require './FX/Reverb'
Compressor = require './FX/Compressor'
Double     = require './FX/Double'

CONSTANT  = require './Constant'


SCALE_LIST =
    Major:      [0,2,4,5,7,9,11]
    minor:      [0,2,3,5,7,8,10]
    Pentatonic: [0,3,5,7,10]
    Dorian:     [0,2,3,5,7,9,10]
    Phrygian:   [0,1,3,5,7,8,10]
    Lydian:     [0,2,4,6,7,9,11]
    Mixolydian: [0,2,4,5,7,9,10]
    CHROMATIC:  [0,1,2,3,4,5,6,7,8,9,10,11]
    'Harm-minor': [0,2,3,5,7,8,11]


#T2 = new MutekiTimer()
T2 = window

# Manages SynthCore, SynthView.
class Synth
    constructor: (@ctx, @id, @player, @name) ->
        @type = 'REZ'
        @name = 'Synth #' + @id if not @name?
        @pattern_name = 'pattern 0'
        @pattern = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        @pattern_obj = name: @pattern_name, pattern: @pattern
        @time = 0
        @scale_name = 'Major'
        @scale = SCALE_LIST[@scale_name]
        @view = new SynthView(this, @id)
        @core = new SynthCore(this, @ctx, @id)

        @is_on = false
        @is_sustaining = false
        @is_performing = false
        @session = @player.session

        @send   = @ctx.createGain()
        @return = @ctx.createGain()
        @send.gain.value   = 1.0
        @return.gain.value = 1.0
        @core.connect(@send)
        @send.connect(@return)

        @effects = []

        #@T = new MutekiTimer()
        @T = window

    connect: (dst) ->
        if dst instanceof Panner
            @return.connect(dst.in)
        else
            @return.connect(dst)

    disconnect: () -> @return.disconnect()

    setDuration: (@duration) ->
    setKey:  (key) -> @core.setKey(key)
    setNote: (note) -> @core.setNote(note)

    setScale: (@scale_name) ->
        @scale = SCALE_LIST[@scale_name]
        @core.scale = @scale
        @view.changeScale(@scale)

    setGain: (gain) -> @core.setGain(gain)
    getGain: ()     -> @core.gain

    noteOn: (note, force, delay) ->
        if force or not @is_performing
            @core.setNote(note, delay)
            @core.noteOn(delay)
        if force
            @is_performing = true

    noteOff: (force, delay)->
        @is_performing = false if force
        if not @is_performing
            @core.noteOff(delay)

    playAt: (@time) ->
        mytime = @time % @pattern.length
        @view.playAt(mytime)
        return if @is_performing

        # off
        if @pattern[mytime] == 0
            @core.noteOff()

        # sustain start
        else if @pattern[mytime] < 0
            @is_sustaining = true
            n = -( @pattern[mytime] )
            @core.setNote(n)
            @core.noteOn()

        # sustain mid
        else if @pattern[mytime] == 'sustain'
            return

        # sustain end
        else if @pattern[mytime] == 'end'
            T2.setTimeout((() => @core.noteOff()), @duration - 10)

        # single note
        else
            @core.setNote(@pattern[mytime])
            @core.noteOn()
            T2.setTimeout((() => @core.noteOff()), @duration - 10)

    play: () ->
        @view.play()

    stop: () ->
        @core.noteOff()
        @view.stop()

    pause: (time) ->
        @core.noteOff()

    setPattern: (_pattern_obj) ->
        @pattern_obj  = _.extend({}, _pattern_obj)
        @pattern      = @pattern_obj.pattern
        @pattern_name = @pattern_obj.name
        @view.setPattern(@pattern_obj)

    getPattern: () ->
        @pattern_obj = name: @pattern_name, pattern: @pattern
        _.extend({}, @pattern_obj)

    clearPattern: () ->
        @pattern = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        @pattern_obj.pattern = @pattern
        @view.setPattern(@pattern_obj)

    # Changes the length of @pattern.
    plusPattern: ->
        @pattern = @pattern.concat([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        @player.resetSceneLength()

    minusPattern: ->
        @pattern = @pattern.slice(0, @pattern.length - 32)
        @player.resetSceneLength()

    addNote: (time, note) ->
        @pattern[time] = note

    removeNote: (time) ->
        @pattern[time] = 0

    sustainNote: (l, r, note) ->
        if l == r
            @pattern[l] = note
            return
        for i in [l...r]
            @pattern[i] = 'sustain'
        @pattern[l] = -(note)
        @pattern[r] = 'end'

    activate: (i) -> @view.activate(i)
    inactivate: (i) -> @view.inactivate(i)

    redraw: (@time) ->
        @view.drawPattern(@time)

    # called by SynthView.
    inputPatternName: (@pattern_name) ->
        @session.setPatternName(@id, @pattern_name)

    setPatternName: (@pattern_name) ->
        @view.setPatternName(@pattern_name)

    setSynthName: (@name) ->
        @session.setSynthName(@id, @name)
        @view.setSynthName(@name)

    # Get new Synth and replace.
    # called by SynthView.
    changeSynth: (type) ->
        s_new = @player.changeSynth(@id, type, s_new)
        @view.dom.replaceWith(s_new.view.dom)
        @noteOff(true)
        @disconnect()

    # Get params as object.
    getParam: ->
        p            = @core.getParam()
        p.name       = @name
        p.scale_name = @scale_name
        p.effects    = @getEffectsParam()
        return p

    setParam: (p) ->
        return if not p?
        @core.setParam(p)
        @setEffects(p.effects) if p.effects?

    mute:   -> @core.mute()
    demute: -> @core.demute()

    # Set effects' params from the song.
    setEffects: (effects_new) ->
        e.disconnect() for e in @effects
        @effects = []

        for e in effects_new
            if e.name == 'Fuzz'
                fx = new Fuzz(@ctx)
            else if e.name == 'Delay'
                fx = new Delay(@ctx)
            else if e.name == 'Reverb'
                fx = new Reverb(@ctx)
            else if e.name == 'Comp'
                fx = new Compressor(@ctx)
            else if e.name == 'Double'
                fx = new Double(@ctx)

            @insertEffect(fx)
            fx.setParam(e)

    getEffectsParam: ->
        f.getParam() for f in @effects

    insertEffect: (fx) ->

        if @effects.length == 0
            @send.disconnect()
            @send.connect(fx.in)
        else
            @effects[@effects.length - 1].disconnect()
            @effects[@effects.length - 1].connect(fx.in)

        fx.connect(@return)
        fx.setSource(this)
        @effects.push(fx)

    removeEffect: (fx) ->
        i = @effects.indexOf(fx)
        return if i == -1

        if i == 0
            prev = @send
        else
            prev = @effects[i - 1]

        prev.disconnect()
        if @effects[i + 1]?
            prev.connect(@effects[i + 1].in)
        else
            prev.connect(@return)

        fx.disconnect()
        @effects.splice(i, 1)


module.exports = Synth
