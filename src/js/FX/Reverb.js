const FX = require('./FX');

const IR_URL = {
    '5SEC_HANG_VERB'          : 'static/IR/H3000/394_5SEC_HANG_VERB.wav',
    '8_SEC_REVERB'            : 'static/IR/H3000/154_8_SEC_REVERB.wav',
    'ACCURATE_ROOM'           : 'static/IR/H3000/368_ACCURATE_ROOM.wav',
    'AIR_SHAMIR'              : 'static/IR/H3000/991_AIR_SHAMIR.wav',
    'ALIVE_CHAMBER'           : 'static/IR/H3000/575_ALIVE_CHAMBER.wav',
    'AMBIENCE'                : 'static/IR/H3000/555_AMBIENCE.wav',
    'AMBIENT_BOOTH'           : 'static/IR/H3000/556_AMBIENT_BOOTH.wav',
    'BASS_SPACE'              : 'static/IR/H3000/371_BASS_SPACE.wav',
    'BATHROOM'                : 'static/IR/H3000/557_BATHROOM.wav',
    'BIG_SNARE'               : 'static/IR/H3000/206_BIG_SNARE.wav',
    'BIG_SWEEP'               : 'static/IR/H3000/207_BIG_SWEEP.wav',
    'BOUNCE_VERB'             : 'static/IR/H3000/712_BOUNCE_VERB.wav',
    'BREATHING_CANYON'        : 'static/IR/H3000/579_BREATHING_CANYON.wav',
    'BRIGHT_ROOM'             : 'static/IR/H3000/209_BRIGHT_ROOM.wav',
    'BriteBrassPlate'         : 'static/IR/H3000/372_BriteBrassPlate.wav',
    'CANYON'                  : 'static/IR/H3000/211_CANYON.wav',
    'CLONEVERB'               : 'static/IR/H3000/793_CLONEVERB.wav',
    'CLOSE_MIKED'             : 'static/IR/H3000/377_CLOSE_MIKED.wav',
    'COMB_SPACE_1'            : 'static/IR/H3000/378_COMB_SPACE_1.wav',
    'COMPRESSED_AIR'          : 'static/IR/H3000/379_COMPRESSED_AIR.wav',
    'CONCERT_HALL'            : 'static/IR/H3000/582_CONCERT_HALL.wav',
    'CRASS_ROOM'              : 'static/IR/H3000/559_CRASS_ROOM.wav',
    'DARK_ROOM'               : 'static/IR/H3000/213_DARK_ROOM.wav',
    'DARK_ROOM'               : 'static/IR/H3000/583_DARK_ROOM.wav',
    'DEATHLESS_ROOM'          : 'static/IR/H3000/716_DEATHLESS_ROOM.wav',
    'DELAY_W__ROOM'           : 'static/IR/H3000/383_DELAY_W__ROOM.wav',
    'DENSE_HALL_2'            : 'static/IR/H3000/382_DENSE_HALL_2.wav',
    'Dense_Room'              : 'static/IR/H3000/114_Dense_Room.wav',
    'DISCRETE-VERB'           : 'static/IR/H3000/215_DISCRETE-VERB.wav',
    'DOUBLE_SPACE_DENSE_ROOM' : 'static/IR/H3000/381_DOUBLE_SPACE_DENSE_ROOM.wav',
    'DRAGON_BREATH'           : 'static/IR/H3000/385_DRAGON_BREATH.wav',
    'DRUM_AMBIENCE'           : 'static/IR/H3000/387_DRUM_AMBIENCE.wav',
    'DRUM_AMBIENCE'           : 'static/IR/H3000/562_DRUM_AMBIENCE.wav',
    'DRUM_PROCESSOR'          : 'static/IR/H3000/643_DRUM_PROCESSOR.wav',
    'ECHO-VERB'               : 'static/IR/H3000/591_ECHO-VERB.wav',
    'EMPTY_CLOSET'            : 'static/IR/H3000/563_EMPTY_CLOSET.wav',
    'EMPTY_ROOM'              : 'static/IR/H3000/564_EMPTY_ROOM.wav',
    'ENDLESS_CAVE'            : 'static/IR/H3000/719_ENDLESS_CAVE.wav',
    'ethereal'                : 'static/IR/H3000/833_ethereal.wav',
    'FLUTTEROUS_ROOM'         : 'static/IR/H3000/278_FLUTTEROUS_ROOM.wav',
    'GATE_ROOM'               : 'static/IR/H3000/595_GATE_ROOM.wav',
    'GATED_FENCE'             : 'static/IR/H3000/390_GATED_FENCE.wav',
    'GATED_REVERB'            : 'static/IR/H3000/223_GATED_REVERB.wav',
    'GATED_REVERB'            : 'static/IR/H3000/593_GATED_REVERB.wav',
    'GATED_ROOM_2'            : 'static/IR/H3000/391_GATED_ROOM_2.wav',
    'GATED_ROOM'              : 'static/IR/H3000/594_GATED_ROOM.wav',
    'GENERIC_HALL'            : 'static/IR/H3000/392_GENERIC_HALL.wav',
    'GREAT_DRUMSPACE'         : 'static/IR/H3000/393_GREAT_DRUMSPACE.wav',
    'GUITAR_ROOM'             : 'static/IR/H3000/178_GUITAR_ROOM.wav',
    'HUGE_DENSE_HALL'         : 'static/IR/H3000/395_HUGE_DENSE_HALL.wav',
    'HUGE_SYNTHSPACE'         : 'static/IR/H3000/396_HUGE_SYNTHSPACE.wav',
    'HUMP-VERB'               : 'static/IR/H3000/596_HUMP-VERB.wav',
    'HUNTER_DELAY'            : 'static/IR/H3000/181_HUNTER_DELAY.wav',
    'JERRY_RACE_CAR'          : 'static/IR/H3000/182_JERRY_RACE_CAR.wav',
    'LG_GUITAR_ROOM'          : 'static/IR/H3000/283_LG_GUITAR_ROOM.wav',
    'LIQUID_REVERB'           : 'static/IR/H3000/646_LIQUID_REVERB.wav',
    'LOCKER_ROOM'             : 'static/IR/H3000/230_LOCKER_ROOM.wav',
    'LONG_&_SMOOTH'           : 'static/IR/H3000/795_LONG_&_SMOOTH.wav',
    'MANY_REFLECTIONS'        : 'static/IR/H3000/516_MANY_REFLECTIONS.wav',
    'MARKS_MED_DARK'          : 'static/IR/H3000/282_MARKS_MED_DARK.wav',
    'MEAT_LOCKER'             : 'static/IR/H3000/796_MEAT_LOCKER.wav',
    'MEDIUM_SPACE'            : 'static/IR/H3000/565_MEDIUM_SPACE.wav',
    'METALVERB'               : 'static/IR/H3000/597_METALVERB.wav',
    'NEW_HOUSE'               : 'static/IR/H3000/566_NEW_HOUSE.wav',
    'NORTHWEST_HALL'          : 'static/IR/H3000/585_NORTHWEST_HALL.wav',
    'PAPER_PLATE'             : 'static/IR/H3000/980_PAPER_PLATE.wav',
    'PRCSVHORN_PLATE'         : 'static/IR/H3000/567_PRCSVHORN_PLATE.wav',
    'RANDOM_GATE'             : 'static/IR/H3000/240_RANDOM_GATE.wav',
    'REAL_ROOM'               : 'static/IR/H3000/568_REAL_ROOM.wav',
    'ResoVibroEee'            : 'static/IR/H3000/192_ResoVibroEee.wav',
    'Reverb_Factory'          : 'static/IR/H3000/107_Reverb_Factory.wav',
    'REVERB_RAMP'             : 'static/IR/H3000/601_REVERB_RAMP.wav',
    'REVERB-a-BOUND'          : 'static/IR/H3000/736_REVERB-a-BOUND.wav',
    'REVERSE_GATE'            : 'static/IR/H3000/241_REVERSE_GATE.wav',
    'REVERSERB'               : 'static/IR/H3000/655_REVERSERB.wav',
    'rewzNooRoom'             : 'static/IR/H3000/86_DrewzNooRoom.wav',
    'RHYTHM_&_REVERB'         : 'static/IR/H3000/194_RHYTHM_&_REVERB.wav',
    'RICH_PLATE'              : 'static/IR/H3000/243_RICH_PLATE.wav',
    'RICH_PLATE'              : 'static/IR/H3000/586_RICH_PLATE.wav',
    'ROBO_DRUM'               : 'static/IR/H3000/990_ROBO_DRUM.wav',
    'ROOM_OF_DOOM'            : 'static/IR/H3000/193_ROOM_OF_DOOM.wav',
    'SHIMMERISH'              : 'static/IR/H3000/246_SHIMMERISH.wav',
    'SHIMMERISH'              : 'static/IR/H3000/602_SHIMMERISH.wav',
    'SLAPVERB'                : 'static/IR/H3000/587_SLAPVERB.wav',
    'SMALL_&_LIVE_VERB'       : 'static/IR/H3000/995_SMALL_&_LIVE_VERB.wav',
    'SMALL_DARK_ROOM'         : 'static/IR/H3000/739_SMALL_DARK_ROOM.wav',
    'SMALL_ROOM'              : 'static/IR/H3000/248_SMALL_ROOM.wav',
    'SMALLVOCAL_ROOM'         : 'static/IR/H3000/571_SMALLVOCAL_ROOM.wav',
    'SMLSTEREOSPACE'          : 'static/IR/H3000/570_SMLSTEREOSPACE.wav',
    'SMOOTH_PLATE'            : 'static/IR/H3000/588_SMOOTH_PLATE.wav',
    'Sweep_Reverb'            : 'static/IR/H3000/106_Sweep_Reverb.wav',
    'swell_reverb'            : 'static/IR/H3000/884_swell_reverb.wav',
    'THRAX-VERB'              : 'static/IR/H3000/261_THRAX-VERB.wav',
    'TIGHT_&_BRIGHT'          : 'static/IR/H3000/573_TIGHT_&_BRIGHT.wav',
    'TIGHT_ROOM'              : 'static/IR/H3000/572_TIGHT_ROOM.wav',
    'TONAL_ROOM'              : 'static/IR/H3000/254_TONAL_ROOM.wav',
    'TONAL_ROOM'              : 'static/IR/H3000/603_TONAL_ROOM.wav',
    'TWIRLING_ROOM'           : 'static/IR/H3000/262_TWIRLING_ROOM.wav',
    'USEFUL_VERB_2'           : 'static/IR/H3000/985_USEFUL_VERB_2.wav',
    'USEFUL_VERB'             : 'static/IR/H3000/265_USEFUL_VERB.wav',
    'VOCAL_BOOTH'             : 'static/IR/H3000/574_VOCAL_BOOTH.wav',
    'WARM_HALL'               : 'static/IR/H3000/257_WARM_HALL.wav',
    'WARM_HALL'               : 'static/IR/H3000/589_WARM_HALL.wav',
    "BOB'S_ROOM"              : "static/IR/H3000/578_BOB'S_ROOM.wav",
    "DREW'S_CHAMBER"          : "static/IR/H3000/561_DREW'S_CHAMBER.wav",
    "EXPLODING_'vERB"         : "static/IR/H3000/592_EXPLODING_'vERB.wav",
};

