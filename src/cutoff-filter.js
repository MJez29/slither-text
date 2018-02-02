//import fragment from "./frag";
const PIXI = require("pixi.js");
let fragment = `
varying highp vec2 vTextureCoord;
uniform highp sampler2D uSampler;
uniform highp sampler2D uMask;

void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);
    color.a *= texture2D(uMask, vTextureCoord).a;
    gl_FragColor = color;
}`;

class CutoffFilter extends PIXI.Filter {

    constructor(mask) {
        super(null, fragment);
        this.mask = mask;
    }

    get mask() {
        return this.uniforms.uMask;
    }

    set mask(mask) {
        this.uniforms.uMask = mask;
    }

}

export default CutoffFilter;