const FXView = require('./FXView');
const $      = require('jquery');

class FuzzView extends FXView {

    constructor (model) {
        const dom = $('#tmpl_fx_fuzz').clone();
        super(model, dom);
        this.model = model;
        this.dom = dom;
        this.dom.removeAttr('id');

        this.type   = this.dom.find('[name=type]');
        this.gain   = this.dom.find('[name=gain]');
        this.input  = this.dom.find('[name=input]');
        this.output = this.dom.find('[name=output]');

        this.initEvent();
    }

    initEvent () {
        super.initEvnet();
        this.input.on('change input', () =>
            this.model.setParam({input: parseFloat(this.input.val()) / 100.0})
        )
        this.output.on('change input', () =>
            this.model.setParam({output: parseFloat(this.output.val()) / 100.0})
        )
        this.type.on('change input', () =>
            this.model.setParam({type: this.type.val()})
        )
        this.gain.on('change input', () =>
            this.model.setParam({gain: parseFloat(this.gain.val())/ 100.0})
        )
    }

    setParam (p) {
        if (p.input != null) {this.input.val(p.input * 100);}
        if (p.output != null) {this.output.val(p.output * 100);}
        if (p.type != null) {this.type.val(p.type);}
        if (p.gain != null) {this.gain.val(p.gain * 100);}
    }

}

module.exports = FuzzView
