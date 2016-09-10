const Panner = require('../Panner');

/**
 * Samples DATA
 */
const SAMPLES_DEFAULT = [
    'bd_909dwsd',
    'bd_sub808',
    'snr_drm909kit1',
    'snr_mpc',
    'clp_raw',
    'clp_basics',
    'hat_lilcloser',
    'hat_nice909open',
    'shaker_bot',
    'tam_lifein2d',
];

const SAMPLES = {
    'kick1'      : { url: 'static/wav/kick1.wav' },
    'kick2'      : { url: 'static/wav/kick2.wav' },
    'snare1'     : { url: 'static/wav/snare1.wav' },
    'snare2'     : { url: 'static/wav/snare2.wav' },
    'clap'       : { url: 'static/wav/clap.wav' },
    'hat_closed' : { url: 'static/wav/hat_closed.wav' },
    'hat_open'   : { url: 'static/wav/hat_open.wav' },
    'ride'       : { url: 'static/wav/ride.wav' },

    'bd_909dwsd'         : { url: 'static/wav/deep_house/bd_kick/bd_909dwsd.wav' },
    'bd_chicago'         : { url: 'static/wav/deep_house/bd_kick/bd_chicago.wav' },
    'bd_dandans'         : { url: 'static/wav/deep_house/bd_kick/bd_dandans.wav' },
    'bd_deephouser'      : { url: 'static/wav/deep_house/bd_kick/bd_deephouser.wav' },
    'bd_diesel'          : { url: 'static/wav/deep_house/bd_kick/bd_diesel.wav' },
    'bd_dropped'         : { url: 'static/wav/deep_house/bd_kick/bd_dropped.wav' },
    'bd_flir'            : { url: 'static/wav/deep_house/bd_kick/bd_flir.wav' },
    'bd_gas'             : { url: 'static/wav/deep_house/bd_kick/bd_gas.wav' },
    'bd_ghost'           : { url: 'static/wav/deep_house/bd_kick/bd_ghost.wav' },
    'bd_hybrid'          : { url: 'static/wav/deep_house/bd_kick/bd_hybrid.wav' },
    'bd_isampleoldskool' : { url: 'static/wav/deep_house/bd_kick/bd_isampleoldskool.wav' },
    'bd_liked'           : { url: 'static/wav/deep_house/bd_kick/bd_liked.wav' },
    'bd_mainroom'        : { url: 'static/wav/deep_house/bd_kick/bd_mainroom.wav' },
    'bd_mirror'          : { url: 'static/wav/deep_house/bd_kick/bd_mirror.wav' },
    'bd_nash'            : { url: 'static/wav/deep_house/bd_kick/bd_nash.wav' },
    'bd_newyear'         : { url: 'static/wav/deep_house/bd_kick/bd_newyear.wav' },
    'bd_organicisin'     : { url: 'static/wav/deep_house/bd_kick/bd_organicisin.wav' },
    'bd_outdoor'         : { url: 'static/wav/deep_house/bd_kick/bd_outdoor.wav' },
    'bd_shoein'          : { url: 'static/wav/deep_house/bd_kick/bd_shoein.wav' },
    'bd_sodeep'          : { url: 'static/wav/deep_house/bd_kick/bd_sodeep.wav' },
    'bd_sonikboom'       : { url: 'static/wav/deep_house/bd_kick/bd_sonikboom.wav' },
    'bd_streek'          : { url: 'static/wav/deep_house/bd_kick/bd_streek.wav' },
    'bd_stripped'        : { url: 'static/wav/deep_house/bd_kick/bd_stripped.wav' },
    'bd_sub808'          : { url: 'static/wav/deep_house/bd_kick/bd_sub808.wav' },
    'bd_tech'            : { url: 'static/wav/deep_house/bd_kick/bd_tech.wav' },
    'bd_tripper'         : { url: 'static/wav/deep_house/bd_kick/bd_tripper.wav' },
    'bd_uma'             : { url: 'static/wav/deep_house/bd_kick/bd_uma.wav' },
    'bd_untitled'        : { url: 'static/wav/deep_house/bd_kick/bd_untitled.wav' },
    'bd_vintager'        : { url: 'static/wav/deep_house/bd_kick/bd_vintager.wav' },
    'bd_vinylinstereo'   : { url: 'static/wav/deep_house/bd_kick/bd_vinylinstereo.wav' },

    'snr_analogging'     : { url: 'static/wav/deep_house/snare/snr_analogging.wav' },
    'snr_answer8bit'     : { url: 'static/wav/deep_house/snare/snr_answer8bit.wav' },
    'snr_bland'          : { url: 'static/wav/deep_house/snare/snr_bland.wav' },
    'snr_drm909kit'      : { url: 'static/wav/deep_house/snare/snr_drm909kit.wav' },
    'snr_dwreal'         : { url: 'static/wav/deep_house/snare/snr_dwreal.wav' },
    'snr_housey'         : { url: 'static/wav/deep_house/snare/snr_housey.wav' },
    'snr_mpc'            : { url: 'static/wav/deep_house/snare/snr_mpc.wav' },
    'snr_myclassicsnare' : { url: 'static/wav/deep_house/snare/snr_myclassicsnare.wav' },
    'snr_owned'          : { url: 'static/wav/deep_house/snare/snr_owned.wav' },
    'snr_royalty'        : { url: 'static/wav/deep_house/snare/snr_royalty.wav' },
    'snr_rusnarious'     : { url: 'static/wav/deep_house/snare/snr_rusnarious.wav' },
    'snr_truevintage'    : { url: 'static/wav/deep_house/snare/snr_truevintage.wav' },

    'clp_analogue'   : { url: 'static/wav/deep_house/clap/clp_analogue.wav' },
    'clp_applause'   : { url: 'static/wav/deep_house/clap/clp_applause.wav' },
    'clp_basics'     : { url: 'static/wav/deep_house/clap/clp_basics.wav' },
    'clp_can'        : { url: 'static/wav/deep_house/clap/clp_can.wav' },
    'clp_clap10000'  : { url: 'static/wav/deep_house/clap/clp_clap10000.wav' },
    'clp_classic'    : { url: 'static/wav/deep_house/clap/clp_classic.wav' },
    'clp_clipper'    : { url: 'static/wav/deep_house/clap/clp_clipper.wav' },
    'clp_delma'      : { url: 'static/wav/deep_house/clap/clp_delma.wav' },
    'clp_donuts'     : { url: 'static/wav/deep_house/clap/clp_donuts.wav' },
    'clp_drastik'    : { url: 'static/wav/deep_house/clap/clp_drastik.wav' },
    'clp_eternity'   : { url: 'static/wav/deep_house/clap/clp_eternity.wav' },
    'clp_happiness'  : { url: 'static/wav/deep_house/clap/clp_happiness.wav' },
    'clp_kiddo'      : { url: 'static/wav/deep_house/clap/clp_kiddo.wav' },
    'clp_knowledge'  : { url: 'static/wav/deep_house/clap/clp_knowledge.wav' },
    'clp_kournikova' : { url: 'static/wav/deep_house/clap/clp_kournikova.wav' },
    'clp_raw'        : { url: 'static/wav/deep_house/clap/clp_raw.wav' },
    'clp_scorch'     : { url: 'static/wav/deep_house/clap/clp_scorch.wav' },
    'clp_socute'     : { url: 'static/wav/deep_house/clap/clp_socute.wav' },
    'clp_sustained'  : { url: 'static/wav/deep_house/clap/clp_sustained.wav' },
    'clp_tayo'       : { url: 'static/wav/deep_house/clap/clp_tayo.wav' },
    'clp_tense'      : { url: 'static/wav/deep_house/clap/clp_tense.wav' },
    'clp_thinlayer'  : { url: 'static/wav/deep_house/clap/clp_thinlayer.wav' },
    'clp_verona'     : { url: 'static/wav/deep_house/clap/clp_verona.wav' },

    'hat_626'             : { url: 'static/wav/deep_house/hats/hat_626.wav' },
    'hat_ace'             : { url: 'static/wav/deep_house/hats/hat_ace.wav' },
    'hat_addverb'         : { url: 'static/wav/deep_house/hats/hat_addverb.wav' },
    'hat_analog'          : { url: 'static/wav/deep_house/hats/hat_analog.wav' },
    'hat_bebias'          : { url: 'static/wav/deep_house/hats/hat_bebias.wav' },
    'hat_bestfriend'      : { url: 'static/wav/deep_house/hats/hat_bestfriend.wav' },
    'hat_bigdeal'         : { url: 'static/wav/deep_house/hats/hat_bigdeal.wav' },
    'hat_blackmamba'      : { url: 'static/wav/deep_house/hats/hat_blackmamba.wav' },
    'hat_chart'           : { url: 'static/wav/deep_house/hats/hat_chart.wav' },
    'hat_charter'         : { url: 'static/wav/deep_house/hats/hat_charter.wav' },
    'hat_chipitaka'       : { url: 'static/wav/deep_house/hats/hat_chipitaka.wav' },
    'hat_classical'       : { url: 'static/wav/deep_house/hats/hat_classical.wav' },
    'hat_classichousehat' : { url: 'static/wav/deep_house/hats/hat_classichousehat.wav' },
    'hat_closer'          : { url: 'static/wav/deep_house/hats/hat_closer.wav' },
    'hat_collective'      : { url: 'static/wav/deep_house/hats/hat_collective.wav' },
    'hat_crackers'        : { url: 'static/wav/deep_house/hats/hat_crackers.wav' },
    'hat_critters'        : { url: 'static/wav/deep_house/hats/hat_critters.wav' },
    'hat_cuppa'           : { url: 'static/wav/deep_house/hats/hat_cuppa.wav' },
    'hat_darkstar'        : { url: 'static/wav/deep_house/hats/hat_darkstar.wav' },
    'hat_deephouseopen'   : { url: 'static/wav/deep_house/hats/hat_deephouseopen.wav' },
    'hat_drawn'           : { url: 'static/wav/deep_house/hats/hat_drawn.wav' },
    'hat_freekn'          : { url: 'static/wav/deep_house/hats/hat_freekn.wav' },
    'hat_gater'           : { url: 'static/wav/deep_house/hats/hat_gater.wav' },
    'hat_glitchbitch'     : { url: 'static/wav/deep_house/hats/hat_glitchbitch.wav' },
    'hat_hatgasm'         : { url: 'static/wav/deep_house/hats/hat_hatgasm.wav' },
    'hat_hattool'         : { url: 'static/wav/deep_house/hats/hat_hattool.wav' },
    'hat_jelly'           : { url: 'static/wav/deep_house/hats/hat_jelly.wav' },
    'hat_kate'            : { url: 'static/wav/deep_house/hats/hat_kate.wav' },
    'hat_lights'          : { url: 'static/wav/deep_house/hats/hat_lights.wav' },
    'hat_lilcloser'       : { url: 'static/wav/deep_house/hats/hat_lilcloser.wav' },
    'hat_mydustyhouse'    : { url: 'static/wav/deep_house/hats/hat_mydustyhouse.wav' },
    'hat_myfavouriteopen' : { url: 'static/wav/deep_house/hats/hat_myfavouriteopen.wav' },
    'hat_negative6'       : { url: 'static/wav/deep_house/hats/hat_negative6.wav' },
    'hat_nice909open'     : { url: 'static/wav/deep_house/hats/hat_nice909open.wav' },
    'hat_niner0niner'     : { url: 'static/wav/deep_house/hats/hat_niner0niner.wav' },
    'hat_omgopen'         : { url: 'static/wav/deep_house/hats/hat_omgopen.wav' },
    'hat_openiner'        : { url: 'static/wav/deep_house/hats/hat_openiner.wav' },
    'hat_original'        : { url: 'static/wav/deep_house/hats/hat_original.wav' },
    'hat_quentin'         : { url: 'static/wav/deep_house/hats/hat_quentin.wav' },
    'hat_rawsample'       : { url: 'static/wav/deep_house/hats/hat_rawsample.wav' },
    'hat_retired'         : { url: 'static/wav/deep_house/hats/hat_retired.wav' },
    'hat_sampleking'      : { url: 'static/wav/deep_house/hats/hat_sampleking.wav' },
    'hat_samplekingdom'   : { url: 'static/wav/deep_house/hats/hat_samplekingdom.wav' },
    'hat_sharp'           : { url: 'static/wav/deep_house/hats/hat_sharp.wav' },
    'hat_soff'            : { url: 'static/wav/deep_house/hats/hat_soff.wav' },
    'hat_spreadertrick'   : { url: 'static/wav/deep_house/hats/hat_spreadertrick.wav' },
    'hat_stereosonic'     : { url: 'static/wav/deep_house/hats/hat_stereosonic.wav' },
    'hat_tameit'          : { url: 'static/wav/deep_house/hats/hat_tameit.wav' },
    'hat_vintagespread'   : { url: 'static/wav/deep_house/hats/hat_vintagespread.wav' },
    'hat_void'            : { url: 'static/wav/deep_house/hats/hat_void.wav' },

    'shaker_bot'       : { url: 'static/wav/deep_house/shaker_tambourine/shaker_bot.wav' },
    'shaker_broom'     : { url: 'static/wav/deep_house/shaker_tambourine/shaker_broom.wav' },
    'shaker_command'   : { url: 'static/wav/deep_house/shaker_tambourine/shaker_command.wav' },
    'shaker_halfshake' : { url: 'static/wav/deep_house/shaker_tambourine/shaker_halfshake.wav' },
    'shaker_pause'     : { url: 'static/wav/deep_house/shaker_tambourine/shaker_pause.wav' },
    'shaker_quicky'    : { url: 'static/wav/deep_house/shaker_tambourine/shaker_quicky.wav' },
    'shaker_really'    : { url: 'static/wav/deep_house/shaker_tambourine/shaker_really.wav' },
    'tam_christmassy'  : { url: 'static/wav/deep_house/shaker_tambourine/tam_christmassy.wav' },
    'tam_extras'       : { url: 'static/wav/deep_house/shaker_tambourine/tam_extras.wav' },
    'tam_hohoho'       : { url: 'static/wav/deep_house/shaker_tambourine/tam_hohoho.wav' },
    'tam_lifein2d'     : { url: 'static/wav/deep_house/shaker_tambourine/tam_lifein2d.wav' },
    'tam_mrhat'        : { url: 'static/wav/deep_house/shaker_tambourine/tam_mrhat.wav' },

    'tom_909fatty'    : { url: 'static/wav/deep_house/toms/tom_909fatty.wav' },
    'tom_909onvinyl'  : { url: 'static/wav/deep_house/toms/tom_909onvinyl.wav' },
    'tom_cleansweep'  : { url: 'static/wav/deep_house/toms/tom_cleansweep.wav' },
    'tom_dept'        : { url: 'static/wav/deep_house/toms/tom_dept.wav' },
    'tom_discodisco'  : { url: 'static/wav/deep_house/toms/tom_discodisco.wav' },
    'tom_eclipse'     : { url: 'static/wav/deep_house/toms/tom_eclipse.wav' },
    'tom_enriched'    : { url: 'static/wav/deep_house/toms/tom_enriched.wav' },
    'tom_enrico'      : { url: 'static/wav/deep_house/toms/tom_enrico.wav' },
    'tom_greatwhite'  : { url: 'static/wav/deep_house/toms/tom_greatwhite.wav' },
    'tom_iloveroland' : { url: 'static/wav/deep_house/toms/tom_iloveroland.wav' },
    'tom_madisonave'  : { url: 'static/wav/deep_house/toms/tom_madisonave.wav' },
    'tom_ofalltoms'   : { url: 'static/wav/deep_house/toms/tom_ofalltoms.wav' },
    'tom_summerdayze' : { url: 'static/wav/deep_house/toms/tom_summerdayze.wav' },
    'tom_taste'       : { url: 'static/wav/deep_house/toms/tom_taste.wav' },
    'tom_vsneve'      : { url: 'static/wav/deep_house/toms/tom_vsneve.wav' },

    'prc_808rimmer'       : { url: 'static/wav/deep_house/percussion/prc_808rimmer.wav' },
    'prc_bigdrum'         : { url: 'static/wav/deep_house/percussion/prc_bigdrum.wav' },
    'prc_bongodrm'        : { url: 'static/wav/deep_house/percussion/prc_bongodrm.wav' },
    'prc_bongorock'       : { url: 'static/wav/deep_house/percussion/prc_bongorock.wav' },
    'prc_boxed'           : { url: 'static/wav/deep_house/percussion/prc_boxed.wav' },
    'prc_change'          : { url: 'static/wav/deep_house/percussion/prc_change.wav' },
    'prc_clav'            : { url: 'static/wav/deep_house/percussion/prc_clav.wav' },
    'prc_congaz'          : { url: 'static/wav/deep_house/percussion/prc_congaz.wav' },
    'prc_dnthavacowman'   : { url: 'static/wav/deep_house/percussion/prc_dnthavacowman.wav' },
    'prc_drop'            : { url: 'static/wav/deep_house/percussion/prc_drop.wav' },
    'prc_emtythepot'      : { url: 'static/wav/deep_house/percussion/prc_emtythepot.wav' },
    'prc_flickingabucket' : { url: 'static/wav/deep_house/percussion/prc_flickingabucket.wav' },
    'prc_foryoursampler'  : { url: 'static/wav/deep_house/percussion/prc_foryoursampler.wav' },
    'prc_harmony'         : { url: 'static/wav/deep_house/percussion/prc_harmony.wav' },
    'prc_hit'             : { url: 'static/wav/deep_house/percussion/prc_hit.wav' },
    'prc_home'            : { url: 'static/wav/deep_house/percussion/prc_home.wav' },
    'prc_itgoespop'       : { url: 'static/wav/deep_house/percussion/prc_itgoespop.wav' },
    'prc_jungledrummer'   : { url: 'static/wav/deep_house/percussion/prc_jungledrummer.wav' },
    'prc_knockknock'      : { url: 'static/wav/deep_house/percussion/prc_knockknock.wav' },
    'prc_reworked'        : { url: 'static/wav/deep_house/percussion/prc_reworked.wav' },
    'prc_rolled'          : { url: 'static/wav/deep_house/percussion/prc_rolled.wav' },
    'prc_syntheticlav'    : { url: 'static/wav/deep_house/percussion/prc_syntheticlav.wav' },
    'prc_trainstation'    : { url: 'static/wav/deep_house/percussion/prc_trainstation.wav' },
    'prc_u5510n'          : { url: 'static/wav/deep_house/percussion/prc_u5510n.wav' },
    'prc_vinylshot'       : { url: 'static/wav/deep_house/percussion/prc_vinylshot.wav' },
    'prc_virustiatmos'    : { url: 'static/wav/deep_house/percussion/prc_virustiatmos.wav' },
    'prc_youpanit'        : { url: 'static/wav/deep_house/percussion/prc_youpanit.wav' },

    'cym_crashtest'   : { url: 'static/wav/deep_house/ride_cymbal/cym_crashtest.wav' },
    'cym_gatecrashed' : { url: 'static/wav/deep_house/ride_cymbal/cym_gatecrashed.wav' },
    'ride_8bitdirty'  : { url: 'static/wav/deep_house/ride_cymbal/ride_8bitdirty.wav' },
    'ride_cymbal1'    : { url: 'static/wav/deep_house/ride_cymbal/ride_cymbal1.wav' },
    'ride_full'       : { url: 'static/wav/deep_house/ride_cymbal/ride_full.wav' },
    'ride_jules'      : { url: 'static/wav/deep_house/ride_cymbal/ride_jules.wav' },
    'ride_mpc60'      : { url: 'static/wav/deep_house/ride_cymbal/ride_mpc60.wav' },
};

