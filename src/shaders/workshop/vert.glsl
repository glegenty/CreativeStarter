uniform float uTime;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

attribute vec2 aPosition;
attribute vec3 aColor;

varying vec3 vColor;

void main () {
    vColor = aColor;
    gl_Position = uPMatrix * uMVMatrix * vec4(aPosition, 0.0, 1.0);
    // gl_PointSize = 5.0;
}