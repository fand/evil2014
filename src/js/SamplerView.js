const $                   = require('jquery');
const SamplerKeyboardView = require('./Sampler/SamplerKeyboardView');

class SamplerView {

    constructor (model, id) {
        this.model = model;
        this.id = id;

        this.dom = $('#tmpl_sampler').clone();
        this.dom.attr('id', `sampler${this.id}`);
        $('#instruments').append(this.dom);

        this.synth_name = this.dom.find('.synth-name');
        this.synth_name.val(this.model.name);
        this.pattern_name = this.dom.find('.pattern-name');
        this.pattern_name.val(this.model.pattern_name);

        // header DOM
        this.synth_type = this.dom.find('.synth-type');

        this.header      = this.dom.find('.header');
        this.markers     = this.dom.find('.markers');
        this.pos_markers = this.dom.find('.marker'); // list of list of markers
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
        this.cells_y = 10;

        this.core = this.dom.find('.sampler-core');

        this.keyboard = new SamplerKeyboardView(this);

        // Flags / Params
        this.pattern = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
        this.pattern_obj = { name: this.pattern_name.val(), pattern: this.pattern };
        this.page = 0;
        this.page_total = 1;

        this.last_time = 0;
        this.last_page = 0;

        this.is_clicked = false;
        this.hover_pos = { x:-1, y:-1 };
        this.click_pos = { x:-1, y:-1 };

        this.initEvent();
        this.initCanvas();
    }

    initCanvas () {
        this.canvas_hover.width  = this.canvas_on.width  = this.canvas_off.width  = 832;
        this.canvas_hover.height = this.canvas_on.height = this.canvas_off.height = 260;
        this.rect = this.canvas_off.getBoundingClientRect();
        this.offset = { x: this.rect.left, y: this.rect.top };

        for (let i = 0; i < this.cells_y; i++) {
            for (let j = 0; j < this.cells_x; j++) {
                this.ctx_off.drawImage(this.cell,
                    0, 26, 26, 26,           // src (x, y, w, h)
                    j * 26, i * 26, 26, 26  // dst (x, y, w, h)
                );
            }
        }
        this.setPattern(this.pattern_obj);
    }

