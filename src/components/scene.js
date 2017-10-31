import sphereVert from 'shaders/sphere_V.glsl'
import sphereFrag from 'shaders/sphere_F.glsl'

const mat4 = require('gl-matrix').mat4
const vec3 = require('gl-matrix').vec3

function createScene () {
  const gl = getGlContext()
  const prg = createProgram(gl, sphereVert, sphereFrag)
  const data = createPosition()
  const buffers = createBuffers(gl, data, prg)
  const {mvMatrix, pMatrix} = initTransform(gl, prg)
  let uTime = 0
  console.log(mvMatrix)
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
    gl.clearColor(1.0, 1.0, 1.0, 1.0)
    gl.enable(gl.DEPTH_TEST)
    // gl.canvas = canvas

    return gl
  }

  function initTransform (gl, prg) {
    const mvMatrix = mat4.create()
    const pMatrix = mat4.create()
    mat4.perspective(pMatrix, 45, window.innerWidth / window.innerWidth, 0.1, 100.0)
    mat4.identity(mvMatrix)
    const translation = vec3.create()
    vec3.set(translation, 0, 0, -6.0)
    mat4.translate(mvMatrix, mvMatrix, translation)
    gl.uniformMatrix4fv(prg.uPMatrix, false, pMatrix)
    gl.uniformMatrix4fv(prg.uMVMatrix, false, mvMatrix)
    return {
      mvMatrix: mvMatrix,
      pMatrix: pMatrix
    }
  }

  function createProgram (gl, vSource, fSource) {
    const vShader = createShader(gl, gl.VERTEX_SHADER, vSource)
    const fShader = createShader(gl, gl.FRAGMENT_SHADER, fSource)

    const prg = gl.createProgram()
    gl.attachShader(prg, vShader)
    gl.attachShader(prg, fShader)
    gl.linkProgram(prg)
    gl.useProgram(prg)

    prg.aPosition = gl.getAttribLocation(prg, 'aPosition')
    prg.aNormal = gl.getAttribLocation(prg, 'aNormal')
    prg.uMVMatrix = gl.getUniformLocation(prg, 'uMVMatrix')
    prg.uPMatrix = gl.getUniformLocation(prg, 'uPMatrix')
    prg.uTime = gl.getUniformLocation(prg, 'uTime')
    gl.enableVertexAttribArray(prg.aPosition)
    // gl.enableVertexAttribArray(prg.aNormal)

    if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
      console.log('Program not linked')
    }

    return prg
  }

  function createPosition () {
    var latitudeBands = 30
    var longitudeBands = 30
    var radius = 1
    var zCenter = 0
    var vertexPositionData = []
    var normalData = []
    var textureCoordData = []

    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
      var theta = latNumber * Math.PI / latitudeBands
      var sinTheta = Math.sin(theta)
      var cosTheta = Math.cos(theta)

      for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
        var phi = longNumber * 2 * Math.PI / longitudeBands
        var sinPhi = Math.sin(phi)
        var cosPhi = Math.cos(phi)

        var x = cosPhi * sinTheta
        var y = cosTheta
        var z = sinPhi * sinTheta
        var u = 1 - (longNumber / longitudeBands)
        var v = 1 - (latNumber / latitudeBands)

        normalData.push(x)
        normalData.push(y)
        normalData.push(z)
        textureCoordData.push(u)
        textureCoordData.push(v)
        vertexPositionData.push(radius * x)
        vertexPositionData.push(radius * y)
        vertexPositionData.push(radius * z + zCenter)
      }
    }

    var indexData = []
    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
      for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
        var first = (latNumber * (longitudeBands + 1)) + longNumber
        var second = first + longitudeBands + 1
        indexData.push(first)
        indexData.push(second)
        indexData.push(first + 1)

        indexData.push(second)
        indexData.push(second + 1)
        indexData.push(first + 1)
      }
    }
    return {
      position: vertexPositionData,
      indices: indexData
    }
  }

  function createBuffers (gl, data, prg) {
    const sphereVBO = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVBO)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.position), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    const sphereIBO = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIBO)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

    return {
      vbo: sphereVBO,
      ibo: sphereIBO
    }
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

  function draw () {
    uTime += 0.5
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.viewport(0, 0, window.innerWidth, window.innerHeight)


    mat4.identity(mvMatrix)
    mat4.translate(mvMatrix, mvMatrix, [0, 0, -6])
    mat4.perspective(pMatrix, 45, window.innerWidth / window.innerHeight, 0.1, 100.0)

    gl.uniformMatrix4fv(prg.uPMatrix, false, pMatrix)
    gl.uniformMatrix4fv(prg.uMVMatrix, false, mvMatrix)
    gl.uniform1f(prg.uTime, false, uTime)

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vbo)
    gl.vertexAttribPointer(prg.aPosition, 3, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.ibo)
    gl.drawElements(gl.TRIANGLES, data.indices.length, gl.UNSIGNED_SHORT, 0)
    // console.log(uTime)     
  }

  return {
    render: draw
  }
}

const scene = createScene()

export default scene
