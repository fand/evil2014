# Envelope generator.
class EG
    constructor: (@ctx, @target, @min, @max) ->
        @attack  = 0
        @decay   = 0
        @sustain = 0.0
        @release = 0

    getADSR: -> [@attack, @decay, @sustain, @release]
    setADSR: (attack, decay, sustain, release) ->
        @attack  = attack  / 50000.0
        @decay   = decay   / 50000.0
        @sustain = sustain / 100.0
        @release = release / 50000.0

    getRange: -> [@min, @max]
    setRange:  (min, max, delay) ->
        delay = @ctx.currentTime unless delay?
        range = max - min
        ratio = (@target.value - @min) / (@max - @min)
        value = range * ratio

        if !(isFinite(value) && value == value)
            value = 0

        @target.setValueAtTime(value, delay)
        [@min, @max] = [min, max]

    getParam: -> adsr: @getADSR(), range: @getRange()
    setParam: (p) ->
        [@attack, @decay, @sustain, @release] = p.adsr
        @setRange(p.range[0], p.range[1])

    noteOn: (time) ->
        @target.cancelScheduledValues(time - 0.001)
        @target.setValueAtTime(@min, time)
        @target.linearRampToValueAtTime(@max, time + @attack)  # Attack
        @target.linearRampToValueAtTime(@sustain * (@max - @min) + @min, (time + @attack + @decay)) # Decay

    noteOff: (time) ->
        @target.linearRampToValueAtTime(@min, time + @release)
        @target.cancelScheduledValues(time + @release + 0.001)


module.exports = EG
