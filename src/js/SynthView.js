const $ = require('jquery');

const KeyboardView = require('./Synth/KeyboardView');

class SynthView {

    constructor (model, id) {
        this.model = model;
        this.id    = id;

        this.dom = $('#tmpl_synth').clone();
        this.dom.attr('id', `synth${this.id}`);
        $('#instruments').append(this.dom);

        this.synth_name   = this.dom.find('.synth-name');
        this.pattern_name = this.dom.find('.pattern-name');
        this.synth_name.val(this.model.name);
        this.pattern_name.val(this.model.pattern_name);

        // header DOM
        this.synth_type = this.dom.find('.synth-type');
        this.pencil     = this.dom.find('.sequencer-pencil');
        this.step       = this.dom.find('.sequencer-step');
        this.is_step    = false;

        this.header      = this.dom.find('.header');
        this.markers     = this.dom.find('.markers');
        this.pos_markers = this.dom.find('.marker');  // list of list of markers
        this.marker_prev = this.dom.find('.marker-prev');
        this.marker_next = this.dom.find('.marker-next');
        this.plus        = this.dom.find('.pattern-plus');
        this.minus       = this.dom.find('.pattern-minus');
        this.nosync      = this.dom.find('.pattern-nosync');
        this.is_nosync = false;
        this.setMarker();

        // table DOM
        this.table_wrapper    = this.dom.find('.sequencer-table');
        this.canvas_hover_dom = this.dom.find('.table-hover');
        this.canvas_on_dom    = this.dom.find('.table-on');
        this.canvas_off_dom   = this.dom.find('.table-off');

        this.canvas_hover = this.canvas_hover_dom[0];
        this.canvas_on    = this.canvas_on_dom[0];
        this.canvas_off   = this.canvas_off_dom[0];

        this.ctx_hover = this.canvas_hover.getContext('2d');
        this.ctx_on    = this.canvas_on.getContext('2d');
        this.ctx_off   = this.canvas_off.getContext('2d');

        this.cell = new Image();
        this.cell.src = 'static/img/sequencer_cell.png';
        this.cell.onload = () => this.initCanvas();

        this.cells_x = 32;
        this.cells_y = 20;

        this.btn_fold = this.dom.find('.btn-fold-core');
        this.core     = this.dom.find('.synth-core');
        this.is_panel_opened = true;

        this.btn_fx = this.dom.find('.btn-fx-view');
        this.fx     = this.dom.find('.synth-fx');
        this.is_fx_view = false;

        this.keyboard = new KeyboardView(this);

        // Flags / Params
        this.pattern = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        this.pattern_obj = { name: this.model.pattern_name, pattern: this.pattern };
        this.page = 0;
        this.page_total = 1;

        this.last_time = 0;
        this.last_page = 0;

        this.is_clicked = false;
        this.hover_pos = {x:-1, y:-1};
        this.click_pos = {x:-1, y:-1};

        this.initEvent();
    }

    initCanvas () {
        this.canvas_hover.width  = this.canvas_on.width  = this.canvas_off.width  = 832;
        this.canvas_hover.height = this.canvas_on.height = this.canvas_off.height = 520;
        this.rect = this.canvas_off.getBoundingClientRect();
        this.offset = { x: this.rect.left, y: this.rect.top };

        for (let i = 0; i < this.cells_y; i++) {
            for (let j = 0; j < this.cells_x; j++) {
                this.ctx_off.drawImage(this.cell,
                    0, 0, 26, 26,           // src (x, y, w, h)
                    j * 26, i * 26, 26, 26  // dst (x, y, w, h)
                );
            }
        }

        this.setPattern(this.pattern_obj);
    }

    getPos (e) {
        this.rect = this.canvas_off.getBoundingClientRect();
        const _x = Math.floor((e.clientX - this.rect.left) / 26);
        const _y = Math.floor((e.clientY - this.rect.top) / 26);
        return {
            x     : _x,
            y     : _y,
            x_abs : this.page * this.cells_x + _x,
            y_abs : _y,
            note  : this.cells_y - _y,
        };
    }

