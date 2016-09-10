const $ = require('jquery');

class SamplerCoreView {

    constructor (model, id, dom) {
        this.model = model;
        this.id    = id;
        this.dom   = dom;

        this.sample              = this.dom.find('.Sampler_sample');
        this.canvas_waveform_dom = this.dom.find('.waveform');
        this.canvas_waveform     = this.canvas_waveform_dom[0];
        this.ctx_waveform        = this.canvas_waveform.getContext('2d');
        this.canvas_EQ_dom       = this.dom.find('.canvasEQ');
        this.canvas_EQ           = this.canvas_EQ_dom[0];
        this.ctx_EQ              = this.canvas_EQ.getContext('2d');
        this.eq                  = this.dom.find('.Sampler_EQ');

        this.output = this.dom.find('.Sampler_output');
        this.panner = this.output.find('.pan-slider');
        this.gain = this.output.find('.gain-slider');

        this.sample_now = 0

        this.w_wave = 300;
        this.h_wave = 180;
        this.head_wave = 0;
        this.tail_wave = this.w_wave;
        this.clicked_wave = 0;
        this.target = {
            head: this.head_wave,
            tail: this.tail_wave,
            both: [this.tail_wave, this.head_wave]
        };

        this.sample_name = this.sample.find('.sample-name');
        this.sample_list = $('#tmpl-sample-list').clone();
        this.sample_list.removeAttr('id');
        this.sample.find('.file-select').append(this.sample_list);

        this.sample_list_wrapper = $('<div class="sample-list-wrapper"></div>');
        this.sample.find('.file-select').append(this.sample_list_wrapper);

        this.initEvent();

        /**
         * Do not this.updateWaveformCanvas in constructor
         * (wave is not loaded to model!!)
         */
        this.updateEQCanvas()
    }

    getWaveformPos (e) {
        return e.clientX - this.canvas_waveform.getBoundingClientRect().left;
    }

    initEvent () {
        this.sample.find('input').on("change", () => {
            this.fetchSampleTimeParam()
            this.updateWaveformCanvas(this.sample_now)
        });
        this.canvas_waveform_dom.on('mousedown', (e) => {
            const pos = this.getWaveformPos(e);
            this.clicked_wave = pos;
            if (Math.abs(pos - this.head_wave) < 3) {
                this.target_wave = 'head';
            }
            else if (Math.abs(pos - this.tail_wave) < 3) {
                this.target_wave = 'tail';
            }
            else if (this.head_wave < pos && pos < this.tail_wave) {
                this.target_wave = 'both';
            }
            else {
                this.target_wave = undefined;
            }
        })
        .on('mousemove', (e) => {
            if (this.target_wave == null) { return; }
            const pos = this.getWaveformPos(e);
            let d = pos - this.clicked_wave;

            if (this.target_wave == 'head') {
                d = Math.max(d, -this.head_wave);
                this.head_wave += d;
            }
            else if (this.target_wave == 'tail') {
                d = Math.min(d, this.w_wave - this.tail_wave);
                this.tail_wave += d;
            }
            else {
                d = Math.max(Math.min(d, this.w_wave - this.tail_wave), -this.head_wave);
                this.head_wave += d;
                this.tail_wave += d;
            }

            this.fetchSampleTimeParam();
            this.updateWaveformCanvas(this.sample_now);

            this.clicked_wave = pos;
        })
        .on('mouseup mouseout', () => {
            this.target_wave = undefined;
            this.updateWaveformCanvas(this.sample_now);
        });

        this.sample_name.on('click', () =>
            this.showSampleList()
        );

        this.sample_list.find('div').on('click', (e) => {
            this.setSample($(e.currentTarget).html());
            this.hideSampleList();
        })
        this.sample_list_wrapper.on('click', () => {
            this.hideSampleList();
        });

        this.eq.on('change', () => {
            this.fetchSampleEQParam()
            this.updateEQCanvas()
        });
        this.output.on('change', () => {
            this.fetchSampleOutputParam();
        });
    }

    bindSample (sample_now, param) {
        this.sample_now = sample_now;
        this.sample_name.find('span').text(param.wave);
        this.updateWaveformCanvas(this.sample_now);
        this.updateEQCanvas();
    }

    showSampleList () {
        const position = this.sample_name.position();
        this.sample_list.show().css({
            top  : position.top + 20,
            left : position.left,
        });
        this.sample_list_wrapper.show();
    }

