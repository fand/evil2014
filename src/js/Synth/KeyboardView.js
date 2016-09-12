class KeyboardView {

    constructor (sequencer) {
        this.sequencer = sequencer;

        this.dom    = this.sequencer.dom.find('.keyboard');
        this.canvas = this.dom[0];
        this.ctx    = this.canvas.getContext('2d');

        this.w   = 48;
        this.h   = 26;
        this.num = 20;
        this.color = [
            'rgba(230, 230, 230, 1.0)',
            'rgba(  0, 220, 250, 0.7)',
            'rgba(100, 230, 255, 0.7)',
            'rgba(200, 200, 200, 1.0)',
            'rgba(255, 255, 255, 1.0)',
        ];
        this.is_clicked = false;
        this.hover_pos = { x: -1, y: -1 };
        this.click_pos = { x: -1, y: -1 };

        this.scale = this.sequencer.model.scale;

        this.initCanvas();
        this.initEvent();
    }

    initCanvas () {
        this.canvas.width  = this.w;
        this.canvas.height = this.h * this.num;
        this.rect          = this.canvas.getBoundingClientRect();
        this.offset = {
            x : this.rect.left,
            y : this.rect.top,
        };

        this.ctx.fillStyle = this.color[0];
        for (let i = 0; i < this.num; i++) {
            this.drawNormal(i);
        }
    }

    getPos (e) {
        this.rect = this.canvas.getBoundingClientRect();
        return Math.floor((e.clientY - this.rect.top) / this.h);
    }

    initEvent () {
        this.dom.on('mousemove', (e) => {
            const pos = this.getPos(e);

            if (pos !== this.hover_pos) {
                this.drawNormal(this.hover_pos);
                this.drawHover(pos);
                this.hover_pos = pos;
            }

            if (this.is_clicked && this.click_pos !== pos) {
                this.clearActive(this.click_pos);
                this.drawActive(pos);
                this.sequencer.model.noteOff(true);
                this.sequencer.model.noteOn(this.num - pos, true);
                this.click_pos = pos;
            }
        })
        .on('mousedown', (e) => {
            this.is_clicked = true;
            const pos = this.getPos(e);
            this.drawActive(pos);
            this.sequencer.model.noteOn(this.num - pos, true);
            this.click_pos = pos;
        })
        .on('mouseup', (e) => {
            this.is_clicked = false;
            this.clearActive(this.click_pos);
            this.sequencer.model.noteOff(true);
            this.click_pos = { x: -1, y: -1 };
        }).on('mouseout', (e) => {
            this.clearActive(this.hover_pos);
            this.sequencer.model.noteOff(true);
            this.hover_pos = { x: -1, y: -1 };
            this.click_pos = { x: -1, y: -1 };
        });
    }

    drawNormal (i) {
        this.clearNormal(i);
        this.ctx.fillStyle = this.color[0];
        if (this.isKey(i)) {
            this.ctx.fillRect(0, (i+1) * this.h - 5, this.w, 2);
        }
        this.ctx.fillRect(0, (i+1) * this.h - 3, this.w, 2);
        this.ctx.fillStyle = this.color[3];
        this.ctx.fillText(this.text(i), 10, (i+1) * this.h - 10);
    }

    drawHover (i) {
        this.ctx.fillStyle = this.color[1];
        this.ctx.fillRect(0, (i+1) * this.h - 3, this.w, 2);
        if (this.isKey(i)) {
            this.ctx.fillRect(0, (i+1) * this.h - 5, this.w, 2)
        }
        this.ctx.fillText(this.text(i), 10, (i+1) * this.h - 10);
    }

    drawActive (i) {
        this.clearNormal(i);
        this.ctx.fillStyle = this.color[2];
        this.ctx.fillRect(0, i * this.h, this.w, this.h);
        this.ctx.fillStyle = this.color[4];
        this.ctx.fillText(this.text(i), 10, (i+1) * this.h - 10);
    }

    clearNormal (i) {
        this.ctx.clearRect(0, i * this.h, this.w, this.h);
    }

    clearActive (i) {
        this.clearNormal(i);
        this.drawNormal(i);
    }

    changeScale (scale) {
        this.scale = scale;
        for (let i = 0; i < this.num; i++) {
            this.drawNormal(i);
        }
    }

    text (i) {
        const num = (this.num - i - 1) % this.scale.length + 1;
        return `${num}th`;
    }

    isKey (i) {
        return (this.num - i - 1) % this.scale.length === 0;
    }

}

module.exports = KeyboardView;
