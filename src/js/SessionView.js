const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const SocialButtons = require('./SocialButtons');
const Dialog = require('./Dialog');
const SessionComponent = require('./SessionComponent');

class SessionView {

    constructor (model, song) {
        this.model = model;
        this.song  = song;

        // DOMs for session view.
        this.wrapper_mixer      = $('#mixer-tracks');
        this.wrapper_master     = $('#session-master-wrapper');
        this.wrapper_tracks     = $('#session-tracks-wrapper');
        this.wrapper_tracks_sub = $('#session-tracks-wrapper-sub');

        this.canvas_tracks_dom       = $('#session-tracks');
        this.canvas_master_dom       = $('#session-master');
        this.canvas_tracks_on_dom    = $('#session-tracks-on');
        this.canvas_master_on_dom    = $('#session-master-on');
        this.canvas_tracks_hover_dom = $('#session-tracks-hover');
        this.canvas_master_hover_dom = $('#session-master-hover');

        this.canvas_tracks       = this.canvas_tracks_dom[0];
        this.canvas_master       = this.canvas_master_dom[0];
        this.canvas_tracks_on    = this.canvas_tracks_on_dom[0];
        this.canvas_master_on    = this.canvas_master_on_dom[0];
        this.canvas_tracks_hover = this.canvas_tracks_hover_dom[0];
        this.canvas_master_hover = this.canvas_master_hover_dom[0];

        this.ctx_tracks       = this.canvas_tracks.getContext('2d');
        this.ctx_master       = this.canvas_master.getContext('2d');
        this.ctx_tracks_on    = this.canvas_tracks_on.getContext('2d');
        this.ctx_master_on    = this.canvas_master_on.getContext('2d');
        this.ctx_tracks_hover = this.canvas_tracks_hover.getContext('2d');
        this.ctx_master_hover = this.canvas_master_hover.getContext('2d');

        // dimensions for cells in canvas
        this.w = 70;
        this.h = 20;
        this.w_master = 80;
        this.color = ['rgba(200, 200, 200, 1.0)', 'rgba(  0, 220, 250, 0.7)', 'rgba(100, 230, 255, 0.7)',
                  'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)', 'rgba(100, 230, 255, 0.2)'];
        this.color_schemes = {
            REZ: ['rgba(200, 200, 200, 1.0)', 'rgba(  0, 220, 250, 0.7)', 'rgba(100, 230, 255, 0.7)',
                  'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)', 'rgba(100, 230, 255, 0.2)',],
            SAMPLER: ['rgba(230, 230, 230, 1.0)', 'rgba(  255, 100, 192, 0.7)', 'rgba(255, 160, 216, 0.7)',
                      'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)', 'rgba(255, 160, 216, 0.2)'],
        };

        this.track_color = [0,1,2,3,4,5,6,7].map(i => this.color);

        this.img_play = new Image();
        this.img_play.src = 'static/img/play.png';
        this.img_play.onload = () => this.initCanvas();

        this.last_active   = [];
        this.current_cells = [];

        this.hover_pos  = { x : -1, y : -1 };
        this.click_pos  = { x : -1, y : -1 };
        this.select_pos = { x : 0, y  : 0, type: 'master' };
        this.last_clicked = performance.now();

        // DOMs to save songs.
        this.btn_save       = $('#btn-save');
        this.btn_clear      = $('#btn-clear');
        this.song_info      = $('#song-info');
        this.song_title     = this.song_info.find('#song-title');
        this.song_creator   = this.song_info.find('#song-creator');

        this.social = ReactDOM.render(<SocialButtons song={this.model.song}/>, document.querySelector('#social'));

        this.dialog = ReactDOM.render(<Dialog/>, document.querySelector('#dialog'));

        this.sessionTracks = ReactDOM.render(<SessionComponent model={this.model}/>, document.querySelector('#session-tracks-wrapper2'));

    }

    getCSRFToken () {
        return $('#ajax-form > input[name=csrf_token]').val();
    }

