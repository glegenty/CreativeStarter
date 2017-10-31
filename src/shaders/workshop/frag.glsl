precision highp float;
uniform float uTime;
varying vec3 vColor;
void main () {
    float blue = cos(uTime * 100.);
    gl_FragColor = vec4(vColor.rg, blue, 1.0);
}