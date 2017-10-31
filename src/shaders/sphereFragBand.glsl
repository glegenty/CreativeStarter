#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float random (in float x) {
    return fract(sin(x)*1e4);
}

float random (in vec2 st) { 
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

float randomSerie(float x, float freq, float t) {
    return step(.8, floor(x*freq)-floor(t) );
}

void main() {
    vec2 st = gl_FragCoord.xy/resolution.xy;
    st.y *= resolution.x/resolution.y;
    
    vec3 color = vec3(0.0);

    float cols = 5.;
    float freq = 5.0;
    float t = 60.+time*(1.0-freq)*30.;

    if (fract(st.y*cols* 0.5) < 0.5){
        t *= -1.0;
    }

    freq += random(floor(st.y));

    float offset = 0.025;
    color = vec3(randomSerie(freq*100., st.y, t+offset),
                 randomSerie(freq*100., st.y, t),
                 randomSerie(freq*100., st.y, t-offset));

    gl_FragColor = vec4(1.0-color, freq*100.);
}