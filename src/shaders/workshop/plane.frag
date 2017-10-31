precision mediump float;

varying vec2 vUv;

void main () {
    vec2 uv = vUv;

    float thickness = .1;
    vec2 cellCount = vec2( 10., 10.);
    float wireframe = smoothstep( 1. - thickness,1., fract( uv.x * cellCount.x ) );
    wireframe += smoothstep( 1. - thickness,1., fract( uv.y * cellCount.y ) );
    gl_FragColor.a = wireframe;
}