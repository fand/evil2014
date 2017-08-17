const _ = require('underscore');

const SynthView  = require('./SynthView');
const SynthCore  = require('./Synth/SynthCore');
const Panner     = require('./Panner');
const Fuzz       = require('./FX/Fuzz');
const Delay      = require('./FX/Delay');
const Reverb     = require('./FX/Reverb');
const Compressor = require('./FX/Compressor');
const Double     = require('./FX/Double');

const CONSTANT  = require('./Constant');

const SCALE_LIST = {
    Major        : [0,2,4,5,7,9,11],
    minor        : [0,2,3,5,7,8,10],
    Pentatonic   : [0,3,5,7,10],
    Dorian       : [0,2,3,5,7,9,10],
    Phrygian     : [0,1,3,5,7,8,10],
    Lydian       : [0,2,4,6,7,9,11],
    Mixolydian   : [0,2,4,5,7,9,10],
    CHROMATIC    : [0,1,2,3,4,5,6,7,8,9,10,11],
    'Harm-minor' : [0,2,3,5,7,8,11],
};

const T = require('worker-timer');
let TID = null;

// Manages SynthCore, SynthView.
class Synth {

    constructor (ctx, id, player, name) {
        this.ctx    = ctx;
        this.id     = id;
        this.player = player;
        this.name   = name;
        if (this.name == null) {
            this.name = `Synth #${this.id}`;
        }

        this.type = 'REZ';

        this.pattern_name  = 'pattern 0';
        this.pattern       = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        this.pattern_obj   = {name: this.pattern_name, pattern: this.pattern, isOn: true};
        this.pattern_is_on = true

        this.time = 0
        this.scale_name = 'Major'
        this.scale = SCALE_LIST[this.scale_name]
        this.view = new SynthView(this, this.id)
        this.core = new SynthCore(this, this.ctx, this.id)

        this.is_on         = true
        this.is_sustaining = false
        this.is_performing = false
        this.session = this.player.session

        this.send   = this.ctx.createGain()
        this.return = this.ctx.createGain()
        this.send.gain.value   = 1.0
        this.return.gain.value = 1.0
        this.core.connect(this.send)
        this.send.connect(this.return)

        this.effects = []

        this.T = window;
    }

    connect (dst) {
        if (dst instanceof Panner) {
            this.return.connect(dst.in)
        }
        else {
            this.return.connect(dst);
        }
    }

    disconnect () {
        this.return.disconnect();
    }

    setDuration (duration) {
        this.duration = duration;
    }

    setKey (key) {
        this.core.setKey(key)
    }

    setNote (note) {
        this.core.setNote(note)
    }

    setScale (scale_name) {
        this.scale_name = scale_name;
        this.scale      = SCALE_LIST[this.scale_name];
        this.core.scale = this.scale;
        this.view.changeScale(this.scale);
    }

    setGain (gain) {
        this.core.setGain(gain);
    }

    getGain () {
        return this.core.gain;
    }

    noteOn (note, force, delay) {
        if (force || !this.is_performing) {
            this.core.setNote(note, delay);
            this.core.noteOn(delay);
        }
        if (force) {
            this.is_performing = true;
        }
    }

    noteOff (force, delay) {
        if (force) {
            this.is_performing = false;
        }
        if (!this.is_performing) {
            this.core.noteOff(delay)
        }
    }

    playAt (time) {
        this.time = time;
        const mytime = this.time % this.pattern.length;
        this.view.playAt(mytime)

        if (this.is_performing || !this.is_on) { return; }

        // off
        if (this.pattern[mytime] === 0) {
            this.core.noteOff();
        }

        // sustain start
        else if (this.pattern[mytime] < 0) {
            this.is_sustaining = true;
            const n = -( this.pattern[mytime] );
            this.core.setNote(n);
            this.core.noteOn();
        }

        // sustain mid
        else if (this.pattern[mytime] == 'sustain') {
            return
        }

        // sustain end
        else if (this.pattern[mytime] == 'end') {
            TID = T.setTimeout((() => this.core.noteOff()), this.duration - 10, TID)
        }

        // single note
        else {
            this.core.setNote(this.pattern[mytime])
            this.core.noteOn()
            TID = T.setTimeout((() => this.core.noteOff()), this.duration - 10, TID)
        }
    }

    play () {
        this.view.play();
    }

    stop () {
        this.core.noteOff()
        this.view.stop()
    }

    pause (time) {
        this.core.noteOff()
    }

