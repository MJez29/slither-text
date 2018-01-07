import PerlinNoise from "./perlin-noise";
import AmplitudeManager from "./amplitude-manager";
import slitherLine from "./slither-line";

// Rename to SlitherManager
class PerlinManager {

    constructor(w, h) {
        this.width = w;
        this.height = h;
        this.amplitudeManager = new AmplitudeManager();

        this.slithers = [];
        let p = NaN;
        let perlin = new PerlinNoise();
        let r = perlin.getVertices();
        for (let i = 0; i < w; ++i) {
            let a = this.amplitudeManager.get(i);
            if ((p < 0 && a > 0) || (p > 0 && a < 0)) {
                perlin = new PerlinNoise();
                r = perlin.getVertices();
            }

            this.slithers.push(new Slither(new PerlinNoise(a, 0.01, r), h));
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

export default PerlinManager;