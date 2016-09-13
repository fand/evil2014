const PlayerView = require('./PlayerView');

const Mixer   = require('./Mixer');
const Session = require('./Session');
const Sidebar = require('./Sidebar');

const Synth   = require('./Synth');
const Sampler = require('./Sampler');

const T = require('worker-timer');
let TID = null;

class Player {

    constructor (context) {
        this.bpm        = 120;
        this.duration   = 500;  // msec
        this.key        = 'A';
        this.scale      = 'Major';
        this.is_playing = false;
        this.time       = 0;
        this.scene      = {
            bpm   : this.bpm,
            key   : this.key,
            scale : this.scale,
        };

        this.num_id  = 0;
        this.context = context;
        this.synth   = [];

        this.mixer   = new Mixer(this.context, this);
        this.session = new Session(this.context, this);
        this.sidebar = new Sidebar(this.context, this, this.session, this.mixer);

        this.addSynth(0);
        this.synth_now    = this.synth[0];
        this.synth_pos    = 0;
        this.scene_length = 32;

        this.view = new PlayerView(this);
    }

    setBPM (bpm) {
        this.bpm       = bpm;
        this.scene.bpm = bpm;

        // @duration = (60000.0 / @bpm) / 8.0
        this.duration = 7500.0 / this.bpm;
        this.synth.forEach(s => s.setDuration(this.duration));

        this.sidebar.setBPM(this.bpm);
    }

    setKey (key) {
        this.key = key;
        this.scene.key = key;
        this.synth.forEach(s => s.setKey(key));

        this.sidebar.setKey(key);
    }

    setScale (scale) {
        this.scale = scale;
        this.scene.scale = scale;
        this.synth.forEach(s => s.setScale(scale));

        this.sidebar.setScale(scale);
    }

    isPlaying () { return this.is_playing; }

    play () {
        this.is_playing = true;
        this.session.play();
        TID = T.setTimeout(() => {
            // s.play() for s in @synth
            this.playNext();
        }, 150, TID);
    }

    stop () {
        this.synth.forEach(s => s.stop());
        this.is_playing = false;
        this.view.viewStop();
        this.time = 0;
    }

    pause () {
        this.synth.forEach(s => s.pause());
        this.is_playing = false;
    }

    forward () {
        if ((this.time + 32) > this.scene_length) {
            this.session.nextMeasure(this.synth);
        }
        this.time = (this.time + 32) % this.scene_length;
        this.synth_now.redraw(this.time)
    }

    backward (force) {
        if (force) {
            if (this.time >= 32) {
                this.time = (this.time - 32) % this.scene_length;
            }
        }
        else {
            if (this.time % 32  < 3 && this.time >= 32) {
                this.time = (this.time - 32 - (this.time % 32)) % this.scene_length;
            }
            else {
                this.time -= (this.time % 32);
            }
        }
        this.synth_now.redraw(this.time);
    }

    toggleLoop () {
        this.session.toggleLoop();
    }

    noteOn (note, force, delay) {
        this.synth_now.noteOn(note, force, delay);
    }

    noteOff (force, delay) {
        this.synth_now.noteOff(force, delay);
    }

    playNext () {
        if (this.is_playing) {
            if (this.time >= this.scene_length) {
                this.time = 0;
            }

            this.synth.forEach(s => s.playAt(this.time));

            if (this.time % 32 === 31 && this.time + 32 > this.scene_length) {
                this.session.nextMeasure(this.synth);
            }

            if (this.time % 8 == 0) {
                this.session.beat();
            }

            this.time++;
            TID = T.setTimeout(() => this.playNext(), this.duration, TID);
        }
        else {
            this.stop();
        }
    }

    addSynth (scene_pos, name) {
        const s = new Synth(this.context, this.num_id++, this, name);
        s.setScale(this.scene.scale);
        s.setKey(this.scene.key);

        this.synth.push(s);
        this.mixer.addSynth(s);
        this.session.addSynth(s, scene_pos);
    }

    addSampler (scene_pos, name) {
        const s = new Sampler(this.context, this.num_id++, this, name);
        this.synth.push(s);
        this.mixer.addSynth(s);
        this.session.addSynth(s, scene_pos);
    }