    getPos (e) {
        this.rect = this.canvas_off.getBoundingClientRect();
        let _x = Math.floor((e.clientX - this.rect.left) / 26);
        let _y = Math.floor((e.clientY - this.rect.top) / 26);
        _y = Math.min(9, _y);  // assert (note != 0)

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
            if (pos != this.hover_pos) {
                this.ctx_hover.clearRect(
                    this.hover_pos.x * 26, this.hover_pos.y * 26, 26, 26
                );
                this.ctx_hover.drawImage(this.cell,
                    52, 26, 26, 26,
                    pos.x * 26, pos.y * 26, 26, 26
                );
                this.hover_pos = pos;
            }

            if (this.is_clicked && this.click_pos != pos) {
                if (this.is_adding) {
                    this.addNote(pos, 1.0);
                }
                else {
                    this.removeNote(pos);
                }
                this.click_pos = pos;
            }
        })
        .on('mousedown', (e) => {
            this.is_clicked = true;
            const pos = this.getPos(e);

            let remove = false;
            for (let i = 0; i < this.pattern[pos.x_abs].length; i++) {
                const note = this.pattern[pos.x_abs][i];
                if (note[0] == pos.note) {
                    remove = true;
                    break;
                }
            }

            if (remove) {
                this.removeNote(pos);
            }
            else {
                this.is_adding = true;
                this.addNote(pos, 1.0);
            }
        })
        .on('mouseup', (e) => {
            this.is_clicked  = false;
            this.is_adding   = false;
            this.is_removing = false;
        })
        .on('mouseout', (e) => {
            this.ctx_hover.clearRect(
                this.hover_pos.x * 26, this.hover_pos.y * 26, 26, 26
            );
            this.hover_pos = { x: -1, y: -1 };
            this.is_clicked  = false;
            this.is_adding   = false;
            this.is_removing = false;
        });

        // Headers
        this.synth_type.on('change', () => this.model.changeSynth(this.synth_type.val()));
        this.synth_name.on('focus', () => {
            window.keyboard.beginInput();
        })
        .on('blur', () => {
            window.keyboard.endInput();
        })
        .on('change', () => {
            this.model.setSynthName(this.synth_name.val());
        });

        this.pattern_name.on('focus', () => {
            window.keyboard.beginInput();
        })
        .on('blur', () => {
            window.keyboard.endInput();
        })
        .on('change', () => {
            this.model.setPatternName(this.pattern_name.val());
        })

        this.marker_prev.on('click', () => this.model.player.backward(true));
        this.marker_next.on('click', () => this.model.player.forward());

        this.nosync.on('click', () => this.toggleNoSync());
        this.plus.on('click', () => this.plusPattern());
        this.minus.on('click', () => {
            if (this.pattern.length > this.cells_x) {
                this.minusPattern();
            }
        });
    }

    addNote (pos, gain) {
        if (this.pattern[pos.x_abs] === 0) {
            this.pattern[pos.x_abs] = [];
        }
        if (!Array.isArray(this.pattern[pos.x_abs])) {
            this.pattern[pos.x_abs] = [[this.pattern[pos.x_abs], 1.0]];
        }

        const pats = this.pattern[pos.x_abs];
        for (let i = 0; i < pats.length; i++) {
            if (pats[i][0] == pos.note) {
                pats.splice(i, 1);
            }
        }
        pats.push([pos.note, gain]);

        this.model.addNote(pos.x_abs, pos.note, gain);
        this.ctx_on.drawImage(this.cell,
            26, 26, 26, 26,
            pos.x * 26, pos.y * 26, 26, 26
        );
    }

    removeNote (pos) {
        const pats = this.pattern[pos.x_abs];
        for (let i = 0; i < pats.length; i++) {
            if (pats[i][0] == pos.note) {
                pats.splice(i, 1);
            }
        }

        this.ctx_on.clearRect(pos.x * 26, pos.y * 26, 26, 26);
        this.model.removeNote(pos);
    }

    playAt (time) {
        this.time = time;
        if (this.is_nosync) { return; }

        if (this.time % this.cells_x == 0) {
            this.drawPattern(this.time);
        }

        for (let i = 0; i < this.cells_y; i++) {
            this.ctx_off.drawImage(this.cell,
                0, 26, 26, 26,
                (this.last_time % this.cells_x) * 26, i * 26, 26, 26
            );
            this.ctx_off.drawImage(this.cell,
                78, 26, 26, 26,
                (this.time % this.cells_x) * 26, i * 26, 26, 26
            );
        }

        this.last_time = this.time;
    }

    setPattern (pattern_obj) {
        this.pattern_obj = pattern_obj;
        this.pattern = this.pattern_obj.pattern
        this.page = 0
        this.page_total = this.pattern.length / this.cells_x
        this.drawPattern(0)
        this.setMarker()
        this.setPatternName(this.pattern_obj.name)
    }

    drawPattern (time) {
        if (time != null) {
            this.time = time;
        }

        this.page = Math.floor(this.time / this.cells_x);
        this.ctx_on.clearRect(0, 0, 832, 260);

        for (let i = 0; i < this.cells_x; i++) {  // XXX: cells_yで合ってる？
            this.pattern[this.page * this.cells_x + i].forEach((j) => {
                const y = this.cells_y - j[0];
                this.ctx_on.drawImage(
                    this.cell,
                    26, 26, 26, 26,
                    i * 26, y * 26, 26, 26
                );
            })
        }

        this.setMarker();
    }

    plusPattern () {
        if (this.page_total == 8) { return; }
        this.pattern = this.pattern.concat([[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]);
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
        this.pos_markers.filter((i) => i  < this.page_total).addClass('marker-active');
        this.pos_markers.filter((i) => this.page_total <= i).removeClass('marker-active');
        this.pos_markers.removeClass('marker-now').eq(this.page).addClass('marker-now');
        this.markers.find('.marker-pos').text(this.page + 1);
        this.markers.find('.marker-total').text(this.page_total);
        this.pos_markers.filter((i) => i  < this.page_total).each((i) => {
            this.pos_markers.eq(i).on('mousedown', () => {
                const currentPage = this.page;
                if (currentPage < i) {
                    while (this.page != i) {
                        this.model.player.forward();
                    }
                }
                if (i < currentPage) {
                    while (this.page != i) {
                        this.model.player.backward(true);  // force
                    }
                }
            });
        });
    }

    play () {
        console.log('nothing to do in SamplerView.prototype.play');
    }

    stop () {
        for (let i = 0; i < this.cells_y; i++) {
            this.ctx_off.drawImage(this.cell,
                0, 26, 26, 26,
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
                    0, 26, 26, 26,
                    (this.time % this.cells_x) * 26, i * 26, 26, 26
                );
            }
        }
    }

    selectSample (sample_now) {
        this.sample_now = sample_now;
        this.keyboard.selectSample(this.sample_now);
        this.model.selectSample(this.sample_now);
    }

}

module.exports = SamplerView;