    initCanvas () {
        this.canvas_tracks.width  = this.canvas_tracks_on.width  = this.canvas_tracks_hover.width  = this.w*8 + 1;
        this.canvas_master.width  = this.canvas_master_on.width  = this.canvas_master_hover.width  = this.w + 11;
        this.canvas_tracks.height = this.canvas_tracks_on.height = this.canvas_tracks_hover.height = this.h*11 + 10;
        this.canvas_master.height = this.canvas_master_on.height = this.canvas_master_hover.height = this.h*11 + 10;

        this.offset_y = 20;
        this.ctx_tracks.translate(0, this.offset_y);
        this.ctx_master.translate(0, this.offset_y);
        this.ctx_tracks_on.translate(0, this.offset_y);
        this.ctx_master_on.translate(0, this.offset_y);
        this.ctx_tracks_hover.translate(0, this.offset_y);
        this.ctx_master_hover.translate(0, this.offset_y);

        this.font_size = 12;
        this.ctx_tracks.font = this.ctx_master.font = this.font_size + 'px "ＭＳ Ｐゴシック, ヒラギノ角ゴ Pro W3"';
        this.rect_tracks = this.canvas_tracks_hover.getBoundingClientRect();
        this.rect_master = this.canvas_master_hover.getBoundingClientRect();
        this.offset_translate = 700 + this.offset_y;

        this.initEvent();
    }

    resize () {
        this.ctx_tracks.translate(0, -this.offset_y);
        this.ctx_master.translate(0, -this.offset_y);
        this.ctx_tracks_on.translate(0, -this.offset_y);
        this.ctx_master_on.translate(0, -this.offset_y);
        this.ctx_tracks_hover.translate(0, -this.offset_y);
        this.ctx_master_hover.translate(0, -this.offset_y);

        const w_new = Math.max(this.song.tracks.length, 8) * this.w + 1;
        const h_new = Math.max(this.song.length + 2, 11) * this.h + 10;    // 0th cell is for track name!

        this.canvas_tracks.width  = this.canvas_tracks_on.width  = this.canvas_tracks_hover.width  = w_new;
        this.canvas_tracks.height = this.canvas_tracks_on.height = this.canvas_tracks_hover.height = h_new;
        this.canvas_master.height = this.canvas_master_on.height = this.canvas_master_hover.height = h_new;
        this.canvas_tracks_dom.css({ width: w_new, height: h_new });
        this.canvas_tracks_on_dom.css({width: w_new, height: h_new });
        this.canvas_tracks_hover_dom.css({width: w_new, height: h_new });
        this.canvas_master_dom.css({ height: h_new });
        this.canvas_master_on_dom.css({ height: h_new });
        this.canvas_master_hover_dom.css({height: h_new });

        this.wrapper_tracks.css({ width: w_new });
        this.wrapper_tracks_sub.css({ width: w_new });

        this.ctx_tracks.translate(0, this.offset_y);
        this.ctx_master.translate(0, this.offset_y);
        this.ctx_tracks_on.translate(0, this.offset_y);
        this.ctx_master_on.translate(0, this.offset_y);
        this.ctx_tracks_hover.translate(0, this.offset_y);
        this.ctx_master_hover.translate(0, this.offset_y);
    }

    // Get the cell under the mouse
    getPos (rect, wrapper, e, type) {
        const x = Math.floor((e.clientX - rect.left + this.wrapper_mixer.scrollLeft()) / this.w);
        const y = Math.floor((e.clientY - rect.top  + wrapper.scrollTop() - this.offset_translate) / this.h);
        return { x, y, type };
    }

    getPlayPos (rect, wrapper, e) {
        let x = Math.floor((e.clientX - rect.left + this.wrapper_mixer.scrollLeft()) / this.w);
        let y = Math.floor((e.clientY - rect.top  + wrapper.scrollTop() - this.offset_translate) / this.h);

        // inside canvas && not track name space
        if (! (
            ((e.clientX - rect.left + this.wrapper_mixer.scrollLeft()) - x * this.w < 20) &&
            ((e.clientY - rect.top + wrapper.scrollTop() - this.offset_translate) - y * this.h < 20)
        )) {
            y = -1;
        }

        return { x, y };
    }

