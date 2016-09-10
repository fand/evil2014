const FX       = require('./FX');
const FuzzView = require('./FuzzView');

class Fuzz extends FX {

    constructor (ctx) {
        super(ctx);
        this.fuzz = ctx.createWaveShaper();
        this.in.connect(this.fuzz);
        this.fuzz.connect(this.out);
        this.in.gain.value  = 1.0;
        this.out.gain.value = 1.0;
        this.type = 'Sigmoid';
        this.samples = 2048;
        this.fuzz.curve = new Float32Array(this.samples);
        this.setGain(0.08);

        this.view = new FuzzView(this);
    }

    setType (type) {
        this.type = type;
    }

    setGain (gain) {
        this.gain = gain;
        const sigmax = 2.0 / (1 + Math.exp(-gain * 1.0)) - 1.0;
        const ratio = 1.0 / sigmax;

        if (this.type === 'Sigmoid') {
            for (let i = 0; i < this.samples; i++) {
                const x = i * 2.0 / this.samples - 1.0;
                const sigmoid = 2.0 / (1 + Math.exp(-Math.pow(this.gain, 3) * 1000 * x)) - 1.0;
                this.fuzz.curve[i] = sigmoid * ratio;
            }
        }
        else if (this.type === 'Octavia') {
            for (let i = 0; i < this.samples; i++) {
                const x = i * 2.0 / this.samples - 1.0;
                const sigmoid = 2.0 / (1 + Math.exp(-Math.pow(this.gain, 2) * 10 * x)) - 1.0;
                this.fuzz.curve[i] = Math.abs(sigmoid * ratio) * 2.0 - 1.0;
            }
        }
    }

    setParam (p) {
        if (p.type != null) { this.setType(p.type); }
        if (p.gain != null) { this.setGain(p.gain); }
        if (p.input != null) { this.setInput(p.input);  }
        if (p.output != null) { this.setOutput(p.output); }
        this.view.setParam(p);
    }

    getParam () {
        return {
            name   : 'Fuzz',
            type   : this.type,
            gain   : this.gain,
            input  : this.in.gain.value,
            output : this.out.gain.value,
        };
    }

}

module.exports = Fuzz;
