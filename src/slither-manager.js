import PerlinNoise from "./perlin-noise";
import AmplitudeManager from "./amplitude-manager";
import Slither from "./slither";

/**
 * @class
 */
class SlitherManager {

    /**
     * 
     * @param { number } w - The width of the screen
     * @param { number } h - The height of the screen
     * @param {*} app 
     */
    constructor(w, h, app) {

        /**
         * The width of the screen
         * @type { number }
         */
        this.width = w;

        /**
         * The height of the screen
         * @type { number }
         */
        this.height = h;

        /**
         * The generator for the varying amplitudes of the slithers
         * @type { AmplitudeManager }
         */
        this.amplitudeManager = new AmplitudeManager();

        this.renderTexture = PIXI.RenderTexture.create(1000, 1000);
        let sprite = new PIXI.Sprite(this.renderTexture);
        this.app = app;

        this.app.stage.addChild(sprite);

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

            this.idleSlithers.push(new Slither(i, new PerlinNoise(a, 0.01, r), h, app, this.app.renderer, this.renderTexture));
        }

        console.log(this.app.stage.children[0]);

        app.ticker.add(() => this.draw());
    }

    draw() {

        //this.app.stage.children[0].texture = new PIXI.Texture.from(this.renderTexture);

        for (let i = 0; i < Math.random() * 5; i++) {
            if (this.idleSlithers.length > 0) {
                let s = this.idleSlithers.splice(Math.random() * this.idleSlithers.length, 1)[0];
                s.activate();
                this.activeSlithers.push(s);
            }
        }
        for (let i = 0; i < this.activeSlithers.length; ++i) {
            if (!this.activeSlithers[i].isActive()) {
                this.idleSlithers.push(this.activeSlithers.splice(i--, 1)[0]);
            }
        }
    }
}

export default SlitherManager;