const IR_LOADED = {};

class Reverb extends FX {

    get FX_TYPE () {
        return 'REVERB';
    }

    constructor (ctx) {
        super(ctx);

        this.reverb = ctx.createConvolver();
        this.in.connect(this.reverb);
        this.reverb.connect(this.wet);
        this.wet.connect(this.out);
        this.in.connect(this.out);

        this.setIRname('BIG_SNARE');
    }

    setIRname (IRname) {
        this.IRname = IRname;
        if (IR_LOADED[this.IRname] != null) {
            this.reverb.buffer = IR_LOADED[this.IRname];
            return;
        }

        const url = IR_URL[this.IRname];
        if (url == null) { return; }

        const req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.responseType = 'arraybuffer';
        req.onload = () => {
            this.ctx.decodeAudioData(
                req.response,
                (buffer) => {
                    this.reverb.buffer = buffer;
                    IR_LOADED[this.IRname] = buffer;
                    this.setWet(this.wet);
                },
                (err) => {
                    console.log('ajax error');
                    console.log(err);
                }
            );
        };
        req.send();
    }

    setParam (p) {
        if (p.IRname != null) { this.setIRname(p.IRname); }
        if (p.wet != null) { this.setWet(p.wet); }
        this.view.setParam(p);
    }

    getParam () {
        return {
            name   : 'Reverb',
            IRname : this.IRname,
            wet    : this.wet.gain.value,
        };
    }

}

Reverb.IR_URL = IR_URL;

module.exports = Reverb;