class SampleNode {
    constructor (ctx, id, parent) {
        this.ctx    = ctx;
        this.id     = id;
        this.parent = parent;

        this.out = this.ctx.createGain();
        this.out.gain.value = 1.0;
        this.name = SAMPLES_DEFAULT[this.id];
        this.setSample(this.name);

        this.head  = 0.0;
        this.tail  = 1.0;
        this.speed = 1.0;

        // for mono source
        this.merger = this.ctx.createChannelMerger(2);

        // node to set gain for individual nodes
        this.node_buf = this.ctx.createGain();
        this.node_buf.gain.value = 1.0;

        this.eq_gains = [0.0, 0.0, 0.0]

        const [eq1, eq2, eq3] = [this.ctx.createBiquadFilter(), this.ctx.createBiquadFilter(), this.ctx.createBiquadFilter()];
        [eq1.type, eq2.type, eq3.type] = ['lowshelf', 'peaking', 'highshelf'];
        [eq1.Q.value, eq2.Q.value, eq3.Q.value] = [0.6, 0.6, 0.6];
        [eq1.frequency.value, eq2.frequency.value, eq3.frequency.value] = [350, 2000, 4000];
        [eq1.gain.value, eq2.gain.value, eq3.gain.value] = this.eq_gains;
        this.eq_nodes = [eq1, eq2, eq3];

        this.panner = new Panner(this.ctx);
        this.pan_value = 0.5;

        this.node_buf.connect(eq1);
        eq1.connect(eq2);
        eq2.connect(eq3);
        eq3.connect(this.panner.in);
        this.panner.connect(this.out);
    }

