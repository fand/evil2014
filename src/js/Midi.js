class Midi {

    constructor (player) {
        this.player     = player;
        this.is_pressed = false;
        this.last_note  = 0;

        navigator.requestMIDIAccess().then((m) => {
            const values = m.inputs.values();
            const inputs = [];
            let v = values.next();

            while (v.done !== true) {
                inputs.push(v.value);
                v = values.next();
            }

            inputs.forEach(i => {
                i.onmidimessage = (message) => this.onMessage(message);
            });
        });
    }

    onMessage (m) {
        const data = m.data;
        if (0x90 <= data[0] && data[0] < 0x9F) {
            if (this.is_pressed === false) {
                this.is_pressed = true;
            }
            this.on(data[1]);
        }
        if (0x80 <= data[0] && data[0] < 0x8F) {
            this.is_pressed = false;
            this.off(data[1]);
        }
    }

    on (note) {
        if (note === this.last_note) { return; }
        this.onPlayer(note % 48);
        this.last_key = note;
    }

    off (e) {
        this.offPlayer(e);
        this.last_key = 0;
    }

    onPlayer (note) {
        if (this.player.isPlaying()) {
            this.player.noteOff(true, 0);
        }
        if (note != null) {
            this.player.noteOn(note, true, 0);
        }
    }

    offPlayer (e) {
        this.player.noteOff(true);
    }

}

module.exports = Midi;