    initEvent () {
        // Tracks canvas
        this.canvas_tracks_hover_dom.on('mousemove', (e) => {
            const pos = this.getPos(this.rect_tracks, this.wrapper_tracks_sub, e, 'tracks');
            if (this.is_clicked) {
                this.drawDrag(this.ctx_tracks_hover, pos);
            }
            else {
                this.drawHover(this.ctx_tracks_hover, pos);
            }
        })
        .on('mouseout', (e) => {
            this.clearHover(this.ctx_tracks_hover);
            this.hover_pos = { x:-1, y:-1 };
            this.is_clicked = false;
        })
        .on('mousedown', (e) => {
            const pos = this.getPlayPos(this.rect_tracks, this.wrapper_tracks_sub, e);
            if (pos.y >= 0) {
                this.cueTracks(pos.x, pos.y);
            }
            else {
                const pos2 = this.getPos(this.rect_tracks, this.wrapper_tracks_sub, e, 'tracks');
                const now = performance.now();

                if (now - this.last_clicked < 500 && pos2.y != -1) {
                    // Double clicked
                    this.editPattern(pos2);
                    this.last_clicked = -10000;  // prevent triple-click
                }
                else {
                    // Clicked
                    this.last_clicked = now;
                }

                this.is_clicked = true;
            }

            // for both cases
            this.click_pos = pos;

        })
        .on('mouseup', (e) => {
            const pos = this.getPos(this.rect_tracks, this.wrapper_tracks_sub, e, 'tracks');
            if (this.click_pos.x == pos.x && this.click_pos.y == pos.y) {
                this.selectCell(pos);
            }
            else if (this.click_pos.x != pos.x || this.click_pos.y != pos.y) {
                this.copyCell(this.click_pos, pos);
            }

            this.is_clicked = false;
        });

        // Master canvas
        this.canvas_master_hover_dom.on('mousemove', (e) => {
            const pos = this.getPos(this.rect_master, this.wrapper_master, e, 'master');

            if (this.is_clicked) {
                this.drawDragMaster(this.ctx_master_hover, pos);
            }
            else {
                this.drawHover(this.ctx_master_hover, pos);
            }
        })
        .on('mouseout', (e) => {
            this.clearHover(this.ctx_master_hover);
            this.hover_pos = { x:-1, y:-1 };
            this.is_clicked = false;
        })
        .on('mousedown', (e) => {
            let pos = this.getPlayPos(this.rect_master, this.wrapper_master, e);
            if (pos.y >= 0) {
                this.cueMaster(pos.x, pos.y)
            }
            else {
                pos = this.getPos(this.rect_master, this.wrapper_master, e, 'master')
                this.is_clicked = true;
            }

            // for both cases
            this.click_pos = pos;
        })
        .on('mouseup', (e) => {
            const pos = this.getPos(this.rect_master, this.wrapper_master, e, 'master');
            if (this.click_pos.x == pos.x && this.click_pos.y == pos.y) {
                this.selectCellMaster(pos);
            }
            else if (this.click_pos.x != pos.x || this.click_pos.y != pos.y) {
                this.copyCellMaster(this.click_pos, pos);
            }

            this.is_clicked = false;
        });

        this.wrapper_master.on('scroll', (e) => this.wrapper_tracks_sub.scrollTop(this.wrapper_master.scrollTop()));
        this.wrapper_tracks_sub.on('scroll', (e) => this.wrapper_master.scrollTop(this.wrapper_tracks_sub.scrollTop()));

        // for Other view
        this.btn_save.on('click', () => this.model.saveSong());

        this.song_title
            .on('focus', () => window.keyboard.beginInput())
            .on('change', () => this.setSongTitle())
            .on('blur', () => window.keyboard.endInput());

        this.song_creator
            .on('focus', () => window.keyboard.beginInput())
            .on('change', () => this.setCreatorName())
            .on('blur', () => window.keyboard.endInput());

        this.readSong(this.song, this.current_cells);
    }

    // Set params for this.song (ref to this.model.song).
    setSongTitle () {
        this.song.title = this.song_title.val()
    }

    setCreatorName () {
        this.song.creator = this.song_creator.val();
    }

    // Read song from this.song.
    readSong (song, current_cells) {
        this.song          = song;
        this.current_cells = current_cells;
        this.resize();

        this.sessionTracks.setState({ song });

        // Draw tracks
        for (let x = 0; x < Math.max(this.song.tracks.length + 1, 8); x++) {
            const t = this.song.tracks[x];
            if (t != null) {
                if (t.type != null) {
                    this.track_color[x] = this.color_schemes[t.type];
                }
                if (t.name != null) {
                    this.drawTrackName(x, t.name);
                }
            }
            for (let y = 0; y < Math.max(this.song.length + 1, 10); y++) {
                if (t != null && t.patterns[y] != null) {
                    this.drawCellTracks(t.patterns[y], x, y);
                }
                else {
                    this.drawEmpty(this.ctx_tracks, x, y, !!t);
                }
            }
        }

        // Draw master
        this.drawMasterName();

        for (let y = 0; y < Math.max(this.song.length + 1, 10); y++) {
            if (this.song.master[y] != null) {
                this.drawCellMaster(this.song.master[y], 0, y);
            }
            else {
                this.drawEmptyMaster(y);
            }
        }

        // this.drawScene(this.scene_pos, this.current_cells);

        this.selectCellMaster(this.select_pos);

        // set Global info
        this.song_title.val(this.song.title);
        this.song_creator.val(this.song.creator);
    }

