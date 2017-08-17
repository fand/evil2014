const _           = require('underscore');
const SamplerView = require('./SamplerView');
const SamplerCore = require('./Sampler/SamplerCore');
const Panner      = require('./Panner');

class Sampler {

    constructor (ctx, id, player, name) {
        this.ctx    = ctx;
        this.id     = id;
        this.player = player;
        this.name   = name;

        this.type = 'SAMPLER';
        if (this.name == null) {
            this.name = `Sampler #${this.id}`;
        }

        this.pattern_name  = 'pattern 0';
        this.pattern       = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
        this.pattern_obj   = {name: this.pattern_name, pattern: this.pattern};
        this.pattern_is_on = true;

        this.time = 0;
        this.view = new SamplerView(this, this.id);
        this.core = new SamplerCore(this, this.ctx, this.id);

        this.is_on         = true;
        this.is_sustaining = false;
        this.session       = this.player.session;

        this.send   = this.ctx.createGain();
        this.return = this.ctx.createGain();
        this.send.gain.value   = 1.0;
        this.return.gain.value = 1.0;
        this.core.connect(this.send);
        this.send.connect(this.return);

        this.effects = [];
    }

    connect (dst) {
        if (dst instanceof Panner) {
            this.return.connect(dst.in);
        }
        else {
            this.return.connect(dst);
        }
    }

    disconnect () {
        this.return.disconnect();
    }

    setNote (note) {
        this.core.setNote(note);
    }

    setGain (gain) {
        this.core.setGain(gain);
    }

    getGain () {
        return this.core.gain;
    }

    noteOn (note, force, delay) {
        this.core.noteOn([[note, 1.0]], delay);
    }

    noteOff (delay) {
        this.core.noteOff(delay);
    }

    playAt (time) {
        this.time = time;
        const mytime = time % this.pattern.length;
        this.view.playAt(mytime);

        if (!this.is_on) { return; }

        if (this.pattern[mytime] !== 0) {
            this.core.noteOn(this.pattern[mytime]);
        }
    }

    play () {
        this.view.play();
    }

    stop () {
        this.core.noteOff();
        this.view.stop();
    }

    pause () {
        this.core.noteOff();
    }

    setPattern (pattern_obj) {
        this.pattern_obj   = {
            pattern_obj,
            isOn : true,
        };

        this.pattern       = this.pattern_obj.pattern;
        this.pattern_name  = this.pattern_obj.name;
        this.pattern_is_on = this.pattern_obj.isOn;
        if (this.pattern_is_on) {
            this.is_on = true;
        }
        this.view.setPattern(this.pattern_obj)
    }

    getPattern () {
        this.pattern_obj = {
            name    : this.pattern_name,
            pattern : this.pattern,
            isOn    : this.pattern_is_on,
        };
        return _.extend({}, this.pattern_obj);
    }

    clearPattern () {
        this.pattern = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
        this.pattern_obj.pattern = this.pattern;
        this.view.setPattern(this.pattern_obj);
    }

    plusPattern () {
        this.pattern = this.pattern.concat([[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]);
        this.player.resetSceneLength();
    }

    minusPattern () {
        this.pattern = this.pattern.slice(0, this.pattern.length - 32);
        this.player.resetSceneLength();
    }

    addNote (time, note, gain) {
        if (!Array.isArray(this.pattern[time])) {
            this.pattern[time] = [[this.pattern[time], 1.0]];
        }

        const pattern = this.pattern[time];
        for (let i = 0; i < pattern.length; i++) {
            if (pattern[i][0] === note) {
                pattern.splice(i, 1);
            }
        }

        pattern.push([note, gain]);
    }

    removeNote (pos) {
        const pattern = this.pattern[pos.x_abs];
        for (let i = 0; i < pattern.length; i++) {
            if (pattern[i][0] === pos.note) {
                pattern.splice(i, 1);
            }
        }
    }

    activate (i) {
        this.view.activate(i);
    }

    inactivate (i) {
        this.view.inactivate(i);
    }

    redraw (time) {
        this.time = time;
        this.view.drawPattern(this.time)
    }

    setSynthName (name) {
        this.name = name;
        this.session.setSynthName(this.id, this.name);
        this.view.setSynthName(this.name);
    }

    // called by SamplerView.
    inputPatternName (pattern_name) {
        this.pattern_name = pattern_name;
        this.session.setPatternName(this.id, this.pattern_name)
    }

    setPatternName (pattern_name) {
        this.pattern_name = pattern_name;
        this.view.setPatternName(this.pattern_name)
    }

    selectSample (sample_now) {
        this.core.bindSample(sample_now);
    }

    changeSynth (type) {
        const s_new = this.player.changeSynth(this.id, type, s_new);
        this.view.dom.replaceWith(s_new.view.dom);
        this.noteOff(true);
        this.disconnect();
    }

    getParam () {
        const p = this.core.getParam();
        p.name = this.name;
        p.effects = this.getEffectsParam();
        return p;
    }

    setParam (p) {
        if (p == null) { return; }
        this.core.setParam(p);
    }

    mute () {
        this.core.mute();
    }

    demute () {
        this.core.demute();
    }

    getEffectsParam () {
        this.effects.forEach(f => f.getParam());
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
        if (i === 0) {
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

}

module.exports = Sampler;
