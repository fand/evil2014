const $ = require('jquery');

class SynthCoreView {

    constructor (model, id, dom) {
        this.model = model;
        this.id    = id;
        this.dom   = dom;

        this.vcos = $(this.dom.find('.RS_VCO'));

        this.EG_inputs     = this.dom.find('.RS_EG input');
        this.FEG_inputs    = this.dom.find('.RS_FEG input');
        this.filter_inputs = this.dom.find(".RS_filter input");
        this.gain_inputs   = this.dom.find('.RS_mixer input');

        this.canvasEG   = this.dom.find(".RS_EG .canvasEG").get()[0]
        this.canvasFEG  = this.dom.find(".RS_FEG .canvasFEG").get()[0]
        this.contextEG  = this.canvasEG.getContext('2d')
        this.contextFEG = this.canvasFEG.getContext('2d')

        this.initEvent()
    }

    initEvent () {
        this.vcos.on("change input",          () => this.fetchVCOParam())
        this.gain_inputs.on("change input",   () => this.fetchGains())
        this.filter_inputs.on("change input", () => this.fetchFilterParam())
        this.EG_inputs.on("change input",     () => this.fetchEGParam())
        this.FEG_inputs.on("change input",    () => this.fetchFEGParam())
        this.fetchParam()
    }

    updateCanvas (name) {
        let canvas  = null;
        let context = null;
        let adsr    = null;
        if (name === 'EG') {
            canvas  = this.canvasEG;
            context = this.contextEG;
            adsr    = this.model.eg.getADSR();
        }
        else {
            canvas  = this.canvasFEG;
            context = this.contextFEG;
            adsr    = this.model.feg.getADSR();
        }

        const w = canvas.width = 180;
        const h = canvas.height = 50;
        const w4 = w / 4;

        context.clearRect(0, 0, w, h);
        context.beginPath();
        context.moveTo(w4 * (1.0 - adsr[0]), h);

        // Attack
        context.lineTo(w / 4, 0);
        // Decay
        context.lineTo(w4 * (adsr[1] + 1), h * (1.0 - adsr[2]));
        // Sustain
        context.lineTo(w4 * 3, h * (1.0 - adsr[2]));
        // Release
        context.lineTo(w4 * (adsr[3] + 3), h);

        context.strokeStyle = 'rgb(0, 220, 255)';
        context.stroke();
    }

    fetchParam () {
        this.fetchVCOParam();
        this.fetchEGParam();
        this.fetchFEGParam();
        this.fetchFilterParam();
        this.fetchGains();
    }

    fetchVCOParam () {
        const harmony = this.vcos.eq(0).find('.harmony').val();
        this.vcos.each((i, v) => {
            const vco = $(v);
            this.model.setVCOParam(
                i,
                vco.find('.shape').val(),
                parseInt(vco.find('.octave').val(), 10),
                parseInt(vco.find('.interval').val(), 10),
                parseInt(vco.find('.fine').val(), 10),
                harmony
            );
        });
    }

    setVCOParam (p) {
        this.vcos.each((i, v) => {
            const vco = $(v);
            vco.find('.shape').val(p[i].shape);
            vco.find('.octave').val(p[i].octave);
            vco.find('.interval').val(p[i].interval);
            vco.find('.fine').val(p[i].fine);
        });
    }

    fetchEGParam () {
        this.model.setEGParam(
            parseFloat(this.EG_inputs.eq(0).val()),
            parseFloat(this.EG_inputs.eq(1).val()),
            parseFloat(this.EG_inputs.eq(2).val()),
            parseFloat(this.EG_inputs.eq(3).val())
        )
        this.updateCanvas("EG");
    }

    setEGParam (p) {
        this.EG_inputs.eq(0).val(p.adsr[0] * 50000)
        this.EG_inputs.eq(1).val(p.adsr[1] * 50000)
        this.EG_inputs.eq(2).val(p.adsr[2] * 100)
        this.EG_inputs.eq(3).val(p.adsr[3] * 50000)
    }

    fetchFEGParam () {
        this.model.setFEGParam(
            parseFloat(this.FEG_inputs.eq(0).val()),
            parseFloat(this.FEG_inputs.eq(1).val()),
            parseFloat(this.FEG_inputs.eq(2).val()),
            parseFloat(this.FEG_inputs.eq(3).val())
        );
        this.updateCanvas("FEG");
    }

    setFEGParam (p) {
        for (let i = 0; i < p.length; i++) {
            this.FEG_inputs.eq(i).val(p.adsr[i]);
        }
    }

    fetchFilterParam () {
        this.model.setFilterParam(
            parseFloat(this.filter_inputs.eq(0).val()),
            parseFloat(this.filter_inputs.eq(1).val())
        )
    }

    setFilterParam (p) {
        this.filter_inputs.eq(0).val(p[0]);
        this.filter_inputs.eq(1).val(p[1]);
    }

    fetchGains () {
        this.gain_inputs.each((i, g) => {
            this.model.setVCOGain(i, parseInt($(g).val(), 10));
        });
    }

    setParam (p) {
        if (p.vcos != null) {
            this.setVCOParam(p.vcos);
        }
        if (p.gains != null) {
            p.gains.forEach((g, i) => {
                this.gain_inputs.eq(i).val(g / 0.3 * 100);
            });
        }
        if (p.eg != null) { this.setEGParam(p.eg); }
        if (p.feg != null) { this.setFEGParam(p.feg); }
        if (p.filter != null) { this.setFilterParam(p.filter); }
    }

}

module.exports = SynthCoreView;