    initEvent () {
        // Sequencer
        this.canvas_hover_dom.on('mousemove', (e) => {
            const pos = this.getPos(e);

            // Show current pos.
            if (pos != this.hover_pos) {
                this.ctx_hover.clearRect(
                    this.hover_pos.x * 26, this.hover_pos.y * 26, 26, 26
                );
                this.ctx_hover.drawImage(this.cell,
                    52, 0, 26, 26,
                    pos.x * 26, pos.y * 26, 26, 26
                );
                this.hover_pos = pos;
            }

            // Add / Remove notes.
            if (this.is_clicked && this.click_pos != pos) {
                if (this.is_sustaining) {
                    this.sustain_l = Math.min(pos.x_abs, this.sustain_l);
                    this.sustain_r = Math.max(pos.x_abs, this.sustain_r);
                    this.sustainNote(this.sustain_l, this.sustain_r, pos);
                }
                else {
                    if (this.is_adding) {
                        this.addNote(pos);
                    }
                    else if (this.pattern[pos.x_abs] == pos.note) {
                        this.removeNote(pos);
                    }
                }
                this.click_pos = pos;
            }
        })
        .on('mousedown', (e) => {
            this.is_clicked = true;
            const pos = this.getPos(e);

            if (this.is_step) {
                if (this.pattern[pos.x_abs] == pos.note) {
                    this.removeNote(pos)
                }
                else {
                    this.is_adding = true
                    this.addNote(pos)
                }
            }
            else {
                // sustaining
                if (this.pattern[pos.x_abs] == 'sustain' || this.pattern[pos.x_abs] == 'end') {
                    this.addNote(pos)
                    this.sustain_l = this.sustain_r = pos.x_abs
                    this.is_sustaining = true
                }
                // not sustaining
                else {
                    this.addNote(pos)
                    this.sustain_l = this.sustain_r = pos.x_abs
                    this.is_sustaining = true
                }
            }

        })
        .on('mouseup', (e) => {
            this.is_clicked = false;
            if (this.is_step) {
                this.is_adding = false;
            }
            else {
                const pos = this.getPos(e);
                this.is_sustaining = false;
            }
        })
        .on('mouseout', (e) => {
            this.ctx_hover.clearRect(
                this.hover_pos.x * 26, this.hover_pos.y * 26, 26, 26
            );
            this.hover_pos  = {x: -1, y: -1};
            this.is_clicked = false;
            this.is_adding  = false;
        });

        // Headers
        this.synth_type.on('change', () => this.model.changeSynth(this.synth_type.val()))
        this.synth_name.on('focus', () => {
            window.keyboard.beginInput();
        })
        .on('blur', () => {
            window.keyboard.endInput();
        })
        .on('change', () => {
            this.model.setSynthName(this.synth_name.val())
        });

        this.pattern_name.on('focus', () => {
            window.keyboard.beginInput();
        })
        .on('blur', () => {
            window.keyboard.endInput();
        })
        .on('change', () => {
            this.model.inputPatternName(this.pattern_name.val());
        });

        this.pencil.on('click', () => this.pencilMode());
        this.step.on('click', () => this.stepMode());

        this.marker_prev.on('click', () => this.model.player.backward(true));
        this.marker_next.on('click', () => this.model.player.forward());

        this.nosync.on('click', () => this.toggleNoSync());
        this.plus.on('click', () => this.plusPattern());
        this.minus.on('click', () => {
            if (this.pattern.length > this.cells_x) {
                this.minusPattern();
            }
        });

        this.btn_fold.on('mousedown', () => {
            if (this.is_panel_opened) {
                this.core.css('height', '0px');
                this.table_wrapper.css('height', '524px');
                this.btn_fold.css({ top: '-22px', padding: '0px 5px 0px 0px' })
                    .removeClass('fa-angle-down')
                    .addClass('fa-angle-up');
                this.is_panel_opened = false;
            }
            else {
                this.core.css('height', '280px');
                this.table_wrapper.css('height', '262px');
                this.btn_fold.css({ top: '0px', padding: '5px 5px 5px 5px' })
                    .removeClass('fa-angle-up')
                    .addClass('fa-angle-down');
                this.is_panel_opened = true;
            }
        });

        this.btn_fx.on('mousedown', () => {
            if (this.is_fx_view) {
                // this.core.css('height', '0px')
                // this.table_wrapper.css('height', '524px')
                // this.btn_fold.css(top: '-22px', padding: '0px 5px 0px 0px').removeClass('fa-angle-down').addClass('fa-angle-up')
                this.is_fx_view = false;
            }
            else {
                this.core.css('height', '280px');
                this.table_wrapper.css('height', '262px');
                this.btn_fold.css({ top: '0px', padding: '5px 5px 5px 5px' })
                    .removeClass('fa-angle-up')
                    .addClass('fa-angle-down');
                this.is_panel_opened = true;
            }
        });
    }

