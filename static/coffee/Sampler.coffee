@SAMPLES = [
    {name: 'kick1', url: 'static/wav/kick1.wav'},
    {name: 'kick1', url: 'static/wav/kick1.wav'},
    {name: 'kick1', url: 'static/wav/kick1.wav'},
    {name: 'kick2', url: 'static/wav/kick2.wav'},
    {name: 'snare1', url: 'static/wav/snare1.wav'},
    {name: 'snare2', url: 'static/wav/snare2.wav'},
    {name: 'clap', url: 'static/wav/clap.wav'},
    {name: 'hat_closed', url: 'static/wav/hat_closed.wav'},
    {name: 'hat_open', url: 'static/wav/hat_open.wav'},
    {name: 'ride', url: 'static/wav/ride.wav'},
    {name: 'ride', url: 'static/wav/ride.wav'}
]



class @BufferNode
    constructor: (@ctx, @id, @parent) ->
        @node = @ctx.createGain()
        @node.gain.value = 1.0
        sample = window.SAMPLES[@id]
        @setSample(sample)

        @head = 0.0
        @tail = 1.0
        @speed = 1.0

        @eq_gains = [0.0, 0.0, 0.0]

        [eq1, eq2, eq3] = [@ctx.createBiquadFilter(), @ctx.createBiquadFilter(), @ctx.createBiquadFilter()]
        [eq1.type, eq2.type, eq3.type] = ['lowshelf', 'peaking', 'highshelf']
        [eq1.Q.value, eq2.Q.value, eq3.Q.value] = [0.6, 0.6, 0.6]
        [eq1.frequency.value, eq2.frequency.value, eq3.frequency.value] = [350, 2000, 4000]
        [eq1.gain.value, eq2.gain.value, eq3.gain.value] = @eq_gains
        @eq_nodes = [eq1, eq2, eq3]

        @panner = @ctx.createPanner()
        @panner.panningModel = "equalpower"
        @pan_value = [0, 0, -1]

        eq1.connect(eq2)
        eq2.connect(eq3)
        eq3.connect(@panner)
        @panner.connect(@node)

    setSample: (sample) ->
        if sample.data?
            @buffer = sample.data
        else
            req = new XMLHttpRequest()
            req.open('GET', sample.url, true)
            req.responseType = "arraybuffer"
            req.onload = () =>
                @ctx.decodeAudioData(
                    req.response,
                    ((@buffer) =>
                        @buffer_duration = (@buffer.length / window.SAMPLE_RATE)
                        @parent.sampleLoaded(@id)
                    ),
                    (err) => console.log('ajax error'); console.log(err)
                )
                sample.data = @buffer
            req.send()

    connect: (@dst) -> @node.connect(@dst)

    noteOn: (gain, time) ->
        return if not @buffer?
        source = @ctx.createBufferSource()
        source.buffer = @buffer
        node = @ctx.createGain()
        source.connect(node)
        node.connect(@eq_nodes[0])

        head_time = time + @buffer_duration * @head
        tail_time = time + @buffer_duration * @tail
        source.start(0)
        node.gain.setValueAtTime(0, time)
        node.gain.linearRampToValueAtTime(gain, head_time + 0.001)
        node.gain.setValueAtTime(gain, tail_time)
        node.gain.linearRampToValueAtTime(0, tail_time + 0.001)

    setParam: (@head, @tail, @speed) ->
    getParam: -> [@head, @tail, @speed]

    setEQParam: (@eq_gains) ->
        [@eq_nodes[0].gain.value, @eq_nodes[1].gain.value, @eq_nodes[2].gain.value] = (g * 0.2 for g in @eq_gains)

    getEQParam: -> @eq_gains

    setOutputParam: (@pan_value, gain) ->
        @panner.setPosition(@pan_value[0], @pan_value[1], @pan_value[2])
        @node.gain.value = gain

    getOutputParam: ->
        [@pan_value, @node.gain.value]

    getData: -> @buffer



class @ResFilter
    constructor: (@ctx) ->
        @lpf = @ctx.createBiquadFilter()
        @lpf.type = 'lowpass'
        @lpf.gain.value = 1.0

    connect:    (dst)  -> @lpf.connect(dst)
    getResonance:      -> @lpf.Q.value
    setQ: (Q) -> @lpf.Q.value = Q



