const FXView = require('./FXView');
const $      = require('jquery');

class DelayView extends FXView {

    constructor (model) {
        const dom = $('#tmpl_fx_delay').clone();
        dom.removeAttr('id');

        super(model, dom);

        this.delay    = this.dom.find('[name=delay]');
        this.feedback = this.dom.find('[name=feedback]');
        this.lofi     = this.dom.find('[name=lofi]');
        this.wet      = this.dom.find('[name=wet]');

        this.initEvent();
    }

    initEvent () {
        super.initEvent();
        this.wet.on('change input', () =>
            this.model.setParam({
                wet: parseFloat(this.wet.val()) / 100.0,
            })
        );
        this.delay.on('change input', () =>
            this.model.setParam({
                delay: parseFloat(this.delay.val()) / 1000.0,
            })
        );
        this.feedback.on('change input', () =>
            this.model.setParam({
                feedback: parseFloat(this.feedback.val()) / 100.0,
            })
        );
        this.lofi.on('change input', () =>
            this.model.setParam({
                lofi: parseFloat(this.lofi.val()) * 5.0 / 100.0,
            })
        );
    }

    setParam (p) {
        if (p.delay) { this.delay.val(p.delay * 1000); }
        if (p.feedback) { this.feedback.val(p.feedback * 100); }
        if (p.lofi) { this.lofi.val(p.lofi * 20); }
        if (p.wet) { this.wet.val(p.wet * 100); }
    }

}

module.exports = DelayView;
