const $ = require('jquery');

const KEYCODE_TO_NOTE = {
    90:   1,
    88:   2,
    67:   3,
    86:   4,
    66:   5,
    78:   6,
    77:   7,
    65:   8,
    83:   9,
    68:  10,
    188:  8,
    190:  9,
    192: 10,
    70:  11,
    71:  12,
    72:  13,
    74:  14,
    75:  15,
    76:  16,
    187: 17,
    81:  15,
    87:  16,
    69:  17,
    82:  18,
    84:  19,
    89:  20,
    85:  21,
    73:  22,
    79:  23,
    80:  24,
    49:  22,
    50:  23,
    51:  24,
    52:  25,
    53:  26,
    54:  27,
    55:  28,
    56:  29,
    57:  30,
    48:  31,
};

const KEYCODE_TO_NUM = {
    49:  1,
    50:  2,
    51:  3,
    52:  4,
    53:  5,
    54:  6,
    55:  7,
    56:  8,
    57:  9,
    48:  0,
};

class Keyboard {

    constructor (player) {
        this.player = player;
        this.mode = 'SYNTH';
        this.is_writing = false;
        this.is_pressed = false;

        this.last_key = 0;

        this.solos = [];

        this.initEvent();
    }

    initEvent () {
        $(window).keydown((e) => {
            if (this.is_writing) { return; }
            if (this.is_pressed === false) {
                this.is_pressed = true;
            }
            this.on(e);
        });
        $(window).keyup((e) => {
            this.is_pressed = false;
            this.off(e);
        });
    }

    beginInput () {
        this.is_writing = true;
    }

    endInput () {
        this.is_writing = false;
    }

    setMode (mode) {
        this.mode = mode;
    }

    on (e) {
        if (e.keyCode === this.last_key) { return; }

        switch (e.keyCode) {
        case 37:
            this.player.view.moveLeft();
            break;
        case 38:
            this.player.view.moveTop();
            break;
        case 39:
            this.player.view.moveRight();
            break;
        case 40:
            this.player.view.moveBottom();
            break;
        case 32:
            this.player.view.viewPlay();
            break;
        case 13:
            this.player.view.viewPlay();
            break;
        default:
            if (this.mode === 'SYNTH') { this.onPlayer(e); }
            if (this.mode === 'MIXER') { this.onMixer(e); }
        }

        this.last_key = e.keyCode;
    }

    onPlayer (e) {
        if (this.player.isPlaying) {
            this.player.noteOff(true, 0);
        }
        const n = KEYCODE_TO_NOTE[e.keyCode];
        if (n != null) {
            this.player.noteOn(n, true, 0);
        }
    }

    onMixer (e) {
        // Session
        if (e.keyCode === 8 || e.keyCode === 46) {
            this.player.session.deleteCell();
        }

        // Mute
        const num = KEYCODE_TO_NUM[e.keyCode];
        if (num != null && num < 10) {
            if (!this.solos.includes(num)) {
                this.solos.push(num);
            }
            this.player.solo(this.solos);
        }
    }

    off (e) {
        if (this.mode === 'SYNTH') { this.offPlayer(e); }
        if (this.mode === 'MIXER') { this.offMixer(e); }
        this.last_key = 0;
    }

    offPlayer () {
        this.player.noteOff(true);
    }

    offMixer (e) {
        const num = KEYCODE_TO_NUM[e.keyCode];
        if (num != null && num < 10) {
            this.solos = this.solos.filter((n) => n !== num);
            this.player.solo(this.solos);
        }
    }

}

module.exports = Keyboard;
