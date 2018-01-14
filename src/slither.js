import Particle from "./particle";
let PIXI = require("pixi.js");

class Slither {

    static get DISTANCE_BETWEEN_NODES() {
        return 5;
    }

    static get LENGTH() {
        return 500;
    }

    static get IMG() {
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAACCAYAAACE7KJkAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gEOBwwZh3a/4wAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAA2UlEQVRYw+1Wyw7DMAgzU7P//+HFu/QQIZ7T1BOWotKEgHGaMQEAkm8AF4AFQNtLjXNdz0dzVyH2anBYhs9gMBgMngXvsQt2dz2KCcfPi7uPuWjvr++aE5s5rL0d7c7aPkaNSHjsAp8Od10HCmff0ZZ3nfzT+XU0KO17HZdE7qFtKBvGmhiXTtTlk+NpxRMnLp28dLgNBoPB4Pk/Wfr3HkEPyfpF5APVqzp9oNKvrD6Tccs4SFFDFvhKYnv6d2rpaCjq/CN/JvVLkJNO/4/0ofOdVvJLQyPzTL4oE9sZ2ipqfgAAAABJRU5ErkJggg==";
    }

    static generateDuration() {
        return Math.floor(Math.random() * 200 + 100);
    }

    constructor(x, p, h, app) {
        this.perlin = p;
        this.height = h;
        this.points = [];
        this.x = x;
        this.amplitude = this.perlin.getAmplitude() / 2.0;
        for (let i = 0; i < Slither.LENGTH; i += Slither.DISTANCE_BETWEEN_NODES) {
            this.points.push(new PIXI.Point(0, this.height + i));
        }

        this.line = new PIXI.mesh.Rope(PIXI.Texture.fromImage(Slither.IMG), this.points);
        this.line.x = this.x;
        this.line.y = 0;
        app.stage.addChild(this.line);
        app.ticker.add(() => this.draw());
        this.line.renderable = false;
    }

    activate() {
        this.points[0].y = this.height + Slither.DISTANCE_BETWEEN_NODES;
        this.line.renderable = true;
    }

    isActive() {
        return this.line.renderable;
    }

    /**
     * Returns whether or not anything was drawn
     * @param {*} ctx 
     * @returns { boolean }
     */
    draw() {
        if (this.line && this.line.renderable) {
            this.points[0].y -= Slither.DISTANCE_BETWEEN_NODES;
            this.points[0].x = this.perlin.getNoise(this.points[0].y);

            for (let i = 1; i < this.points.length; i++) {
                
                this.points[i].x = this.perlin.getNoise(this.points[i].y);
                this.points[i].y = this.points[i - 1].y + Slither.DISTANCE_BETWEEN_NODES;
            }
            this.line.renderable = this.points[this.points.length - 1].y >= 0;
        }
    }

}

export default Slither;