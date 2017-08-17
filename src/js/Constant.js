module.exports = {
    STREAM_LENGTH : 1024,
    SAMPLE_RATE   : 48000,
    SEMITONE      : 1.05946309,
    T             : window,    // TODO: worker timer
    SONG_DEFAULT: {
        tracks : [],
        length : 1,
        master : [{
            name  : 'section-0',
            bpm   : 144,
            key   : 'A',
            scale : 'minor',
        }],
    },
    KEY_LIST : {
        A  : 55,
        Bb : 58.27047018976124,
        B  : 61.7354126570155,
        C  : 32.70319566257483,
        Db : 34.64782887210901,
        D  : 36.70809598967594,
        Eb : 38.890872965260115,
        E  : 41.20344461410875,
        F  : 43.653528929125486,
        Gb : 46.2493028389543,
        G  : 48.999429497718666,
        Ab : 51.91308719749314,
    },
};