    addNote (pos) {
        if (this.pattern[pos.x_abs] == 'end' || this.pattern[pos.x_abs] == 'sustain') {
            let i = pos.x_abs - 1;
            while (this.pattern[i] == 'sustain' || this.pattern[i] == 'end') {
                i--;
            }
            this.ctx_on.clearRect(((pos.x_abs-1) % this.cells_x) * 26, 0, 26, 1000);
            const y = this.cells_y + this.pattern[i];

            if (this.pattern[pos.x_abs-1] < 0) {
                this.pattern[pos.x_abs-1] = -(this.pattern[pos.x_abs-1]);
                this.ctx_on.drawImage(this.cell,
                    0, 0, 26, 26,
                    ((pos.x_abs-1) % this.cells_x) * 26, y * 26, 26, 26
                );
            }
            else {
                this.pattern[pos.x_abs-1] = 'end';
                this.ctx_on.drawImage(this.cell,
                    156, 0, 26, 26,
                    ((pos.x_abs-1) % this.cells_x) * 26, y * 26, 26, 26
                );
            }
        }

        let i = pos.x_abs + 1;
        while (this.pattern[i] == 'end' || this.pattern[i] == 'sustain') {
            this.pattern[i] = 0;
            i++;
        }
        this.ctx_on.clearRect(pos.x * 26, 0, (i - pos.x_abs) * 26, 1000)

        this.pattern[pos.x_abs] = pos.note
        this.model.addNote(pos.x_abs, pos.note)
        this.ctx_on.clearRect(pos.x * 26, 0, 26, 1000)
        this.ctx_on.drawImage(this.cell,
            26, 0, 26, 26,
            pos.x * 26, pos.y * 26, 26, 26
        )
    }

    removeNote (pos) {
        this.pattern[pos.x_abs] = 0
        this.ctx_on.clearRect(pos.x * 26, pos.y * 26, 26, 26)
        this.model.removeNote(pos.x_abs)
    }

    sustainNote (l, r, pos) {
        if (l === r) {
            this.addNote(pos);
            return;
        }

        for (let i = l; i <= r; i++) {
            this.ctx_on.clearRect((i % this.cells_x) * 26, 0, 26, 1000);
        }

        for (let i = l + 1; i < r; i++) {
            this.pattern[i] = 'sustain';
            this.ctx_on.drawImage(this.cell,
                130, 0, 26, 26,
                (i % this.cells_x) * 26, pos.y * 26, 26, 26
            );
        }

        if (this.pattern[l] == 'sustain' || this.pattern[l] == 'end') {
            let i = l - 1;
            while (this.pattern[i] == 'sustain' || this.pattern[i] == 'end') {
                i--;
            }
            this.ctx_on.clearRect(((l-1) % this.cells_x) * 26, 0, 26, 1000);
            const y = this.cells_y + this.pattern[i];
            if (this.pattern[l-1] < 0) {
                this.pattern[l-1] = -(this.pattern[l-1]);
                this.ctx_on.drawImage(this.cell,
                    0, 0, 26, 26,
                    ((l - 1) % this.cells_x) * 26, y * 26, 26, 26
                );
            }
            else {
                this.pattern[l-1] = 'end';
                this.ctx_on.drawImage(this.cell,
                    156, 0, 26, 26,
                    ((l-1) % this.cells_x) * 26, y * 26, 26, 26
                );
            }
        }

        if (this.pattern[r] < 0) {
            const y = this.cells_y + this.pattern[r];
            if (this.pattern[r + 1] === 'end') {
                this.pattern[r + 1] = -(this.pattern[r]);
                this.ctx_on.drawImage(this.cell,
                    26, 0, 26, 26,
                    ((r+1) % this.cells_x) * 26, y * 26, 26, 26
                );
            }
            else {
                this.pattern[r + 1] = this.pattern[r];
                this.ctx_on.drawImage(this.cell,
                    104, 0, 26, 26,
                    ((r+1) % this.cells_x) * 26, y * 26, 26, 26
                );
            }
        }

        this.pattern[l] = -(pos.note);
        this.pattern[r] = 'end';

        this.ctx_on.drawImage(this.cell,
            104, 0, 26, 26,
            (l % this.cells_x) * 26, pos.y * 26, 26, 26
        )
        this.ctx_on.drawImage(this.cell,
            156, 0, 26, 26,
            (r % this.cells_x) * 26, pos.y * 26, 26, 26
        )
        this.model.sustainNote(l, r, pos.note)
    }

    endSustain (time) {
        if (this.is_sustaining) {
            if (this.pattern[time-1] == 'sustain') {
                this.pattern[time-1] = 'end';
            }
            else {
                this.pattern[time-1] *= -1;
            }
            this.is_sustaining = false;
        }
    }

    // Show the position bar.
    playAt (time) {
        this.time = time;
        if (this.is_nosync) { return; }

        if (this.time % this.cells_x == 0) {
            this.endSustain();
            this.drawPattern(this.time);
        }
        for (let i = 0; i < this.cells_y; i++) {
            this.ctx_off.drawImage(this.cell,
                0, 0, 26, 26,
                (this.last_time % this.cells_x) * 26, i * 26, 26, 26
            );
            this.ctx_off.drawImage(this.cell,
                78, 0, 26, 26,
                (this.time % this.cells_x) * 26, i * 26, 26, 26
            );
        }

        this.last_time = this.time;
    }

