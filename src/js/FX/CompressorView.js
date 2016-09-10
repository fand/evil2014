const FXView = require('./FXView');
const $      = require('jquery');

class CompressorView extends FXView {

    constructor (model) {
        const dom = $('#tmpl_fx_compressor').clone();
        super(model, dom);
        this.model = model;
        this.dom = dom;
        this.dom.removeAttr('id');

        this.attack    = this.dom.find('[name=attack]');
        this.release   = this.dom.find('[name=release]');
        this.threshold = this.dom.find('[name=threshold]');
        this.ratio     = this.dom.find('[name=ratio]');
        this.knee      = this.dom.find('[name=knee]');
        this.input     = this.dom.find('[name=input]');
        this.output    = this.dom.find('[name=output]');

        this.initEvent();
    }

    initEvent () {
        super.initEvent();

        this.input.on('change input', () => {
            this.model.setParam({ input : parseFloat(this.input.val()) / 100.0 });
        });
        this.output.on('change input', () => {
            this.model.setParam({ output : parseFloat(this.output.val()) / 100.0 });
        });
        this.attack.on('change input', () => {
            this.model.setParam({ attack: parseFloat(this.attack.val()) / 1000.0 })
        });
        this.release.on('change input', () => {
            this.model.setParam({ release: parseFloat(this.release.val()) / 1000.0 });
        })
        this.threshold.on('change input', () => {
            this.model.setParam({ threshold: (parseFloat(this.threshold.val()) / -10.0) });  // [0, 100]
        });
        this.ratio.on('change input', () => {
            this.model.setParam({ ratio: parseInt(this.ratio.val()) });
        });
        this.knee.on('change input', () => {
            this.model.setParam({ knee: parseFloat(this.knee.val()) / 1000.0 });
        });
    }

    setParam (p) {
        if (p.input != null) { this.input.val(p.input * 100); }
        if (p.output != null) { this.output.val(p.output * 100); }
        if (p.attack != null) { this.attack.val(p.attack * 1000); }
        if (p.release != null) { this.release.val(p.release * 1000); }
        if (p.threshold != null) { this.threshold.val(p.threshold * -10); }
        if (p.ratio != null) { this.ratio.val(p.ratio); }
        if (p.knee != null) { this.knee.val(p.knee * 1000); }
    }

}

module.exports = CompressorView;