    drawCellTracks (p, x, y) {
        // this.clearCell(this.ctx_tracks, x, y);

        if (this.track_color[x] == null) {
            this.track_color[x] = this.color_schemes[this.song.tracks[x].type];
        }
        //
        // this.ctx_tracks.strokeStyle = this.track_color[x][1];
        // this.ctx_tracks.lineWidth = 1;
        // this.ctx_tracks.strokeRect(x * this.w + 2, y * this.h + 2, this.w-2, this.h-2);
        // this.ctx_tracks.drawImage(this.img_play, 0, 0, 18, 18,  x*this.w + 3, y*this.h + 3, 16, 15);
        //
        // this.ctx_tracks.fillStyle = this.track_color[x][1];
        // this.ctx_tracks.fillText(p.name, x * this.w + 24, (y + 1) * this.h - 6);
    }

    drawCellMaster (p, x, y) {
        // this.clearCell(this.ctx_master, x, y);
        //
        // this.ctx_master.strokeStyle = this.color[1];
        // this.ctx_master.lineWidth = 1;
        // this.ctx_master.strokeRect(2, y * this.h + 2, this.w_master-2, this.h-2);
        // this.ctx_master.drawImage(this.img_play, 0, 0, 18, 18, 3, y*this.h + 3, 16, 15);
        //
        // this.ctx_master.fillStyle = this.color[1];
        // this.ctx_master.fillText(p.name, 24, (y + 1) * this.h - 6);
    }

    drawEmpty (ctx, x, y, drawStop) {
        // this.clearCell(ctx, x, y);
        // const x0 = x * this.w + 2;
        // const y0 = y * this.h + 2;
        // ctx.strokeStyle = this.color[0];
        // ctx.lineWidth = 1;
        // ctx.strokeRect(x0, y0, this.w-2, this.h-2);
        //
        // if (!drawStop) { return; }
        //
        // ctx.strokeStyle = '#bbb';
        // ctx.fillStyle   = '#eee';
        // ctx.strokeRect(x0 + 5, y0 + 5, 8, 8);
        // ctx.fillRect(x0 + 5, y0 + 5, 8, 8);
    }

    drawEmptyMaster (y) {
        // this.clearCell(this.ctx_master, 0, y);
        // this.ctx_master.strokeStyle = this.color[0];
        // this.ctx_master.lineWidth = 1;
        // this.ctx_master.strokeRect(2, y * this.h + 2, this.w_master - 2, this.h - 2);
        // this.ctx_master.drawImage(this.img_play, 0, 0, 18, 18, 3, y * this.h + 3, 16, 15);
    }

    clearCell (ctx, x, y) {
        // if (ctx === this.ctx_master) {
        //     ctx.clearRect(0, y * this.h, this.w_master, this.h);
        // }
        // else {
        //     ctx.clearRect(x * this.w, y * this.h, this.w, this.h);
        // }
    }

    drawMasterName () {
        // const m = this.ctx_master.measureText('MASTER');
        // const dx = (this.w - m.width)  / 2;
        // const dy = (this.offset_y - this.font_size) / 2;
        //
        // this.ctx_master.fillStyle   = '#ccc';
        // this.ctx_master.fillText('MASTER', dx + 2, -dy - 3);
    }

    drawTrackName (x, name, type) {
        if (type != null) {
            this.track_color[x] = this.color_schemes[type];
        }

        // this.ctx_tracks.fillStyle = this.track_color[x][1];
        // this.ctx_tracks.fillRect(x * this.w + 2, -20, this.w - 2, 18);
        //
        // const m = this.ctx_tracks.measureText(name);
        // const dx = (this.w - m.width)  / 2;
        // const dy = (this.offset_y - this.font_size) / 2;

        // this.ctx_tracks.shadowColor = '#fff';
        // this.ctx_tracks.shadowBlur  = 1;
        // this.ctx_tracks.fillStyle   = '#fff';
        // this.ctx_tracks.fillText(name, x * this.w + dx + 2, -dy - 3);
        // this.ctx_tracks.shadowBlur  = 0;
    }

