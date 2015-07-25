class Midi
    constructor: (@player) ->
        @is_pressed = false
        @last_note  = 0

        navigator.requestMIDIAccess().then (m) =>
            console.log(m)
            values = m.inputs.values()
            inputs = []
            v = values.next()

            while v.done != true
                inputs.push(v.value)
                v = values.next()

            for i in inputs
                console.log(i)
                i.onmidimessage = (message) => @onMessage(message)

    onMessage: (m) ->
        console.log m
        data = m.data
        if 0x90 <= data[0] < 0x9F
            if @is_pressed == false
                @is_pressed = true
            @on(data[1])
        if 0x80 <= data[0] < 0x8F
            @is_pressed = false
            @off(data[1])

    on: (note) ->
        return if note == @last_note
        @onPlayer(note % 48)
        @last_key = note

    off: (e) ->
        @offPlayer(e)
        @last_key = 0

    onPlayer: (note) ->
        @player.noteOff(true, 0) if @player.isPlaying()
        @player.noteOn(note, true, 0) if note?

    offPlayer: (e) -> @player.noteOff(true)


module.exports = Midi
