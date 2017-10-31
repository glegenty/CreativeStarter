uniform float uTime;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

attribute vec3 aPosition;
// attribute vec3 aColor;

// varying vec3 vColor;
varying vec2 vUv;

void main () {
    // vColor = aColor;
    gl_Position = uPMatrix * uMVMatrix * vec4(aPosition, 1.0);
    // gl_PointSize = 5.0;
}