    hideSampleList () {
        this.sample_list.hide();
        this.sample_list_wrapper.hide();
    }

    updateWaveformCanvas (sample_now) {
        this.sample_now = sample_now;
        const canvas  = this.canvas_waveform;
        const ctx = this.ctx_waveform;

        const w = canvas.width = this.w_wave;
        const h = canvas.height = this.h_wave - 10;
        ctx.clearRect(0, 0, w, h);

        ctx.translate(0, 10);

        const hts   = this.model.getSampleTimeParam(this.sample_now);
        const _data = this.model.getSampleData(this.sample_now);

        if (_data) {
            const wave = _data.getChannelData(0);

            // Draw waveform
            ctx.translate(0, h/2);
            ctx.beginPath();

            const d = wave.length / w;
            for (let x = 0; x < w; x++) {
                ctx.lineTo(x, wave[Math.floor(x * d)] * h * 0.45)
            }

            ctx.closePath();
            ctx.strokeStyle = 'rgb(255, 0, 220)';
            ctx.stroke();
            ctx.translate(0, -h / 2);
        }

        // Draw params
        const left  = hts[0] * w;
        const right = hts[1] * w;
        if (left < right) {
            if (this.target_wave) {
                ctx.fillStyle = 'rgba(255, 0, 160, 0.1)';
            }
            else {
                ctx.fillStyle = 'rgba(255, 0, 160, 0.2)';
            }
            ctx.fillRect(left, 0, right-left, h)
        }

        ctx.beginPath();
        ctx.arc(left,  -5, 5, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(right, -5, 5, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.closePath();
    }

    updateEQCanvas () {
        const canvas = this.canvas_EQ;
        const ctx    = this.ctx_EQ;

        const w = canvas.width = 270;
        const h = canvas.height = 100;

        // range is [-100, 100]
        eq = this.model.getSampleEQParam(this.sample_now)

        // Draw waveform
        ctx.clearRect(0, 0, w, h);
        ctx.translate(0, h / 2);
        ctx.beginPath();
        ctx.moveTo(0,       -(eq[0]/100.0) * (h / 2));
        ctx.lineTo(w/3,     -(eq[1]/100.0) * (h / 2));
        ctx.lineTo(w/3 * 2, -(eq[1]/100.0) * (h / 2));
        ctx.lineTo(w,       -(eq[2]/100.0) * (h / 2));
        ctx.strokeStyle = 'rgb(255, 0, 220)';
        ctx.stroke();
        ctx.closePath();
        ctx.translate(0, -h / 2);
    }

    setSample (name) {
        this.model.setSample(this.sample_now, name);
        this.sample_name.find('span').text(name);
    }

    fetchSampleTimeParam () {
        this.model.setSampleTimeParam(
            this.sample_now,
            this.head_wave  / 300.0,
            this.tail_wave  / 300.0,
            Math.pow(10, parseFloat(this.sample.find('.speed').val()) / 100.0 - 1.0)
        );
    }

    fetchSampleEQParam () {
        this.model.setSampleEQParam(
            this.sample_now,
            parseFloat(this.eq.find('.EQ_lo').val())  - 100.0,
            parseFloat(this.eq.find('.EQ_mid').val()) - 100.0,
            parseFloat(this.eq.find('.EQ_hi').val())  - 100.0
        );
    }

    fetchSampleOutputParam () {
        this.model.setSampleOutputParam(
            this.sample_now,
            (1.0 - (parseFloat(this.panner.val())/200.0)),
            parseFloat(this.gain.val()) / 100.0
        );
    }

    setSampleTimeParam (p) {
        this.head_wave = p[0] * 300.0
        this.tail_wave = p[1] * 300.0
        ratio = Math.log(p[2]) / Math.LN10 + 1.0
        this.sample.find('.speed').val(ratio * 100)
    }

    setSampleEQParam (p) {
        this.eq.find('.EQ_lo' ).val(p[0] + 100.0)
        this.eq.find('.EQ_mid').val(p[1] + 100.0)
        this.eq.find('.EQ_hi' ).val(p[2] + 100.0)
    }

    setSampleOutputParam (p) {
        [pan, g] = p
        this.panner.val((1.0 - pan) * 200.0)
        this.gain.val(g * 100.0)
    }

    fetchGains () {
        this.gain_inputs.each((i, input) => {
            this.model.setNodeGain(i, parseInt($(input).val(), 10));
        });
    }

}

module.exports = SamplerCoreView;