    setPattern (_pattern_obj, force) {
        this.pattern_obj   = { ..._pattern_obj, isOn: true };
        this.pattern       = this.pattern_obj.pattern;
        this.pattern_name  = this.pattern_obj.name;
        this.pattern_is_on = this.pattern_obj.isOn;
        if (this.pattern_is_on || force) {
            this.is_on = true;
        }
        this.view.setPattern(this.pattern_obj);
    }

    getPattern () {
        this.pattern_obj = {
            name    : this.pattern_name,
            pattern : this.pattern,
            isOn    : this.pattern_is_on,
        };
        return { ...this.pattern_obj };
    }

    clearPattern () {
        this.pattern = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        this.pattern_obj.pattern = this.pattern;
        this.view.setPattern(this.pattern_obj);
    }

    // Changes the length of this.pattern.
    plusPattern () {
        this.pattern = this.pattern.concat([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        this.player.resetSceneLength()
    }

    minusPattern () {
        this.pattern = this.pattern.slice(0, this.pattern.length - 32)
        this.player.resetSceneLength()
    }

    addNote (time, note) {
        this.pattern[time] = note;
    }

    removeNote (time) {
        this.pattern[time] = 0
    }

    sustainNote (l, r, note) {
        if (l == r) {
            this.pattern[l] = note;
            return;
        }
        for (let i = l; i < r; i++) {
            this.pattern[i] = 'sustain';
        }
        this.pattern[l] = -(note);
        this.pattern[r] = 'end';
    }

    activate (i) {
        this.view.activate(i);
    }

    inactivate (i) {
        this.view.inactivate(i);
    }

    redraw (time) {
        this.time = time;
        this.view.drawPattern(this.time);
    }

    // called by SynthView.
    inputPatternName (pattern_name) {
        this.pattern_name = pattern_name;
        this.session.setPatternName(this.id, this.pattern_name);
    }

    setPatternName (pattern_name) {
        this.pattern_name = pattern_name;
        this.view.setPatternName(this.pattern_name);
    }

    setSynthName (name) {
        this.name = name;
        this.session.setSynthName(this.id, this.name);
        this.view.setSynthName(this.name);
    }

    // Get new Synth and replace.
    // called by SynthView.
    changeSynth (type) {
        const s_new = this.player.changeSynth(this.id, type, s_new);
        this.view.dom.replaceWith(s_new.view.dom);
        this.noteOff(true);
        this.disconnect();
    }

    // Get params as object.
    getParam () {
        const p      = this.core.getParam();
        p.name       = this.name;
        p.scale_name = this.scale_name;
        p.effects    = this.getEffectsParam();
        return p;
    }

    setParam (p) {
        if (p == null) { return; }
        this.core.setParam(p);
        if (p.effects != null) {
            this.setEffects(p.effects);
        }
    }

    mute () { this.core.mute(); }
    demute () { this.core.demute(); }

    // Set effects' params from the song.
    setEffects (effects_new) {
        this.effects.forEach(e => e.disconnect());
        this.effects = [];

        effects_new.forEach((e) => {
            let fx;
            if (e.name == 'Fuzz') {
                fx = new Fuzz(this.ctx);
            }
            else if (e.name == 'Delay') {
                fx = new Delay(this.ctx);
            }
            else if (e.name == 'Reverb') {
                fx = new Reverb(this.ctx);
            }
            else if (e.name == 'Comp') {
                fx = new Compressor(this.ctx);
            }
            else if (e.name == 'Double') {
                fx = new Double(this.ctx);
            }

            this.insertEffect(fx);
            fx.setParam(e);
        });
    }

    getEffectsParam () {
        return this.effects.map(f => f.getParam());
    }

    insertEffect (fx) {
        if (this.effects.length === 0) {
            this.send.disconnect();
            this.send.connect(fx.in);
        }
        else {
            this.effects[this.effects.length - 1].disconnect();
            this.effects[this.effects.length - 1].connect(fx.in);
        }

        fx.connect(this.return);
        fx.setSource(this);
        this.effects.push(fx);
    }

    removeEffect (fx) {
        const i = this.effects.indexOf(fx);
        if (i === -1) { return; }

        let prev;
        if (i == 0) {
            prev = this.send;
        }
        else {
            prev = this.effects[i - 1];
        }

        prev.disconnect();
        if (this.effects[i + 1] != null) {
            prev.connect(this.effects[i + 1].in);
        }
        else {
            prev.connect(this.return);
        }

        fx.disconnect();
        this.effects.splice(i, 1);
    }

    off () {
        this.is_on = false;
    }

}

module.exports = Synth
