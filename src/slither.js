import Particle from "./particle";

class Slither {

    static get DISTANCE_BETWEEN_PARTICLES() {
        return 2;
    }

    static generateDuration() {
        return Math.floor(Math.random() * 200 + 100);
    }

    constructor(x, p, h) {
        this.perlin = p;
        this.height = h;
        this.particles = [];
        this.x = x;
        for (let i = 0; i < h; i += Slither.DISTANCE_BETWEEN_PARTICLES) {
            this.particles.push(new Particle(this.x + this.perlin.getNoise(i), i));
        }

        this.head = this.tail = 0;
    }

    activate() {
        this.head = this.tail = 0;

    }

    /**
     * Returns whether or not anything was drawn
     * @param {*} ctx 
     * @returns { boolean }
     */
    draw(ctx) {
        if (this.head < this.particles.length) {
            this.particles[this.head].beginLifeCycle(200);
            this.head++;
        }
        for (let i = this.tail; i < this.head; i++) {
            this.particles[i].draw(ctx);
        }
        if (!this.particles[this.tail].alive) {
            this.tail++;
        }

        return this.tail != this.particles.length - 1;
    }

}

export default Slither;