import PerlinNoise from "./perlin-noise";
import AmplitudeManager from "./amplitude-manager";
import Slither from "./slither";
import Particle from "./particle";

// Rename to SlitherManager
class SlitherManager {

    constructor(w, h) {
        this.width = w;
        this.height = h;
        this.amplitudeManager = new AmplitudeManager();

        this.idleSlithers = [];
        this.activeSlithers = [];
        let p = NaN;
        let perlin = new PerlinNoise();
        let r = perlin.getVertices();
        for (let i = 0; i < w; ++i) {
            let a = this.amplitudeManager.at(i);
            if ((p < 0 && a > 0) || (p > 0 && a < 0)) {
                perlin = new PerlinNoise();
                r = perlin.getVertices();
            }

            this.idleSlithers.push(new Slither(i, new PerlinNoise(a, 0.01, r), h));
        }
        Particle.loadImage();
    }

    draw(ctx) {
        if (this.idleSlithers.length > 0 && Math.random() > 0.8) {
            let s = this.idleSlithers.splice(Math.random() * this.idleSlithers.length, 1)[0];
            s.activate();
            this.activeSlithers.push(s);
        }
        for (let i = 0; i < this.activeSlithers.length; ++i) {
            if (!this.activeSlithers[i].draw(ctx)) {
                this.idleSlithers.push(this.activeSlithers.splice(i, 1)[0]);
            }
        }
    }

    static setup(w, h) {
        PerlinManager.perlin = new PerlinNoise(100, 0.01);

        PerlinManager.canvas = document.createElement("canvas");
        PerlinManager.canvas.width = 100;
        PerlinManager.canvas.height = h * 3;

        PerlinManager.fillCanvas();
    }

    static fillCanvas() {
        let c = PerlinManager.canvas.getContext("2d");
        c.fillStyle = "#FFFFFF";
        for (let y = 0; y < PerlinManager.canvas.height; y += 1) {
            c.beginPath();
            c.arc(PerlinManager.perlin.getNoise(y), y, 0.5, 0, 2 * Math.PI);
            c.fill();
        }
    }
}

export default SlitherManager;