const MixerView  = require('./MixerView');
const Fuzz       = require('./FX/Fuzz');
const Delay      = require('./FX/Delay');
const Reverb     = require('./FX/Reverb');
const Compressor = require('./FX/Compressor');
const Double     = require('./FX/Double');
const Limiter    = require('./FX/Limiter');
const Panner     = require('./Panner');

class Mixer {

    constructor (ctx, player) {
        this.ctx    = ctx;
        this.player = player;
        this.gain_master = 1.0;
        this.gain_tracks = this.player.synth.map(s => s.getGain());

        this.out            = this.ctx.createGain();
        this.out.gain.value = this.gain_master;

        this.send = ctx.createGain();
        this.send.gain.value = 1.0;

        this.return = ctx.createGain();
        this.return.gain.value = 1.0;

        this.panners = [];
        this.analysers = [];

        // Master VU meter
        this.splitter_master = ctx.createChannelSplitter(2);
        this.analyser_master = [
            this.ctx.createAnalyser(),
            this.ctx.createAnalyser()
        ];
        this.out.connect(this.splitter_master);
        [0, 1].forEach((i) => {
            this.splitter_master.connect(this.analyser_master[i], i);
            this.analyser_master[i].fftSize               = 1024;
            this.analyser_master[i].minDecibels           = -100.0;
            this.analyser_master[i].maxDecibels           = 0.0;
            this.analyser_master[i].smoothingTimeConstant = 0.0;
        });

        // Master Effects
        this.limiter = new Limiter(ctx);

        this.send.connect(this.return);
        this.return.connect(this.limiter.in);
        this.limiter.connect(this.out);

        this.effects_master = []

        this.out.connect(this.ctx.destination)

        this.view = new MixerView(this);

        setInterval(() => {
            this.drawGains();
        }, 30);
    }

    drawGains () {
        // Tracks
        for (let i = 0; i < this.analysers.length; i++) {
            const data = new Uint8Array(this.analysers[i].frequencyBinCount);
            this.analysers[i].getByteTimeDomainData(data);
            this.view.drawGainTracks(i, data);
        }

        // Master
        const data_l = new Uint8Array(this.analyser_master[0].frequencyBinCount);
        const data_r = new Uint8Array(this.analyser_master[1].frequencyBinCount);
        this.analyser_master[0].getByteTimeDomainData(data_l);
        this.analyser_master[1].getByteTimeDomainData(data_r);
        this.view.drawGainMaster(data_l, data_r);
    }

    empty () {
        this.gain_tracks = [];
        this.panners     = [];
        this.analysers   = [];
        this.view.empty();
    }

    addSynth (synth) {
        // Create new panner
        const p = new Panner(this.ctx);
        synth.connect(p.in);
        p.connect(this.send);
        this.panners.push(p);

        const a = this.ctx.createAnalyser();
        synth.connect(a);
        this.analysers.push(a);

        this.view.addSynth(synth);
    }

    removeSynth (i) {
        this.panners.splice(i);
    }

    setGains (gain_tracks, gain_master) {
        this.gain_tracks = gain_tracks;
        this.gain_master = gain_master;
        this.gain_tracks.forEach((gain, i) => {
            this.player.synth[i].setGain(gain);
        })
        this.out.gain.value = this.gain_master;
    }

    setPans (pan_tracks, pan_master) {
        this.pan_tracks = pan_tracks;
        this.pan_master = pan_master;
        this.pan_tracks.forEach((pan, i) => {
            this.panners[i].setPosition(pan);
        });
    }

    readGains (gain_tracks, gain_master) {
        this.gain_tracks = gain_tracks;
        this.gain_master = gain_master;

        this.setGains(this.gain_tracks, this.gain_master);
        this.view.readGains(this.gain_tracks, this.gain_master);
    }

    readPans (pan_tracks, pan_master) {
        this.pan_tracks = pan_tracks;
        this.pan_master = pan_master;
        this.setPans(this.pan_tracks, this.pan_master);
        this.view.readPans(this.pan_tracks, this.pan_master);
    }

    getParam () {
        return {
            gain_tracks    : this.gain_tracks,
            gain_master    : this.gain_master,
            pan_tracks     : this.pan_tracks,
            pan_master     : this.pan_master,
            effects_master : this.effects_master.map(f => f.getParam()),
        };
    }

    readParam (p) {
        if (p == null) { return; }
        this.readGains(p.gain_tracks, p.gain_master);
        this.readPans(p.pan_tracks, p.pan_master);

        if (p.effects_master == null) { return; }
        p.effects_master.forEach((f, i) => {
            this.addMasterEffect(f.name);
            this.effects_master[i].setParam(f);
        });
    }

    changeSynth (id, synth) {
        synth.connect(this.panners[id].in);
        synth.connect(this.analysers[id]);
    }

    _createEffect (name) {
        if (name === 'Fuzz') {
            return new Fuzz(this.ctx);
        }
        if (name === 'Delay') {
            return new Delay(this.ctx);
        }
        if (name === 'Reverb') {
            return new Reverb(this.ctx);
        }
        if (name === 'Comp') {
            return new Compressor(this.ctx);
        }
        if (name === 'Double') {
            return new Double(this.ctx);
        }
        throw new TypeError('Unknown effect name', name);
    }

    /**
     * Called by Sidebar.
     * @param {string} name - FX type
     * @returns {FX} fx
     */
    addMasterEffect (name) {
        const fx = this._createEffect(name);
        const pos = this.effects_master.length;
        if (pos === 0) {
            this.send.disconnect();
            this.send.connect(fx.in);
        }
        else {
            this.effects_master[pos - 1].disconnect();
            this.effects_master[pos - 1].connect(fx.in);
        }

        fx.connect(this.return);
        fx.setSource(this);
        this.effects_master.push(fx);

        return fx;
    }

    /**
     * Called by Sidebar.
     * @param {number} x - The number of the track
     * @param {string} name - FX type
     * @returns {FX} fx
     */
    addTracksEffect (x, name) {
        const fx = this._createEffect(name);
        this.player.synth[x].insertEffect(fx);
        return fx;
    }

    removeEffect (fx) {
        const i = this.effects_master.indexOf(fx);
        if (i === -1) { return; }

        const prev = i === 0 ? this.send : this.effects_master[i - 1];
        prev.disconnect();

        if (this.effects_master[i + 1] != null) {
            prev.connect(this.effects_master[i + 1]);
        }
        else {
            prev.connect(this.return);
            fx.disconnect();
        }
        this.effects_master.splice(i, 1);
    }

    /**
     * Called by Sidebar.
     * @returns {FX[]}
     */
    getMasterEffects () {
        return this.effects_master;
    }
    /**
     * Called by Sidebar.
     * @param {number} x - synth num
     * @returns {FX[]} fx
     */
    getTracksEffects (x) {
        return this.player.synth[x].effects;
    }

}

module.exports = Mixer;
