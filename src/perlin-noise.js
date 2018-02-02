/**
 * A continuous random function
 * The algorithm isn't mine but I converted it to ES6
 * 
 * @class
 */
class PerlinNoise {

    /**
     * 
     * @constructor
     * 
     * @param { number }        a       - The amplitude of the function
     * @param { number }        s       - The scale factor applied to the input
     * @param { number[] }      r       - The vertices used to create noise
     * 
     */
    constructor(a, s, r) {
        this.MAX_VERTICES = 256;
        this.MAX_VERTICES_MASK = this.MAX_VERTICES -1;
        this.amplitude = a || 1;
        this.scale = s || 0.05;
    
        if (!r) {
            this.r = [];
        
            for (let i = 0; i < this.MAX_VERTICES; ++i ) {
                this.r.push(Math.random());
            }
        } else {
            this.r = r;
        }
    }

    /**
     * Returns the noise value at x
     * The output belongs to [0, amplitude)
     * 
     * @param { number } x 
     */
    getNoise(x){
        let scaledX = x * this.scale;
        let xFloor = Math.floor(scaledX);
        let t = scaledX - xFloor;
        let tRemapSmoothstep = t * t * ( 3 - 2 * t );

        /// Modulo using &
        let xMin = xFloor & this.MAX_VERTICES_MASK;
        let xMax = ( xMin + 1 ) & this.MAX_VERTICES_MASK;

        let y = this.lerp(this.r[xMin], this.r[xMax], tRemapSmoothstep);

        return y * this.amplitude;
    };

    /**
    * Linear interpolation function
    * @param { number } a - The lower integer value
    * @param { number } b - The upper integer value
    * @param { number } t - The value between the two
    * @returns { number }
    */
    lerp(a, b, t) {
        return a * ( 1 - t ) + b * t;
    }

    /**
     * Returns the vertices used to 
     */
    getVertices() {
        return this.r;
    }

    getAmplitude() {
        return this.amplitude;
    }
}

export default PerlinNoise;