    drawPatternName (x, y, p) {
        // this.drawCellTracks(p, x, y);
    }

    drawSceneName () {
        // TBD
    }

    drawScene (pos, cells) {
        // this.ctx_tracks_on.clearRect(0, this.scene_pos * this.h, this.w * 8, this.h);
        // this.ctx_master_on.clearRect(0, this.scene_pos * this.h, this.w, this.h);

        if (cells != null) {
            this.current_cells = cells;
        }

        // this.current_cells.forEach((c, i) => {
        //     if (c != null) {
        //         this.drawActive(i, c);
        //     }
        //     else {
        //         this.clearActive(i);
        //     }
        // });

        // this.drawActiveMaster(pos);
        this.scene_pos = pos;

        if (this.select_pos.type === 'tracks') {
            this.selectCell(this.select_pos);
        }
        else if (this.select_pos.type === 'master') {
            this.selectCellMaster(this.select_pos);
        }
    }

    drawActive (x, y) {
        // this.clearActive(x);
        // this.ctx_tracks_on.drawImage(this.img_play, 36, 0, 18, 18,  x * this.w + 3, y * this.h + 3, 16, 15);
        this.last_active[x] = y;
    }

    drawActiveMaster (y) {
        // this.ctx_master_on.clearRect(0, 0, this.w_master, 10000);
        // this.ctx_master_on.drawImage(this.img_play, 36, 0, 18, 18,  3, y * this.h + 3, 16, 15);
    }

    drawDrag (ctx, pos) {
        this.clearHover(ctx);

        // this.click_pos is NOT empty
        if (this.song.tracks[this.click_pos.x] == null) { return; }
        if (this.song.tracks[this.click_pos.x].patterns == null) { return; }
        if (this.song.tracks[this.click_pos.x].patterns[this.click_pos.y] == null) { return; }
        const name = this.song.tracks[this.click_pos.x].patterns[this.click_pos.y].name;

        if (pos.y >= Math.max(this.song.length, 10) || pos.y < 0) { return; }

        if (this.track_color[pos.x] == null) {
            this.track_color[pos.x] = this.color_schemes[this.song.tracks[pos.x].type];
        }

        // ctx.fillStyle = 'rgba(255,255,255,1.0)';
        // ctx.fillRect(pos.x * this.w, pos.y * this.h, this.w + 2, this.h + 2);
        //
        // ctx.strokeStyle = this.track_color[pos.x][1];
        // ctx.fillStyle = this.track_color[pos.x][1];
        //
        // ctx.lineWidth = 1;
        // ctx.strokeRect(pos.x * this.w + 2, pos.y * this.h + 2, this.w-2, this.h-2);
        // ctx.fillText(name, pos.x * this.w + 24, (pos.y + 1) * this.h - 6);
        //
        // ctx.fillStyle = 'rgba(255,255,255,0.7)';
        // ctx.fillRect(pos.x * this.w, pos.y * this.h, this.w + 2, this.h + 2);

        this.hover_pos = pos;
    }

    drawDragMaster (ctx, pos) {
        this.clearHover(ctx);

        // this.click_pos is NOT empty
        if (this.song.master[this.click_pos.y] == null) { return; }
        const name = this.song.master[this.click_pos.y].name;

        if (pos.y >= Math.max(this.song.length, 10)) { return; }

        // ctx.strokeStyle = this.color[1];
        // ctx.fillStyle   = this.color[1];
        //
        // ctx.lineWidth = 1;
        // ctx.strokeRect(2, pos.y * this.h + 2, this.w_master-2, this.h-2);
        // ctx.fillText(name, 24, (pos.y + 1) * this.h - 6);
        //
        // ctx.fillStyle = 'rgba(255,255,255,0.7)';
        // ctx.fillRect(0, pos.y * this.h, this.w_master, this.h);

        this.hover_pos = pos;
    }

