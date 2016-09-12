const FXView = require('./FXView');
const $      = require('jquery');

class DoubleView extends FXView {

    constructor (model) {
        const dom = $('#tmpl_fx_double').clone();
        dom.removeAttr('id');
        super(model, dom);

        this.delay  = this.dom.find('[name=delay]');
        this.width  = this.dom.find('[name=width]');

        this.initEvent();
    }

    initEvent () {
        super.initEvent();
        this.delay.on('change input', () =>
            this.model.setParam({ delay: parseFloat(this.delay.val()) / 1000.0 })
        );
        this.width.on('change input', () =>
            this.model.setParam({ width: parseFloat(this.width.val()) / 200.0 + 0.5 })  // [0.5, 1.0]
        );
    }

    setParam (p) {
        if (p.delay != null) {
            this.delay.val(p.delay * 1000);
        }
        if (p.width != null) {
            this.width.val((p.width - 0.5) * 200);
        }
    }

}

module.exports = DoubleView;