    setPattern (pattern_obj) {
        this.pattern_obj = pattern_obj;
        this.pattern     = this.pattern_obj.pattern;
        this.page        = 0;
        this.page_total  = this.pattern.length / this.cells_x;
        this.drawPattern(0);
        this.setMarker();
        this.setPatternName(this.pattern_obj.name);
    }

    drawPattern (time) {
        if (time != null) {
            this.time = time;
        }

        this.page = Math.floor(this.time / this.cells_x);
        this.ctx_on.clearRect(0, 0, 832, 520);

        let last_y = 0;

        for (let i = 0; i < this.cells_x; i++) {
            const note = this.pattern[this.page * this.cells_x + i];
            if (note == 'sustain') {
                this.ctx_on.drawImage(
                    this.cell,
                    130, 0, 26, 26,
                    i * 26, last_y * 26, 26, 26
                )
            }
            else if (note == 'end') {
                this.ctx_on.drawImage(
                    this.cell,
                    156, 0, 26, 26,
                    i * 26, last_y * 26, 26, 26
                )
                last_y = 0;
            }
            else if (note < 0) {
                const y = this.cells_y + note    // this.cells_y - (- note)
                this.ctx_on.drawImage(
                    this.cell,
                    104, 0, 26, 26,
                    i * 26, y * 26, 26, 26
                )
                last_y = y;
            }
            else {
                const y = this.cells_y - note;
                this.ctx_on.drawImage(
                    this.cell,
                    26, 0, 26, 26,
                    i * 26, y * 26, 26, 26
                )
                last_y = y;
            }
        }

        this.setMarker();
    }

    plusPattern () {
        if (this.page_total == 8) { return; }
        this.page_total++;
        this.model.plusPattern();
        this.drawPattern();
        this.minus.removeClass('btn-false').addClass('btn-true');
        if (this.page_total == 8) {
            this.plus.removeClass('btn-true').addClass('btn-false');
        }
    }

    minusPattern () {
        if (this.page_total == 1) { return; }
        this.pattern = this.pattern.slice(0, this.pattern.length - this.cells_x);
        this.page_total--;
        this.model.minusPattern();
        this.drawPattern();
        this.plus.removeClass('btn-false').addClass('btn-true');
        if (this.page_total == 1) {
            this.minus.removeClass('btn-true').addClass('btn-false');
        }
    }

    setMarker () {
        this.pos_markers.filter((i) => i  < this.page_total).addClass('marker-active')
        this.pos_markers.filter((i) => this.page_total <= i).removeClass('marker-active')
        this.pos_markers.removeClass('marker-now').eq(this.page).addClass('marker-now')
        this.markers.find('.marker-pos').text(this.page + 1)
        this.markers.find('.marker-total').text(this.page_total)
        this.pos_markers.filter((i) => i  < this.page_total).each((i) => {
            this.pos_markers.eq(i).on('mousedown', () => {
                if (this.page < i) {
                    while (this.page != i) {
                        this.model.player.forward();
                    }
                }
                if (i < this.page) {
                    while (this.page != i) {
                        this.model.player.backward(true);  // force
                    }
                }
            })
        })
    }

    play () {
        console.log('nothing to do');
    }

    stop () {
        for (let i = 0; i < this.cells_y; i++) {
            this.ctx_off.drawImage(this.cell,
                0, 0, 26, 26,
                (this.last_time % this.cells_x) * 26, i * 26, 26, 26
            );
        }
    }

    activate (i) {
        this.is_active = true;
        this.initCanvas();
    }

    inactivate () {
        this.is_active = false;
    }

    setSynthName (name) {
        this.synth_name.val(name);
    }

    setPatternName (name) {
        this.pattern_name.val(name);
        this.pattern_obj.name = name;
    }

    toggleNoSync () {
        if (this.is_nosync) {
            this.is_nosync = false;
            this.nosync.removeClass('btn-true').addClass('btn-false');
            this.drawPattern(this.time);
        }
        else {
            this.is_nosync = true;
            this.nosync.removeClass('btn-false').addClass('btn-true');
            for (let i = 0; i < this.cells_y; i++) {
                this.ctx_off.drawImage(this.cell,
                    0, 0, 26, 26,
                    (this.time % this.cells_x) * 26, i * 26, 26, 26
                );
            }
        }
    }

    pencilMode () {
        this.is_step = false
        this.pencil.removeClass('btn-false').addClass('btn-true')
        this.step.removeClass('btn-true').addClass('btn-false')
    }

    stepMode () {
        this.is_step = true
        this.step.removeClass('btn-false').addClass('btn-true')
        this.pencil.removeClass('btn-true').addClass('btn-false')
    }

    changeScale (scale) {
        this.keyboard.changeScale(scale);
    }

}

module.exports = SynthView;
