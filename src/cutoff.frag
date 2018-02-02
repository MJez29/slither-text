varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D uMask;

void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);
    color.a = texture2D(uMask, vTextureCoord).a;

    gl_FragColor = color;
}