    setSample (name) {
        this.name = name;

        const sample = SAMPLES[this.name];
        if (sample == null) { return; }

        this.sample = sample;
        if (sample.data) {
            this.buffer = sample.data
        }
        else {
            const req = new XMLHttpRequest();
            req.open('GET', sample.url, true);
            req.responseType = "arraybuffer";
            req.onload = () => {
                this.ctx.decodeAudioData(
                    req.response,
                    (buffer) => {
                        this.buffer = buffer;
                        this.buffer_duration = (this.buffer.length / window.SAMPLE_RATE);
                        this.parent.sampleLoaded(this.id);
                    },
                    (err) => { console.log('ajax error'); console.log(err) }
                )
                sample.data = this.buffer
            };
            req.send();
        }
    }

    connect (dst) {
        this.dst = dst;
        this.out.connect(this.dst);
    }

    noteOn (gain, time) {
        if (!this.buffer) { return; }
        if (!this.source_old) {
            this.source_old.stop(time);
        }

        const source = this.ctx.createBufferSource();
        source.buffer = this.buffer;

        // source.connect(this.node_buf)            # for mono source
        source.connect(this.merger, 0, 0);     // for stereo source
        source.connect(this.merger, 0, 1);
        this.merger.connect(this.node_buf);

        const head_time = time + this.buffer_duration * this.head;
        const tail_time = time + this.buffer_duration * this.tail;
        source.playbackRate.value = this.speed;
        source.start(time);
        this.node_buf.gain.value = gain;
        this.source_old = source;
    }

