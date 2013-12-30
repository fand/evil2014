(function() {
  var OSC_TYPE;

  this.KEY_LIST = {
    A: 55,
    Bb: 58.27047018976124,
    B: 61.7354126570155,
    C: 32.70319566257483,
    Db: 34.64782887210901,
    D: 36.70809598967594,
    Eb: 38.890872965260115,
    E: 41.20344461410875,
    F: 43.653528929125486,
    Gb: 46.2493028389543,
    G: 48.999429497718666,
    Ab: 51.91308719749314
  };

  this.SCALE_LIST = {
    IONIAN: [0, 2, 4, 5, 7, 9, 11, 12, 14, 16],
    DORIAN: [0, 2, 3, 5, 7, 9, 10, 12, 14, 15],
    PHRYGIAN: [0, 1, 3, 5, 7, 8, 10, 12, 13, 15],
    LYDIAN: [0, 2, 4, 6, 7, 9, 11, 12, 14, 16],
    MIXOLYDIAN: [0, 2, 4, 5, 7, 9, 10, 12, 14, 16],
    AEOLIAN: [0, 2, 3, 5, 7, 8, 10, 12, 14, 15],
    LOCRIAN: [0, 1, 3, 5, 6, 8, 10, 12, 13, 15]
  };

  OSC_TYPE = {
    RECT: 1,
    SINE: 0,
    SAW: 2,
    TRIANGLE: 3
  };

  this.Noise = (function() {
    function Noise(ctx) {
      var _this = this;
      this.ctx = ctx;
      this.node = this.ctx.createScriptProcessor(STREAM_LENGTH);
      this.node.onaudioprocess = function(event) {
        var data_L, data_R, i, _i, _ref, _results;
        data_L = event.outputBuffer.getChannelData(0);
        data_R = event.outputBuffer.getChannelData(1);
        _results = [];
        for (i = _i = 0, _ref = data_L.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          _results.push(data_L[i] = data_R[i] = Math.random());
        }
        return _results;
      };
    }

    Noise.prototype.connect = function(dst) {
      return this.node.connect(dst);
    };

    Noise.prototype.setOctave = function(octae) {
      this.octae = octae;
    };

    Noise.prototype.setFine = function(fine) {
      this.fine = fine;
    };

    Noise.prototype.setNote = function() {};

    Noise.prototype.setInterval = function(interval) {
      this.interval = interval;
    };

    Noise.prototype.setFreq = function() {};

    Noise.prototype.setKey = function() {};

    Noise.prototype.setShape = function(shape) {
      this.shape = shape;
    };

    Noise.prototype.getParam = function() {
      return {
        shape: this.shape,
        octave: this.octave,
        interval: this.interval,
        fine: this.fine
      };
    };

    Noise.prototype.readParam = function(p) {
      this.shape = p.shape;
      this.octave = p.octave;
      this.interval = p.interval;
      return this.fine = p.fine;
    };

    return Noise;

  })();

  this.VCO = (function() {
    function VCO(ctx) {
      this.ctx = ctx;
      this.freq_key = 55;
      this.octave = 4;
      this.interval = 0;
      this.fine = 0;
      this.note = 0;
      this.freq = Math.pow(2, this.octave) * this.freq_key;
      this.node = this.ctx.createOscillator();
      this.node.type = 'sine';
      this.setFreq();
      this.node.start(0);
    }

    VCO.prototype.setOctave = function(octave) {
      this.octave = octave;
    };

    VCO.prototype.setFine = function(fine) {
      this.fine = fine;
      return this.node.detune.value = this.fine;
    };

    VCO.prototype.setNote = function(note) {
      this.note = note;
    };

    VCO.prototype.setKey = function(freq_key) {
      this.freq_key = freq_key;
    };

    VCO.prototype.setInterval = function(interval) {
      this.interval = interval;
    };

    VCO.prototype.setShape = function(shape) {
      this.shape = shape;
      return this.node.type = OSC_TYPE[shape];
    };

    VCO.prototype.setFreq = function() {
      this.freq = (Math.pow(2, this.octave) * Math.pow(SEMITONE, this.interval + this.note) * this.freq_key) + this.fine;
      return this.node.frequency.setValueAtTime(this.freq, 0);
    };

    VCO.prototype.connect = function(dst) {
      return this.node.connect(dst);
    };

    VCO.prototype.disconnect = function() {
      return this.node.disconnect();
    };

    VCO.prototype.getParam = function() {
      return {
        shape: this.shape,
        octave: this.octave,
        interval: this.interval,
        fine: this.fine
      };
    };

    VCO.prototype.readParam = function(p) {
      this.shape = p.shape;
      this.octave = p.octave;
      this.interval = p.interval;
      return this.fine = p.fine;
    };

    return VCO;

  })();

  this.EG = (function() {
    function EG(target, min, max) {
      this.target = target;
      this.min = min;
      this.max = max;
      this.attack = 0;
      this.decay = 0;
      this.sustain = 0.0;
      this.release = 0;
    }

    EG.prototype.getADSR = function() {
      return [this.attack, this.decay, this.sustain, this.release];
    };

    EG.prototype.setADSR = function(attack, decay, sustain, release) {
      this.attack = attack / 50000.0;
      this.decay = decay / 50000.0;
      this.sustain = sustain / 100.0;
      return this.release = release / 50000.0;
    };

    EG.prototype.readADSR = function(attack, decay, sustain, release) {
      this.attack = attack;
      this.decay = decay;
      this.sustain = sustain;
      this.release = release;
    };

    EG.prototype.getRange = function() {
      return [this.min, this.max];
    };

    EG.prototype.setRange = function(min, max) {
      this.min = min;
      this.max = max;
    };

    EG.prototype.readRange = function(min, max) {
      this.min = min;
      this.max = max;
    };

    EG.prototype.getParam = function() {
      return {
        adsr: this.getADSR(),
        range: this.getRange()
      };
    };

    EG.prototype.readParam = function(p) {
      this.readADSR(p.adsr[0], p.adsr[1], p.adsr[2], p.adsr[3]);
      return this.readRange(p.range[0], p.range[1]);
    };

    EG.prototype.noteOn = function(time) {
      this.target.cancelScheduledValues(time);
      this.target.setValueAtTime(this.min, time);
      this.target.linearRampToValueAtTime(this.max, time + this.attack);
      return this.target.linearRampToValueAtTime(this.sustain * (this.max - this.min) + this.min, time + this.attack + this.decay);
    };

    EG.prototype.noteOff = function(time) {
      this.target.linearRampToValueAtTime(this.min, time + this.release);
      return this.target.linearRampToValueAtTime(0, time + this.release + 1);
    };

    return EG;

  })();

  this.ResFilter = (function() {
    function ResFilter(ctx) {
      this.ctx = ctx;
      this.lpf = this.ctx.createBiquadFilter();
      this.lpf.type = 'lowpass';
      this.lpf.gain.value = 1.0;
    }

    ResFilter.prototype.connect = function(dst) {
      return this.lpf.connect(dst);
    };

    ResFilter.prototype.getResonance = function() {
      return this.lpf.Q.value;
    };

    ResFilter.prototype.setQ = function(Q) {
      return this.lpf.Q.value = Q;
    };

    ResFilter.prototype.readParam = function(p) {
      return this.lpf.Q.value = p[1];
    };

    ResFilter.prototype.getParam = function() {
      return this.lpf.Q.value;
    };

    return ResFilter;

  })();

  this.SynthCore = (function() {
    function SynthCore(parent, ctx, id) {
      var i, _i;
      this.parent = parent;
      this.ctx = ctx;
      this.id = id;
      this.node = this.ctx.createGain();
      this.node.gain.value = 0;
      this.gain = 1.0;
      this.is_mute = false;
      this.vcos = [new VCO(this.ctx), new VCO(this.ctx), new Noise(this.ctx)];
      this.gains = [this.ctx.createGain(), this.ctx.createGain(), this.ctx.createGain()];
      for (i = _i = 0; _i < 3; i = ++_i) {
        this.vcos[i].connect(this.gains[i]);
        this.gains[i].gain.value = 0;
        this.gains[i].connect(this.node);
      }
      this.filter = new ResFilter(this.ctx);
      this.eg = new EG(this.node.gain, 0.0, this.gain);
      this.feg = new EG(this.filter.lpf.frequency, 0, 0);
      this.gain_res = this.ctx.createGain();
      this.gain_res.gain.value = 0;
      this.vcos[2].connect(this.gain_res);
      this.gain_res.connect(this.node);
      this.view = new SynthCoreView(this, id, this.parent.view.dom.find('.synth-core'));
    }

    SynthCore.prototype.getParam = function() {
      var g, v;
      return {
        type: 'REZ',
        vcos: (function() {
          var _i, _len, _ref, _results;
          _ref = this.vcos;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            v = _ref[_i];
            _results.push(v.getParam());
          }
          return _results;
        }).call(this),
        gains: (function() {
          var _i, _len, _ref, _results;
          _ref = this.gains;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            g = _ref[_i];
            _results.push(g.gain.value);
          }
          return _results;
        }).call(this),
        eg: this.eg.getParam(),
        feg: this.feg.getParam(),
        filter: [this.feg.getRange()[1], this.filter.getParam()]
      };
    };

    SynthCore.prototype.readParam = function(p) {
      var i, _i, _j, _ref, _ref1;
      if (p.vcos != null) {
        for (i = _i = 0, _ref = p.vcos.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          this.vcos[i].readParam(p.vcos[i]);
        }
      }
      if (p.gains != null) {
        for (i = _j = 0, _ref1 = p.gains.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
          this.gains[i].gain.value = p.gains[i];
        }
      }
      if (p.eg != null) {
        this.eg.readParam(p.eg);
      }
      if (p.feg != null) {
        this.feg.readParam(p.feg);
      }
      if (p.filter != null) {
        this.filter.readParam(p.filter);
      }
      return this.view.readParam(p);
    };

    SynthCore.prototype.setVCOParam = function(i, shape, oct, interval, fine) {
      this.vcos[i].setShape(shape);
      this.vcos[i].setOctave(oct);
      this.vcos[i].setInterval(interval);
      this.vcos[i].setFine(fine);
      return this.vcos[i].setFreq();
    };

    SynthCore.prototype.setEGParam = function(a, d, s, r) {
      return this.eg.setADSR(a, d, s, r);
    };

    SynthCore.prototype.setFEGParam = function(a, d, s, r) {
      return this.feg.setADSR(a, d, s, r);
    };

    SynthCore.prototype.setFilterParam = function(freq, q) {
      this.feg.setRange(80, Math.pow(freq / 1000, 2.0) * 25000 + 80);
      this.filter.setQ(q);
      if (q > 1) {
        return this.gain_res.gain.value = 0.1 * (q / 1000.0);
      }
    };

    SynthCore.prototype.setVCOGain = function(i, gain) {
      return this.gains[i].gain.value = (gain / 100.0) * 0.3;
    };

    SynthCore.prototype.setGain = function(gain) {
      this.gain = gain;
      return this.eg.setRange(0.0, this.gain);
    };

    SynthCore.prototype.noteOn = function() {
      var t0;
      if (this.is_mute) {
        return;
      }
      t0 = this.ctx.currentTime;
      this.eg.noteOn(t0);
      return this.feg.noteOn(t0);
    };

    SynthCore.prototype.noteOff = function() {
      var t0;
      t0 = this.ctx.currentTime;
      this.eg.noteOff(t0);
      return this.feg.noteOff(t0);
    };

    SynthCore.prototype.setKey = function(key) {
      var freq_key, v, _i, _len, _ref, _results;
      freq_key = KEY_LIST[key];
      _ref = this.vcos;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        _results.push(v.setKey(freq_key));
      }
      return _results;
    };

    SynthCore.prototype.setScale = function(scale) {
      this.scale = scale;
    };

    SynthCore.prototype.connect = function(dst) {
      this.node.connect(this.filter.lpf);
      return this.filter.connect(dst);
    };

    SynthCore.prototype.disconnect = function() {
      this.filter.disconnect();
      return this.node.disconnect();
    };

    SynthCore.prototype.setNote = function(note) {
      var v, _i, _len, _ref, _results;
      _ref = this.vcos;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        v.setNote(note);
        _results.push(v.setFreq());
      }
      return _results;
    };

    SynthCore.prototype.mute = function() {
      return this.is_mute = true;
    };

    SynthCore.prototype.demute = function() {
      return this.is_mute = false;
    };

    return SynthCore;

  })();

  this.SynthCoreView = (function() {
    function SynthCoreView(model, id, dom) {
      this.model = model;
      this.id = id;
      this.dom = dom;
      this.vcos = $(this.dom.find('.RS_VCO'));
      this.EG_inputs = this.dom.find('.RS_EG input');
      this.FEG_inputs = this.dom.find('.RS_FEG input');
      this.filter_inputs = this.dom.find(".RS_filter input");
      this.gain_inputs = this.dom.find('.RS_mixer input');
      this.canvasEG = this.dom.find(".RS_EG .canvasEG").get()[0];
      this.canvasFEG = this.dom.find(".RS_FEG .canvasFEG").get()[0];
      this.contextEG = this.canvasEG.getContext('2d');
      this.contextFEG = this.canvasFEG.getContext('2d');
      this.initEvent();
    }

    SynthCoreView.prototype.initEvent = function() {
      var _this = this;
      this.vcos.on("change", function() {
        return _this.setVCOParam();
      });
      this.gain_inputs.on("change", function() {
        return _this.setGains();
      });
      this.filter_inputs.on("change", function() {
        return _this.setFilterParam();
      });
      this.EG_inputs.on("change", function() {
        return _this.setEGParam();
      });
      this.FEG_inputs.on("change", function() {
        return _this.setFEGParam();
      });
      return this.setParam();
    };

    SynthCoreView.prototype.updateCanvas = function(name) {
      var adsr, canvas, context, h, w, w4;
      canvas = null;
      context = null;
      adsr = null;
      if (name === "EG") {
        canvas = this.canvasEG;
        context = this.contextEG;
        adsr = this.model.eg.getADSR();
      } else {
        canvas = this.canvasFEG;
        context = this.contextFEG;
        adsr = this.model.feg.getADSR();
      }
      w = canvas.width = 180;
      h = canvas.height = 50;
      w4 = w / 4;
      context.clearRect(0, 0, w, h);
      context.beginPath();
      context.moveTo(w4 * (1.0 - adsr[0]), h);
      context.lineTo(w / 4, 0);
      context.lineTo(w4 * (adsr[1] + 1), h * (1.0 - adsr[2]));
      context.lineTo(w4 * 3, h * (1.0 - adsr[2]));
      context.lineTo(w4 * (adsr[3] + 3), h);
      context.strokeStyle = 'rgb(0, 220, 255)';
      return context.stroke();
    };

    SynthCoreView.prototype.setParam = function() {
      this.setVCOParam();
      this.setEGParam();
      this.setFEGParam();
      this.setFilterParam();
      return this.setGains();
    };

    SynthCoreView.prototype.setVCOParam = function() {
      var i, vco, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.vcos.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        vco = this.vcos.eq(i);
        _results.push(this.model.setVCOParam(i, vco.find('.shape').val(), parseInt(vco.find('.octave').val()), parseInt(vco.find('.interval').val()), parseInt(vco.find('.fine').val())));
      }
      return _results;
    };

    SynthCoreView.prototype.readVCOParam = function(p) {
      var i, vco, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.vcos.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        vco = this.vcos.eq(i);
        vco.find('.shape').val(p[i].shape);
        vco.find('.octave').val(p[i].octave);
        vco.find('.interval').val(p[i].interval);
        _results.push(vco.find('.fine').val(p[i].fine));
      }
      return _results;
    };

    SynthCoreView.prototype.setEGParam = function() {
      this.model.setEGParam(parseFloat(this.EG_inputs.eq(0).val()), parseFloat(this.EG_inputs.eq(1).val()), parseFloat(this.EG_inputs.eq(2).val()), parseFloat(this.EG_inputs.eq(3).val()));
      return this.updateCanvas("EG");
    };

    SynthCoreView.prototype.readEGParam = function(p) {
      this.EG_inputs.eq(0).val(p.adsr[0] * 50000);
      this.EG_inputs.eq(1).val(p.adsr[1] * 50000);
      this.EG_inputs.eq(2).val(p.adsr[2] * 100);
      return this.EG_inputs.eq(3).val(p.adsr[3] * 50000);
    };

    SynthCoreView.prototype.setFEGParam = function() {
      this.model.setFEGParam(parseFloat(this.FEG_inputs.eq(0).val()), parseFloat(this.FEG_inputs.eq(1).val()), parseFloat(this.FEG_inputs.eq(2).val()), parseFloat(this.FEG_inputs.eq(3).val()));
      return this.updateCanvas("FEG");
    };

    SynthCoreView.prototype.readFEGParam = function(p) {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = p.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.FEG_inputs.eq(i).val(p.adsr[i]));
      }
      return _results;
    };

    SynthCoreView.prototype.setFilterParam = function() {
      return this.model.setFilterParam(parseFloat(this.filter_inputs.eq(0).val()), parseFloat(this.filter_inputs.eq(1).val()));
    };

    SynthCoreView.prototype.readFilterParam = function(p) {
      this.filter_inputs.eq(0).val(p[0]);
      return this.filter_inputs.eq(1).val(p[1]);
    };

    SynthCoreView.prototype.setGains = function() {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.gain_inputs.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.model.setVCOGain(i, parseInt(this.gain_inputs.eq(i).val())));
      }
      return _results;
    };

    SynthCoreView.prototype.readParam = function(p) {
      var i, _i, _ref;
      if (p.vcos != null) {
        this.readVCOParam(p.vcos);
      }
      if (p.gains != null) {
        for (i = _i = 0, _ref = p.gains.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          this.gain_inputs.eq(i).val(p.gains[i] / 0.3 * 100);
        }
      }
      if (p.eg != null) {
        this.readEGParam(p.eg);
      }
      if (p.feg != null) {
        this.readFEGParam(p.feg);
      }
      if (p.filter != null) {
        return this.readFilterParam(p.filter);
      }
    };

    return SynthCoreView;

  })();

  this.Synth = (function() {
    function Synth(ctx, id, player, name) {
      this.ctx = ctx;
      this.id = id;
      this.player = player;
      this.name = name;
      if (this.name == null) {
        this.name = 'Synth #' + this.id;
      }
      this.pattern_name = 'pattern 0';
      this.pattern = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.pattern_obj = {
        name: this.pattern_name,
        pattern: this.pattern
      };
      this.time = 0;
      this.scale = [];
      this.view = new SynthView(this, this.id);
      this.core = new SynthCore(this, this.ctx, this.id);
      this.is_sustaining = false;
      this.session = this.player.session;
    }

    Synth.prototype.connect = function(dst) {
      return this.core.connect(dst);
    };

    Synth.prototype.disconnect = function() {};

    Synth.prototype.setDuration = function(duration) {
      this.duration = duration;
    };

    Synth.prototype.setKey = function(key) {
      return this.core.setKey(key);
    };

    Synth.prototype.setScale = function(scale_name) {
      return this.scale = SCALE_LIST[scale_name];
    };

    Synth.prototype.setNote = function(note) {
      return this.core.setNote(note);
    };

    Synth.prototype.setGain = function(gain) {
      return this.core.setGain(gain);
    };

    Synth.prototype.getGain = function() {
      return this.core.gain;
    };

    Synth.prototype.noteToSemitone = function(ival) {
      return Math.floor((ival - 1) / 7) * 12 + this.scale[(ival - 1) % 7];
    };

    Synth.prototype.noteOn = function(note) {
      this.core.setNote(this.noteToSemitone(note));
      return this.core.noteOn();
    };

    Synth.prototype.noteOff = function() {
      return this.core.noteOff();
    };

    Synth.prototype.playAt = function(time) {
      var mytime, n,
        _this = this;
      this.time = time;
      mytime = this.time % this.pattern.length;
      this.view.playAt(mytime);
      if (this.pattern[mytime] === 0) {
        return this.core.noteOff();
      } else if (this.pattern[mytime] === 'end') {
        return T.setTimeout((function() {
          return _this.core.noteOff();
        }), this.duration - 10);
      } else if (this.pattern[mytime] === 'sustain') {

      } else if (this.pattern[mytime] < 0) {
        this.is_sustaining = true;
        n = -this.pattern[mytime];
        this.core.setNote(this.noteToSemitone(n));
        return this.core.noteOn();
      } else {
        this.core.setNote(this.noteToSemitone(this.pattern[mytime]));
        this.core.noteOn();
        return T.setTimeout((function() {
          return _this.core.noteOff();
        }), this.duration - 10);
      }
    };

    Synth.prototype.play = function() {
      return this.view.play();
    };

    Synth.prototype.stop = function() {
      this.core.noteOff();
      return this.view.stop();
    };

    Synth.prototype.pause = function(time) {
      return this.core.noteOff();
    };

    Synth.prototype.readPattern = function(_pattern_obj) {
      this.pattern_obj = $.extend(true, {}, _pattern_obj);
      this.pattern = this.pattern_obj.pattern;
      this.pattern_name = this.pattern_obj.name;
      return this.view.readPattern(this.pattern_obj);
    };

    Synth.prototype.getPattern = function() {
      this.pattern_obj = {
        name: this.pattern_name,
        pattern: this.pattern
      };
      return $.extend(true, {}, this.pattern_obj);
    };

    Synth.prototype.clearPattern = function() {
      this.pattern = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.pattern_obj.pattern = this.pattern;
      return this.view.readPattern(this.pattern_obj);
    };

    Synth.prototype.plusPattern = function() {
      this.pattern = this.pattern.concat([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      return this.player.resetSceneLength();
    };

    Synth.prototype.minusPattern = function() {
      this.pattern = this.pattern.slice(0, this.pattern.length - 32);
      return this.player.resetSceneLength();
    };

    Synth.prototype.addNote = function(time, note) {
      return this.pattern[time] = note;
    };

    Synth.prototype.removeNote = function(time) {
      return this.pattern[time] = 0;
    };

    Synth.prototype.sustainNote = function(l, r, note) {
      var i, _i;
      if (l === r) {
        this.pattern[l] = note;
        return;
      }
      for (i = _i = l; l <= r ? _i < r : _i > r; i = l <= r ? ++_i : --_i) {
        this.pattern[i] = 'sustain';
      }
      this.pattern[l] = -note;
      return this.pattern[r] = 'end';
    };

    Synth.prototype.activate = function(i) {
      return this.view.activate(i);
    };

    Synth.prototype.inactivate = function(i) {
      return this.view.inactivate(i);
    };

    Synth.prototype.redraw = function(time) {
      this.time = time;
      return this.view.drawPattern(this.time);
    };

    Synth.prototype.setSynthName = function(name) {
      this.name = name;
      this.session.setSynthName(this.id, this.name);
      return this.view.setSynthName(this.name);
    };

    Synth.prototype.setPatternName = function(pattern_name) {
      this.pattern_name = pattern_name;
      return this.session.setPatternName(this.id, this.pattern_name);
    };

    Synth.prototype.readPatternName = function(pattern_name) {
      this.pattern_name = pattern_name;
      return this.view.setPatternName(this.pattern_name);
    };

    Synth.prototype.replaceWith = function(s_new) {
      return this.view.dom.replaceWith(s_new.view.dom);
    };

    Synth.prototype.getParam = function() {
      var p;
      p = this.core.getParam();
      p.name = this.name;
      return p;
    };

    Synth.prototype.readParam = function(p) {
      if (p != null) {
        return this.core.readParam(p);
      }
    };

    Synth.prototype.mute = function() {
      return this.core.mute();
    };

    Synth.prototype.demute = function() {
      return this.core.demute();
    };

    return Synth;

  })();

}).call(this);
