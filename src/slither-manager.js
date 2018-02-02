import PerlinNoise from "./perlin-noise";
import AmplitudeManager from "./amplitude-manager";
import Slither from "./slither";
import Particle from "./particle";

// Rename to SlitherManager
class SlitherManager {

    constructor(w, h, app) {
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

            this.idleSlithers.push(new Slither(i, new PerlinNoise(a, 0.01, r), h, app));
        }
        app.ticker.add(() => this.draw());
        console.log(app.screen);
    }

    draw() {
        if (this.idleSlithers.length > 0 && Math.random() > -0.2/* && this.activeSlithers.length == 0*/) {
            let s = this.idleSlithers.splice(Math.random() * this.idleSlithers.length, 1)[0];
            s.activate();
            this.activeSlithers.push(s);
        }
        for (let i = 0; i < this.activeSlithers.length; ++i) {
            if (!this.activeSlithers[i].isActive()) {
                this.idleSlithers.push(this.activeSlithers.splice(i--, 1)[0]);
            }
        }
    }
}

export default SlitherManager;