class @SamplerCore
    constructor: (@parent, @ctx, @id) ->
        @node = @ctx.createGain()
        @node.gain.value = 1.0
        @gain = 1.0

        @nodes = (new BufferNode(@ctx, i, this) for i in [0...10])

        for i in [0...10]
            @nodes[i].connect(@node)

        @view = new SamplerCoreView(this, id, @parent.view.dom.find('.sampler-core'))

    noteOn: (notes) ->
        time = @ctx.currentTime
        if Array.isArray(notes)
            # return if notes.length == 0
            @nodes[n[0] - 1].noteOn(n[1], time) for n in notes
        else
            @nodes[notes - 1].noteOn(1, time)

    noteOff: ->
        t0 = @ctx.currentTime

    connect: (dst) ->
        @node.connect(dst)

    setSampleParam: (i, head, tail, speed) ->
        @nodes[i].setParam(head, tail, speed)

    setSampleEQParam: (i, lo, mid, hi) ->
        @nodes[i].setEQParam([lo, mid, hi])

    setSampleOutputParam: (i, pan, gain) ->
        @nodes[i].setOutputParam(pan, gain)

    setGain: (@gain) ->
        @node.gain.value = @gain

    getSampleParam: (i) ->
        @nodes[i].getParam()

    getSampleData: (i) ->
        @nodes[i].getData()

    getSampleEQParam: (i) ->
        @nodes[i].getEQParam()

    getSampleOutputParam: (i) ->
        @nodes[i].getOutputParam()

    sampleLoaded: (id) ->
        @view.updateWaveformCanvas(id)

    bindSample: (sample_now) ->
        @view.updateWaveformCanvas(sample_now)
        @view.updateEQCanvas()
        @view.readSampleParam(@getSampleParam(sample_now))
        @view.readSampleEQParam(@getSampleEQParam(sample_now))
        @view.readSampleOutputParam(@getSampleOutputParam(sample_now))



class @Sampler
    constructor: (@ctx, @id, @player, @name) ->
        @name = 'Sampler #' + @id if not @name?

        @pattern_name = 'pattern 0'
        @pattern = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
        @pattern_obj = name: @pattern_name, pattern: @pattern

        @time = 0
        @view = new SamplerView(this, @id)
        @core = new SamplerCore(this, @ctx, @id)

        @is_sustaining = false
        @session = @player.session

    connect: (dst) ->
        @core.connect(dst)

    setDuration: ->
    setKey:  ->
    setScale: ->
    setNote: (note) -> @core.setNote(note)

    setGain: (gain) -> @core.setGain(gain)
    getGain: ()     -> @core.gain

    noteOn: (note) ->
        @core.noteOn([[note, 1.0]])

    noteOff: -> @core.noteOff()

    playAt: (@time) ->
        mytime = @time % @pattern.length
        @view.playAt(mytime)
        if @pattern[mytime] != 0
            notes = @pattern[mytime]
            @core.noteOn(notes)

    play: () ->
        @view.play()

    stop: () ->
        @core.noteOff()
        @view.stop()

    pause: (time) ->
        @core.noteOff()

    readPattern: (_pattern_obj) ->
        @pattern_obj = $.extend(true, {}, _pattern_obj)
        @pattern = @pattern_obj.pattern
        @pattern_name = @pattern_obj.name
        @view.readPattern(@pattern_obj)

    getPattern: () ->
        @pattern_obj = name: @pattern_name, pattern: @pattern
        $.extend(true, {}, @pattern_obj)

    clearPattern: () ->
        @pattern = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
        @pattern_obj.pattern = @pattern
        @view.readPattern(@pattern_obj)

    plusPattern: ->
        @pattern = @pattern.concat([[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]])
        @player.resetSceneLength()

    minusPattern: ->
        @pattern = @pattern.slice(0, @pattern.length - 32)
        @player.resetSceneLength()

    addNote: (time, note, gain) ->
        if not Array.isArray(@pattern[time])
            @pattern[time] = [[@pattern[time], 1.0]]

        for i in [0...@pattern[time].length]
            if @pattern[time][i][0] == note
                @pattern[time].splice(i, 1)

        @pattern[time].push([note, gain])

    removeNote: (pos) ->
        for i in [0...@pattern[pos.x_abs].length]
            if @pattern[pos.x_abs][i][0] == pos.note
                @pattern[pos.x_abs].splice(i, 1)

    activate: (i) -> @view.activate(i)
    inactivate: (i) -> @view.inactivate(i)

    redraw: (@time) ->
        @view.drawPattern(@time)

    setPatternName: (@pattern_name) ->
        @session.setPatternName(@id, @pattern_name)

    readPatternName: (@pattern_name) ->
        @view.setPatternName(@pattern_name)

    selectSample: (sample_now) ->
        @core.bindSample(sample_now)

    replaceWith: (s_new) ->
        @view.dom.replaceWith(s_new.view.dom)