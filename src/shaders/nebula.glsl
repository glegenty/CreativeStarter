float Circle ( vec2 uv, vec2 p, float r, float blur) {
    
    float d = length(uv -p);
    float c = smoothstep(r, r - blur, d);
    return c;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    
    uv -= 0.5;
    uv.x *= iResolution.x / iResolution.y;
    
	vec2 p = vec2(.0, 0.0);
    float c = Circle(uv, p,  0.4, .01);
    float s = smoothstep(0.3, 0.2, cos(iTime * 2.));
    
    c -= Circle(uv, vec2(0.2, .1 ),  0.1, s);
    c -= Circle(uv, vec2(-0.2, .1 ),  0.1, .01);


    
	fragColor = vec4(vec3(c), 1.0);
}