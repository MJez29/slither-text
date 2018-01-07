

let img;

/**
 * @class
 */
class Particle {

    static loadImage() {
        let c = document.createElement("canvas");
        c.width = 3;
        c.height = 3;
        let ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = "#FFFFFF";
        ctx.arc(1, 1, 1, 0, Math.PI * 2);
        ctx.fill();
        img = c;
    }

    static get PARTICLE_IMAGE() {
        return img;
    }

    /**
     * @constructor
     * @param { number } nx 
     * @param { number } ny 
     * @param { number } npos 
     */
    constructor(nx, ny) {
        /**
         * The x-position of the pixel on the canvas
         * @type { number }
         */
        this.x = nx;

        /**
         * The y-position of the pixel on the canvas
         * @type { number }
         */
        this.y = ny;

        this.alive = false;
    }

    beginLifeCycle(d) {
        this.alive = true;
        this.duration = d;
        this.age = 0;
    }

    draw(ctx) {
        if (this.alive) {
            // if (this.age < 0.1 * this.duration)
            //     ctx.globalAlpha = -Math.cos(this.age * Math.PI * 0.25 / 0.1 * this.duration);
            // else if (this.age > 0.75 * this.duration)
            //     ctx.globalAlpha = Math.sin((this.age - 0.75 * this.duration) * Math.PI * 0.25 / 0.25 * this.duration);
            // else
            //     ctx.globalAlpha = 1;

            if (++this.age > this.duration)
                this.alive = false;
            //ctx.drawImage(Particle.PARTICLE_IMAGE, this.x, this.y);
            ctx.moveTo(this.x, this.y);
            ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
        }
    }
}

export default Particle;