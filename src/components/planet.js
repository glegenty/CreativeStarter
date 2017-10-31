import sphereFrag from '../shaders/sphereFrag.glsl'
import sphereVert from '../shaders/sphereVert.glsl'

const uniforms = {
  u_time: { type: 'f', value: 0.2 },
  scale: { type: 'f', value: 0.2 },
  mouse: { type: 'v2', value: new THREE.Vector2() },
  u_resolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
}
const sphereGeo = new THREE.SphereGeometry(4, 20, 20)
const sphereMat = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: sphereVert,
  fragmentShader: sphereFrag,
  transparent: true
  // side: THREE.DoubleSide,
  // shading: THREE.FlatShading
})

const sphere = new THREE.Mesh(sphereGeo, sphereMat)
