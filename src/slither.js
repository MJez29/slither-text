import PerlinNoise from "./perlin-noise";
let PIXI = require("./pixi.min.js");

/**
 * @class
 * @todo Re-implement Slither as a derived class from PIXI.mesh.Rope
 */
class Slither {

    /**
     * Returns the amount of pixels between adjacent nodes in a slither
     * 
     * @static
     * 
     * @returns { number }
     */
    static get DISTANCE_BETWEEN_NODES() {
        return 5;
    }

    /**
     * Returns the length of a slither in px
     * 
     * @static
     * 
     * @returns { number }
     */
    static get LENGTH() {
        return 600;
    }

    /**
     * Returns the image for the line
     * 
     * @static
     * 
     * @returns { string }
     */
    static get IMG() {
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAACCAYAAACE7KJkAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gEOBwwZh3a/4wAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAA2UlEQVRYw+1Wyw7DMAgzU7P//+HFu/QQIZ7T1BOWotKEgHGaMQEAkm8AF4AFQNtLjXNdz0dzVyH2anBYhs9gMBgMngXvsQt2dz2KCcfPi7uPuWjvr++aE5s5rL0d7c7aPkaNSHjsAp8Od10HCmff0ZZ3nfzT+XU0KO17HZdE7qFtKBvGmhiXTtTlk+NpxRMnLp28dLgNBoPB4Pk/Wfr3HkEPyfpF5APVqzp9oNKvrD6Tccs4SFFDFvhKYnv6d2rpaCjq/CN/JvVLkJNO/4/0ofOdVvJLQyPzTL4oE9sZ2ipqfgAAAABJRU5ErkJggg==";
    }

    /**
     * Creates a new slither object
     * 
     * @constructor
     * 
     * @param { number }            x       - The vertical axis of the slither
     * @param { PerlinNoise }       p       - The perlin noise generator to use
     * @param { number }            h       - The height of the physical screen
     * @param { PIXI.Application }  app     - The running PIXI app instance
     * 
     */
    constructor(x, p, h, app, r, rt) {
        this.perlin = p;
        this.height = h;
        this.points = [];
        this.x = x;
        this.amplitude = this.perlin.getAmplitude() / 2.0;
        for (let i = 0; i < Slither.LENGTH; i += Slither.DISTANCE_BETWEEN_NODES) {
            this.points.push(new PIXI.Point(0, this.height + i));
        }

        this.line = new PIXI.mesh.Rope(PIXI.Texture.fromImage(Slither.IMG), this.points);
        //this.line.blendMode = PIXI.BLEND_MODES.ADD;
        this.line.x = this.x;
        app.stage.addChild(this.line);
        app.ticker.add(() => this.update(r, rt));
        this.line.renderable = false;
    }

    /**
     * Begins the animation for the Slither
     */
    activate() {

        // Begins at bottom of screen
        this.points[0].y = this.height + Slither.DISTANCE_BETWEEN_NODES;

        // Now must be rendered
        this.line.renderable = true;
    }

    /**
     * 
     * Returns whether or not the Slither is being rendered
     * 
     * @returns { boolean }
     * 
     */
    isActive() {
        return this.line.renderable;
    }

    /**
     * 
     * Updates the positions of the nodes
     * 
     */
    update(renderer, rt) {

        // If it is currently animated
        if (this.line && this.line.renderable && renderer && rt) {
            // Updates the lead point
            this.points[0].y -= Slither.DISTANCE_BETWEEN_NODES;
            this.points[0].x = this.perlin.getNoise(this.points[0].y);

            // Sets the position of each point based on the point before (above) it
            for (let i = 1; i < this.points.length; i++) {
                
                this.points[i].x = this.perlin.getNoise(this.points[i].y);
                this.points[i].y = this.points[i - 1].y + Slither.DISTANCE_BETWEEN_NODES;
            }

            //renderer.render(this.line, rt, false);

            // If all points have risen above the screen then the animation is done
            this.line.renderable = this.points[this.points.length - 1].y >= 0;
        }
    }

}

export default Slither;