    // Called by instruments.
    changeSynth (id, type) {
        const s_old  = this.synth[id];

        let s_new;
        if (type === 'REZ') {
            s_new = new Synth(this.context, id, this, s_old.name);
            s_new.setScale(this.scene.scale);
            s_new.setKey(this.scene.key);
        }
        else if (type === 'SAMPLER') {
            s_new = new Sampler(this.context, id, this, s_old.name);
        }

        this.synth_now = this.synth[id] = s_new;
        this.synth_now = s_new;

        this.mixer.changeSynth(id, s_new);
        this.session.changeSynth(id, type, s_new);
        this.view.changeSynth(id, type);

        return s_new;
    }

    // Called by PlayerView.
    moveRight (next_idx) {
        if (next_idx == this.synth.length) {
            this.addSynth();
            this.session.play();
        }

        this.synth[next_idx - 1].inactivate();
        this.synth_now = this.synth[next_idx];
        this.synth_now.activate(next_idx);
        this.synth_pos++;
        window.keyboard.setMode('SYNTH');
    }

    moveLeft (next_idx) {
        this.synth[next_idx + 1].inactivate();
        this.synth_now = this.synth[next_idx];
        this.synth_now.activate(next_idx);
        this.synth_pos--;
        window.keyboard.setMode('SYNTH');
    }

    moveTop () {
        window.keyboard.setMode('MIXER');
    }

    moveBottom () {
        window.keyboard.setMode('SYNTH');
    }

    moveTo (synth_num) {
        this.view.moveBottom();
        if (synth_num < this.synth_pos) {
            while (synth_num !== this.synth_pos) {
                this.view.moveLeft();
            }
        }
        else {
            while (synth_num !== this.synth_pos) {
                this.view.moveRight();
            }
        }
    }

    solo (solos) {
        if (solos.length === 0) {
            this.synth.forEach(s => s.demute());
            return;
        }
        this.synth.forEach((s) => {
            if ((s.id + 1) in solos) {
                s.demute();
            }
            else {
                s.mute();
            }
        })
    }

    readSong (song) {
        this.song   = song;
        this.synth  = [];
        this.num_id = 0;
        this.mixer.empty();
        this.session.empty();
        this.view.empty();

        this.song.tracks.forEach((track, i) => {
            switch (track.type) {
            case 'REZ':
                this.addSynth(0, track.name);
                break;
            case 'SAMPLER':
                this.addSampler(0, track.name);
                break;
            default:
                this.addSynth(0, track.name);
           }
        });

        this.synth_now = this.synth[0];

        this.readScene(this.song.master[0]);
        this.setSceneLength(this.song.master.length);

        this.song.tracks.forEach((track, i) => {
            this.synth[i].setParam(track);
        });

        this.session.setSynth(this.synth);
        this.session.readSong(this.song);
        this.mixer.readParam(this.song.mixer);
        this.sidebar.renderEffects();

        this.view.setSynthNum(this.synth.length, this.synth_pos);
        this.resetSceneLength()
    }

    clearSong () {
        this.synth = [];
        this.num_id = 0;
    }

    readScene (scene) {
        if (scene.bpm != null) {
            this.setBPM(scene.bpm);
            this.view.setBPM(scene.bpm);
        }
        if (scene.key != null) {
            this.setKey(scene.key);
            this.view.setKey(scene.key);
        }
        if (scene.scale != null) {
            this.setScale(scene.scale);
            this.view.setScale(scene.scale);
        }
        this.view.setParam(scene.bpm, scene.key, scene.scale);
    }

    getScene () { return this.scene; }

    setSceneLength (scene_length) {
        this.scene_length = scene_length;
    }

    resetSceneLength  (l) {
        this.scene_length = 0
        this.synth.forEach((s) => {
            this.scene_length = Math.max(this.scene_length, s.pattern.length);
        });
    }

    showSuccess (url) {
        console.log("success!")
        console.log(url)

    }

    showError (error) {
        console.log(error)
    }

}

module.exports = Player;
