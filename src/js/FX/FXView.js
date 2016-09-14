const $ = require('jquery');

class FXView {
    constructor (model, dom) {
        this.model = model;
        this.dom   = dom;
        this.minus = this.dom.find('.sidebar-effect-minus');
    }

    initEvent () {
        this.minus.on('click', () => {
            this.model.remove();
            $(this.dom).remove();
        });
    }
}

module.exports = FXView;
