import vertSource from 'shaders/workshop/vert.glsl'
import fragSource from 'shaders/workshop/frag.glsl'
import planeVert from 'shaders/workshop/plane.vert'
import planeFrag from 'shaders/workshop/plane.frag'
import dat from 'dat-gui'
const mat4 = require('gl-matrix').mat4
const vec3 = require('gl-matrix').vec3

function createScene () {
  const cubeShader = {
    vertex: vertSource,
    fragment: fragSource,
    uniforms: ['uTime', 'uMVMatrix', 'uPMatrix'],
    attributes: ['aPosition', 'aColor']
  }
  const planeShader = {
    vertex: planeVert,
    fragment: planeFrag,
    uniforms: ['uTime', 'uMVMatrix', 'uPMatrix'],
    attributes: ['aPosition']
  }
  const gl = getGlContext()
  
  const prg = createProgram(gl, cubeShader)
  const planeMat = createProgram(gl, planeShader)
  
  console.log(prg)
  const data = createPosition()
  const buffers = createBuffers(gl, data, prg)
  const {mvMatrix, pMatrix} = initTransform(gl, prg)
  const rotation = vec3.create()
  const scale = vec3.create()
  vec3.set(rotation, 0,1,1)
  let uTime = 0

  const gui = new dat.GUI()
  const opts = {
    fov: 45
  }
  gui.add(opts, 'fov', 40, 120)
  setEvents()

  function setCanvas () {
    const canvas = document.createElement('canvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    document.getElementById('WebGL-output').appendChild(canvas)
    return canvas
  }

  function setEvents () {
    window.addEventListener('resize', () => {
      gl.canvas.width = window.innerWidth
      gl.canvas.height = window.innerHeight
      mat4.perspective(pMatrix, 30, window.innerWidth / window.innerHeight, 10, 5000.0)
    })
  }

  function getGlContext () {
    const canvas = setCanvas()
    const gl = canvas.getContext('webgl')
    // gl.clearColor(1.0, 1.0, 1.0, 1.0)
    // gl.enable(gl.DEPTH_TEST)
    // gl.canvas = canvas

    return gl
  }

  function createShader (gl, type, source) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log(type + ' : ' + gl.getShaderInfoLog(shader))
    }
    return shader
  }

  function createProgram (gl, shaderData) {
    const vShader = createShader(gl, gl.VERTEX_SHADER, shaderData.vertex)
    const fShader = createShader(gl, gl.FRAGMENT_SHADER, shaderData.fragment)

    const prg = gl.createProgram()
    gl.attachShader(prg, vShader)
    gl.attachShader(prg, fShader)
    gl.linkProgram(prg)
    gl.useProgram(prg)

    initAttribute(prg, shaderData.attributes)
    initUniforms(prg, shaderData.uniforms)

    if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
      console.log('Program not linked')
    }
    return prg
  }
  function initAttribute (prg, attributes) {
    attributes.forEach((attrib) => {
      console.log(attrib)
      prg[attrib] = gl.getAttribLocation(prg, attrib)
      gl.enableVertexAttribArray(prg[attrib])
    })
  }
  function initUniforms(prg, uniforms) {
    uniforms.forEach((uni) => {
      prg[uni] = gl.getUniformLocation(prg, uni)        
    })
  }

  function createPosition () {
    const data = {
      vertices: [
        // Front face
        -1.0, -1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, -1.0, 1.0, 0.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        -1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        // Back face
        -1.0, -1.0, -1.0, 0.0, 1.0, 1.0,
        -1.0, 1.0, -1.0, 0.0, 1.0, 1.0,
        1.0, 1.0, -1.0, 0.0, 1.0, 1.0,
        1.0, -1.0, -1.0, 0.0, 1.0, 1.0,
        // Top face
        -1.0, 1.0, -1.0, 0.0, 1.0, 1.0,
        -1.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        1.0, 1.0, -1.0, 0.0, 1.0, 1.0,
        // Bottom face
        -1.0, -1.0, -1.0, 0.0, 1.0, 1.0,
        1.0, -1.0, -1.0, 0.0, 1.0, 1.0,
        1.0, -1.0, 1.0, 0.0, 1.0, 1.0,
        -1.0, -1.0, 1.0, 0.0, 1.0, 1.0,
        // Right face
        1.0, -1.0, -1.0, 0.0, 1.0, 1.0,
        1.0, 1.0, -1.0, 0.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        1.0, -1.0, 1.0, 0.0, 1.0, 1.0,
        // Left face
        -1.0, -1.0, -1.0, 0.0, 1.0, 1.0,
        -1.0, -1.0, 1.0, 0.0, 1.0, 1.0,
        -1.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        -1.0, 1.0, -1.0, 0.0, 1.0, 1.0
      ],
      indices: [
        
        0, 1, 2, 0, 2, 3,         // front
        4, 5, 6, 4, 6, 7,         // back
        8, 9, 10, 8, 10, 11,      // top
        12, 13, 14, 12, 14, 15,   // bottom
        16, 17, 18, 16, 18, 19,   // right
        20, 21, 22, 20, 22, 23    // left
        
      ]
    }
    return data
  }

  function createPlane () {
    const data = [
      -1, -1, 0,
      -1, 1, 0,
      1, 1, 0,
      1, -1, 0
    ]

    const indices = [0, 1, 2, 2, 3, 4 ]

  }

  function createBuffers (gl, data) {
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertices), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    const ibo = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

    return {
      ibo,
      vbo
    }
  }

  function initTransform (gl, prg) {
    const mvMatrix = mat4.create()
    const pMatrix = mat4.create()
    mat4.perspective(pMatrix, 45, window.innerWidth / window.innerWidth, 0.1, 100.0)
    mat4.identity(mvMatrix)
    // const translation = vec3.create()
    // vec3.set(translation, 0, 0, 0)
    // mat4.translate(mvMatrix, mvMatrix, translation)
    gl.uniformMatrix4fv(prg.uPMatrix, false, pMatrix)
    gl.uniformMatrix4fv(prg.uMVMatrix, false, mvMatrix)
    return {
      mvMatrix: mvMatrix,
      pMatrix: pMatrix
    }
  }

  function drawCube () {
    gl.linkProgram(prg)
    gl.useProgram(prg)
  }

  function draw (audio) {
    uTime += 0.5
    let freq = audio[10] / 200
    // console.log(freq)
    gl.clearColor( 0.13, 0.13, 0.13, 1 )
    
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    
    gl.viewport(0, 0, window.innerWidth, window.innerHeight)

    mat4.identity(mvMatrix)
    vec3.set(scale, freq+1 , freq+1, freq+1)
    mat4.translate(mvMatrix, mvMatrix, [0, 0, -20])
    mat4.rotate(mvMatrix, mvMatrix, uTime /50 * ( Math.PI/2 ) , rotation)    
    mat4.perspective(pMatrix, opts.fov * ( Math.PI/180 ), window.innerWidth / window.innerHeight, 0.1, 100.0)
    mat4.scale(mvMatrix, mvMatrix, scale)
    
    gl.uniformMatrix4fv(prg.uPMatrix, false, pMatrix)
    gl.uniformMatrix4fv(prg.uMVMatrix, false, mvMatrix)
    gl.uniform1f(prg.uTime, false, uTime)

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vbo)
    gl.vertexAttribPointer(prg.aPosition, 3, gl.FLOAT, false, 24, 0)
    gl.vertexAttribPointer(prg.aColor, 3, gl.FLOAT, false, 24, 12)
    
    
    // gl.drawArrays(gl.POINTS, 0, 4)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.ibo)
    gl.drawElements(gl.TRIANGLES, data.indices.length, gl.UNSIGNED_SHORT, 0)
  }

  return {
    render: draw
  }
}

const scene = createScene()

export default scene