    setTimeParam (head, tail, speed) {
        this.head  = head;
        this.tail  = tail;
        this.speed = speed;
    }

    getTimeParam () {
        return [this.head, this.tail, this.speed];
    }

    setEQParam (eq_gains) {
        this.eq_gains = eq_gains;
        [this.eq_nodes[0].gain.value, this.eq_nodes[1].gain.value, this.eq_nodes[2].gain.value] = this.eq_gains.map(g => g * 0.2);
    }

    getEQParam () {
        return this.eq_gains;
    }

    setOutputParam (pan_value, gain) {
        this.pan_value = pan_value;
        this.panner.setPosition(this.pan_value);
        this.out.gain.value = gain;
    }

    getOutputParam () {
        return [this.pan_value, this.out.gain.value];
    }

    getData () {
        return this.buffer;
    }

    getParam () {
        return {
            wave   : this.name,
            time   : this.getTimeParam(),
            gains  : this.eq_gains,
            output : this.getOutputParam(),
        };
    }

    setParam (p) {
        if (p.wave != null) { this.setSample(p.wave); }
        if (p.time != null) { this.setTimeParam(p.time[0], p.time[1], p.time[2]); }
        if (p.time != null) { this.setEQParam(p.gains); }
        if (p.time != null) { this.setOutputParam(p.output[0], p.output[1]); }
    }

}

module.exports = SampleNode;