    drawHover (ctx, pos) {
        this.clearHover(ctx);
        // ctx.fillStyle = 'rgba(255,255,255,0.6)';
        // if (ctx == this.ctx_master_hover) {
        //     ctx.fillRect(pos.x * this.w, pos.y * this.h, this.w_master, this.h);
        // }
        // else {
        //     ctx.fillRect(pos.x * this.w, pos.y * this.h, this.w, this.h);
        // }
        this.hover_pos = pos;
    }

    clearHover (ctx) {
        if (ctx == this.ctx_tracks_hover) {
            // for tracks
            // Don't know why '+2' is needed .... but it's needed!!!
            // ctx.clearRect(this.hover_pos.x * this.w, this.hover_pos.y * this.h, this.w + 2, this.h + 2);
            if (this.hover_pos.x == this.select_pos.x && this.hover_pos.y === this.select_pos.y && this.hover_pos.type === this.select_pos.type) {
                this.selectCell(this.select_pos);
            }
        }
        else {
            // for master
            // ctx.clearRect(0, this.hover_pos.y * this.h, this.w_master + 2, this.h + 2);
            if (this.hover_pos.x === this.select_pos.x && this.hover_pos.y === this.select_pos.y && this.hover_pos.type === this.select_pos.type) {
                this.selectCellMaster(this.select_pos);
            }
        }
    }

    clearActive (x) {
        // this.ctx_tracks_on.clearRect(x * this.w, this.last_active[x] * this.h, this.w, this.h);
    }

    clearAllActive () {
        // this.ctx_tracks_on.clearRect(0, 0, 10000, 10000);
        // this.ctx_master_on.clearRect(0, 0, 10000, 10000);
    }

    // Cue the cells to play
    cueTracks (x, y) {
        if (this.song.tracks[x] == null) { return; }
        if (this.song.tracks[x].patterns[y] != null) {
            this.model.cuePattern(x, y);
            // this.ctx_tracks_on.drawImage(this.img_play, 36, 0, 18, 18, x * this.w + 4, y * this.h + 4, 15, 16);
            // window.setTimeout(() => this.ctx_tracks_on.clearRect(x * this.w + 4, y * this.h + 4, 15, 16), 100);
        }
        else {
            this.model.cueOff(x);
        }
    }

    cueMaster (x, y) {
        if (this.song.master[y] != null) {
            this.model.cueScene(y)
            // this.ctx_master_on.drawImage(this.img_play, 36, 0, 18, 18,  4, y * this.h + 4, 15, 16);
            // window.setTimeout(() => this.ctx_master_on.clearRect(4, y * this.h + 4, 15, 16), 100);
        }
    }

    // Light the play buttons on beat.
    beat (is_master, cells) {
        // if (is_master) {
        //     const c = cells;
        //     this.ctx_master_on.drawImage(this.img_play, 36, 0, 18, 18, c[0] * this.w + 3, c[1] * this.h + 3, 16, 15);
        //     window.setTimeout(() => this.ctx_master_on.clearRect(c[0] * this.w + 3, c[1] * this.h + 3, 16, 15), 100);
        // }
        // else {
        //     cells.forEach((c) => {
        //         this.ctx_tracks_on.drawImage(this.img_play, 36, 0, 18, 18, c[0] * this.w + 3, c[1] * this.h + 3, 16, 15);
        //         window.setTimeout(() => this.ctx_tracks_on.clearRect(c[0] * this.w + 3, c[1] * this.h + 3, 16, 15), 100);
        //     });
        // }
    }

    editPattern (pos) {
        const pat = this.model.editPattern(pos.x, pos.y);
        this.drawCellTracks(pat[2], pat[0], pat[1]);
    }

    addSynth (song) {
        this.song = song;
        this.readSong(this.song, this.current_cells);
    }

    /**
     * Called by Session.
     */
    showSuccess (_url, songTitle, userName) {
        const songUrl = `http://evil.gmork.in/${_url}`;
        this.dialog.setState({
            isVisible : true,
            isSuccess : true,
            userName  : userName,
            songTitle : songTitle,
            songUrl   : songUrl,
        });
    }

    /**
     * Called by Session.
     */
    showError () {
        this.dialog.setState({
            isVisible : true,
            isSuccess : false,
        });
    }

    changeSynth (song) {
        this.song = song;
        this.readSong(this.song, this.current_cells);
    }

