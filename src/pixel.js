/**
 * @class
 */
class Pixel {
    /**
     * @constructor
     * @param { number } nx 
     * @param { number } ny 
     * @param { number } npos 
     */
    constructor(nx, ny, npos) {
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

        /**
         * The position of the pixel in the canvas data array
         * @type { number }
         */
        this.pos = npos;
    }
}

export default Pixel;