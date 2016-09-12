const FXView = require('./FXView');
const $      = require('jquery');

class ReverbView extends FXView {

    constructor (model) {
        const dom = $('#tmpl_fx_reverb').clone();
        dom.removeAttr('id');

        super(model, dom);

        this.IRname = this.dom.find('[name = name]');
        this.wet    = this.dom.find('[name = wet]');

        this.initEvent();
    }

    initEvent () {
        super.initEvent();
        this.IRname.on('change input', () =>
            this.model.setIR(this.IRname.val())
        );
        this.wet.on('change input', () =>
            this.model.setParam({ wet: parseFloat(this.wet.val()) / 100.0 })
        );
    }

    setParam (p) {
        if (p.IRname != null) { this.IRname.val(p.IRname); }
        if (p.IRname != null) { this.wet.val(p.wet * 100); }
    }

}

module.exports = ReverbView;