    // Copy cells by drag.
    copyCell (src, dst) {
        if (this.song.tracks[src.x] == null || this.song.tracks[src.x].patterns[src.y] == null) {
            return;
        }

        this.model.savePattern(src.x, src.y);

        // addSynth when tracks[dst.x] is empty.
        if (this.song.tracks[dst.x] == null) {
            dst.x = this.model.readTrack(this.song, src, dst);
            this.current_cells.length = dst.x + 1;
            this.song.tracks[dst.x].type = this.song.tracks[src.x].type;
        }

        if (this.song.tracks[src.x].type !== this.song.tracks[dst.x].type) { return; }

        // Deep copy the pattern
        this.song.tracks[dst.x].patterns[dst.y] = $.extend(true, {}, this.song.tracks[src.x].patterns[src.y]);
        // this.drawCellTracks(this.song.tracks[dst.x].patterns[dst.y], dst.x, dst.y);

        this.model.readPattern(this.song.tracks[dst.x].patterns[dst.y], dst.x, dst.y);
        // this.drawCellMaster(this.song.master[dst.y], 0, dst.y);
    }

    copyCellMaster (src, dst) {
        if (this.song.master[src.y] == null) { return; }

        // TODO: save particular master
        // this.model.saveMaster(src.y)

        // Deep copy the pattern
        this.song.master[dst.y] = $.extend(true, {}, this.song.master[src.y]);
        this.drawCellMaster(this.song.master[dst.x], 0, dst.y);

        // save this.song.master to this.session.song.master
        this.model.readMaster(this.song.master[dst.y], dst.y);
    }

    // Select cell on click.
    selectCell (pos) {
        if (this.song.tracks[pos.x] == null || this.song.tracks[pos.x].patterns[pos.y] == null) {
            return;
        }

        // this.ctx_master_hover.clearRect(this.select_pos.x * this.w, this.select_pos.y * this.h, this.w_master, this.h);
        //
        // this.ctx_tracks_hover.clearRect(this.hover_pos.x * this.w, this.hover_pos.y * this.h, this.w, this.h);
        // this.ctx_tracks_hover.clearRect(this.click_pos.x * this.w, this.click_pos.y * this.h, this.w, this.h);
        // this.ctx_tracks_hover.clearRect(this.select_pos.x * this.w, this.select_pos.y * this.h, this.w, this.h);

        if (this.track_color[pos.x] == null) {
            this.track_color[pos.x] = this.color_schemes[this.song.tracks[pos.x].type];
        }

        // this.ctx_tracks_hover.fillStyle = this.track_color[pos.x][5];
        // this.ctx_tracks_hover.fillRect(pos.x * this.w + 2, pos.y * this.h + 2, this.w - 2, this.h - 2);
        //
        // this.ctx_tracks_hover.fillStyle = this.track_color[pos.x][1];
        // this.ctx_tracks_hover.fillText(this.song.tracks[pos.x].patterns[pos.y].name, pos.x * this.w + 24, (pos.y + 1) * this.h - 6);

        this.select_pos = pos;
        this.select_pos.type = 'tracks';

        this.model.player.sidebar.show(this.song, this.select_pos);
    }

    selectCellMaster (pos) {
        if (this.song.master[pos.y] == null) { return; }

        // this.ctx_tracks_hover.clearRect(this.select_pos.x * this.w, this.select_pos.y * this.h, this.w, this.h);
        //
        // this.ctx_master_hover.clearRect(0, this.hover_pos.y * this.h, this.w_master, this.h);
        // this.ctx_master_hover.clearRect(0, this.click_pos.y * this.h, this.w_master, this.h);
        // this.ctx_master_hover.clearRect(0, this.select_pos.y * this.h, this.w_master, this.h);
        //
        // this.ctx_master_hover.fillStyle = this.color[5];
        // this.ctx_master_hover.fillRect(2, pos.y * this.h + 2, this.w_master - 2, this.h - 2);
        //
        // this.ctx_master_hover.fillStyle = this.color[1];
        // this.ctx_master_hover.fillText(this.song.master[pos.y].name, pos.x * this.w_master + 24, (pos.y + 1) * this.h - 6);

        this.select_pos = pos;
        this.select_pos.type = 'master';

        this.model.player.sidebar.show(this.song, this.select_pos);
    }

    getSelectPos () {
        if (this.select_pos.x !== -1 && this.select_pos.y !== -1) {
            return this.select_pos;
        }
        return null;
    }

}

module.exports = SessionView;
