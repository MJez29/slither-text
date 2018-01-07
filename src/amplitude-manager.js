import PerlinNoise from "./perlin-noise";

/**
 * A wrapper class for the amplitudes of the slither text
 */
class AmplitudeManager {

    static get MAX_AMPLITUDE() {
        return 50;
    }

    static get SCALE() {
        return 0.01;
    }

    constructor(a, s) {
        this.amplitude = (a || AmplitudeManager.MAX_AMPLITUDE);
        this.perlin = new PerlinNoise(this.amplitude * 2, s || AmplitudeManager.SCALE);
    }

    at(x) {
        return this.perlin.getNoise(x) - this.amplitude;
    }

}

export default AmplitudeManager;