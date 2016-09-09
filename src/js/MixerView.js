const $ = require('jquery');

class MixerView {

    constructor (model) {
        this.model = model;
        this.dom = $('#mixer');

        this.tracks         = $('#mixer-tracks');
        this.master         = $('#mixer-master');
        this.console_tracks = this.tracks.find('#console-tracks');
        this.console_master = this.master.find('#console-master');

        this.gains       = this.tracks.find('.console-track > .gain-slider');
        this.gain_master = this.master.find('.console-track > .gain-slider');

        this.pans_label = this.tracks.find('.console-track > .pan-label');
        this.pans       = this.tracks.find('.console-track > .pan-slider');
        this.pan_master = this.master.find('.console-track > .pan-slider');

        this.canvas_tracks_dom = this.tracks.find('.vu-meter');
        this.canvas_tracks     = this.canvas_tracks_dom.map(d => d[0]);
        this.ctx_tracks        = this.canvas_tracks.map(c => c.getContext('2d'));
        this.canvas_tracks.forEach(c => {
            [c.width, c.height] = [10, 100];
        });

        this.canvas_master_dom    = this.master.find('.vu-meter');
        this.canvas_master        = this.canvas_master_dom[0];
        this.ctx_master           = this.canvas_master.getContext('2d');
        this.canvas_master.width  = 70;
        this.canvas_master.height = 130;
        this.ctx_master.fillStyle = '#fff';
        this.ctx_master.fillRect(10, 0, 50, 130);

        this.track_dom = $('#templates > .console-track');
        this.initEvent();
    }

    initEvent () {
        this.console_tracks.on('input change', () => this.setParams());
        this.console_master.on('input change', () => this.setParams());
    }

    drawGainTracks (i, data) {
        const v = Math.max.apply(null, data);
        const h = (v - 128) / 128 * 100;

        this.ctx_tracks[i].clearRect(0, 0, 10, 100);
        this.ctx_tracks[i].fillStyle = '#0df';
        this.ctx_tracks[i].fillRect(0,  100 - h, 10, h);
    }

    drawGainMaster (data_l, data_r) {
        const v_l = Math.max.apply(null, data_l);
        const v_r = Math.max.apply(null, data_r);
        const h_l = (v_l - 128) / 128 * 130;
        const h_r = (v_r - 128) / 128 * 130;

        this.ctx_master.clearRect(0,  0, 10, 130);
        this.ctx_master.clearRect(60, 0, 10, 130);
        this.ctx_master.fillStyle = '#0df';
        this.ctx_master.fillRect(0,  130 - h_l, 10, h_l);
        this.ctx_master.fillRect(60, 130 - h_r, 10, h_r);
    }

    addSynth (synth) {
        const dom = this.track_dom.clone();
        this.console_tracks.append(dom);
        this.pans.push(dom.find('.pan-slider'));
        this.gains.push(dom.find('.gain-slider'));
        this.pans_label.push(dom.find('.pan-label'));

        const d = dom.find('.vu-meter');
        this.canvas_tracks_dom.push(d);
        this.canvas_tracks.push(d[0]);
        this.ctx_tracks.push(d[0].getContext('2d'));
        [d[0].width, d[0].height] = [10, 100];

        this.console_tracks.css({ width: (this.gains.length * 80 + 2) + 'px' });
        this.console_tracks.on('change', () => this.setGains());

        this.setParams();
    }

    setGains () {
        const g        = this.gains.map(_g => parseFloat(_g.val()) / 100.0);
        const g_master = parseFloat(this.gain_master.val() / 100.0);
        this.model.setGains(g, g_master);
    }

    setPans () {
        const p        = this.pans.map(_p => 1.0 - parseFloat(_p.val()) / 200.0);
        const p_master = 1.0 - parseFloat(this.pan_master.val()) / 200.0;
        this.model.setPans(p, p_master);

        this.pans.forEach((p, i) => {
            const ppp = parseInt(p.val()) - 100;
            const t = (
                ppp === 0 ? 'C' :
                ppp <   0 ? `${-ppp}% L` :
                `${ppp}% R`
            );
            this.pans_label[i].text(t);
        });
    }

    readGains (g, g_master) {
        g.forEach((_g, i) => {
            this.gains[i].val(_g * 100.0);
        });
        thisgain_master.val(g_master * 100.0);
    }

    readPans (p, p_master) {
        p.forEach((_p, i) => {
            this.pans[i].val((1.0 - p[i]) * 200);

            const ppp = (p[i] * 200 - 100) * -1;
            const t = (
                ppp === 0 ? 'C' :
                ppp <   0 ? `${-ppp}% L` :
                `${ppp}% R`
            );
            this.pans_label[i].text(t);
        });
    }

    setParams () {
        this.setGains();
        this.setPans();
    }

    displayGains (gains) {}

    pan2pos (v) {
        const theta = v * Math.PI;
        return [Math.cos(theta), 0, -Math.sin(theta)];
    }

    pos2pan (v) {
        return Math.acos(v[0]) / Math.PI;
    }

    empty () {
        this.console_tracks.empty();
        this.canvas_tracks_dom = [];
        this.canvas_tracks     = [];
        this.ctx_tracks        = [];
        this.pans              = [];
        this.gains             = [];
        this.pans_label        = [];
    }

}

module.exports = MixerView;
