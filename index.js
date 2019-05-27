var gl;
var shaderProgram;
var uPMatrix;

var attribLocCol;
var attribLocPos;

var manVertBuffer;
var manColorBuffer;
var manItemSize;
var manNumItems;
var manCoordsBuffer;
var manCoordsNumItems;
var manCoordsItemSize;
var cubeVertBuffer;
var cubeColorBuffer;
var cubeItemSize;
var cubeNumItems;


var programInfo;

var angleZ = 0.0;
var angleY = 0.0;
var angleX = 0.0;

var angleVZ = 0.0;
var angleVY = 0.0;
var angleVX = 180.0;

var translateX = 0.0;
var translateY = 0.0;
var translateZ = 0.0;
let test;
var translateVX = 0.0;
var translateVY = 0.0;
var translateVZ = 0.0;

let shirt = [0.2, 0.2, 0.9];
let skin = [0.6, 0.3, 0.2];
let pants = [0.4, 0.3, 0.6];
const white = [0.9, 0.9, 0.9];
const black = [0, 0, 0];
const floor = white;
const zeroone = [0.0, 1.0];
const oneone = [1.0, 1.0];
const zerozero = [0.0, 0.0];

var textureBuffer;

function MatrixMul(matrix1, matrix2) {
  let c = [
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0
  ]


  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      c[i * 4 + j] = 0.0;
      for (let k = 0; k < 4; k++) {
        c[i * 4 + j] += matrix1[i * 4 + k] * matrix2[k * 4 + j];
      }
    }
  }
  return c;
}
function main() {
  const canv = document.getElementById("canvas");
  gl = null;
  try {
    gl = canv.getContext("experimental-webgl");
  } catch (e) { }
  if (!gl) alert("webgl not found");

  gl.viewportWidth = canv.width;
  gl.viewportHeight = canv.height;

  const vsSource = `
    precision highp float;
    attribute vec3 aVertexColor;
    attribute vec3 aVertexPosition;
    attribute vec2 aVertexCoords;

    uniform mat4 uMMatrix;
    uniform mat4 uPMatrix;
    uniform mat4 uVMatrix;


    varying vec3 vColor;
    varying vec2 vTexUV;
    void main(){
        gl_Position = uPMatrix * uVMatrix  * uMMatrix * vec4(aVertexPosition, 1.0);

        vColor = aVertexColor;
        vTexUV = aVertexCoords;
        
    }

  `;

  const fsSource = `
    precision highp float;
    varying vec3 vColor;
    varying vec2 vTexUV;
    uniform sampler2D uSampler;
    void main(){
        gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
        //gl_FragColor = texture2D(uSampler, vTexUV);
    }
  `;

  shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
      vertexCoords: gl.getAttribLocation(shaderProgram, 'aVertexCoords')
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uPMatrix'),
      modelMatrix: gl.getUniformLocation(shaderProgram, 'uMMatrix'),
      viewMatrix: gl.getUniformLocation(shaderProgram, 'uVMatrix'),
    },
  };

var manPosition = [];
let rstart = 0;
let rmax = 5;
let step = 0.1

for(l=0; l<rmax; l+= step){
y = [ rstart+l, rstart+l+step ];
r = [ rstart+l, rstart+l+step  ]
let delta = 360/6;
  for(i=0; i<6; i++){
      var alfa1 = i * delta;
      var alfa2 = (i+1)*delta;
      
      let x1top = r[0] * Math.cos(alfa1*Math.PI/180);
      let z1top = r[0] * Math.sin(alfa1*Math.PI/180);
      
      let x2top = r[0] * Math.cos(alfa2*Math.PI/180);
      let z2top = r[0] * Math.sin(alfa2*Math.PI/180);

      let x1bottom= r[1] * Math.cos(alfa1*Math.PI/180);
      let z1bottom = r[1] * Math.sin(alfa1*Math.PI/180);
      
      let x2bottom = r[1] * Math.cos(alfa2*Math.PI/180);
      let z2bottom = r[1] * Math.sin(alfa2*Math.PI/180);
  
      
      manPosition = manPosition.concat([x1top, y[0], z1top]); //1 top
      manPosition = manPosition.concat([x2top, y[0], z2top]); //2 top
      manPosition = manPosition.concat([x1bottom, y[1], z1bottom]); //4 bottom
      
      manPosition = manPosition.concat([x2top, y[0], z2top]); //1 top
      manPosition = manPosition.concat([x1bottom, y[1], z1bottom]); //4 bottom
      manPosition = manPosition.concat([x2bottom, y[1], z2bottom]); //3 bottom



  }
}
for(l=rmax; l>=0; l-= step){
  y = [ 2*rmax-l, 2*rmax-l+step ];
  r = [ rstart+l, rstart+l+step  ]
  let delta = 360/6;
    for(i=0; i<6; i++){
        var alfa1 = i * delta;
        var alfa2 = (i+1)*delta;
        
        let x1top = r[0] * Math.cos(alfa1*Math.PI/180);
        let z1top = r[0] * Math.sin(alfa1*Math.PI/180);
        
        let x2top = r[0] * Math.cos(alfa2*Math.PI/180);
        let z2top = r[0] * Math.sin(alfa2*Math.PI/180);
  
        let x1bottom= r[1] * Math.cos(alfa1*Math.PI/180);
        let z1bottom = r[1] * Math.sin(alfa1*Math.PI/180);
        
        let x2bottom = r[1] * Math.cos(alfa2*Math.PI/180);
        let z2bottom = r[1] * Math.sin(alfa2*Math.PI/180);
    
        
        manPosition = manPosition.concat([x1top, y[0], z1top]); //1 top
        manPosition = manPosition.concat([x2top, y[0], z2top]); //2 top
        manPosition = manPosition.concat([x1bottom, y[1], z1bottom]); //4 bottom
        
        manPosition = manPosition.concat([x2top, y[0], z2top]); //1 top
        manPosition = manPosition.concat([x1bottom, y[1], z1bottom]); //4 bottom
        manPosition = manPosition.concat([x2bottom, y[1], z2bottom]); //3 bottom
  
  
  
    }
  }
 
  const manColor = [
    //shirt down
    ...shirt, ...shirt, ...shirt,
    ...shirt, ...shirt, ...shirt,

    //shirt down
    ...shirt, ...shirt, ...shirt,
    ...shirt, ...shirt, ...shirt,

    //shirt down
    ...shirt, ...shirt, ...shirt,
    ...shirt, ...shirt, ...shirt,
    //shirt down
    ...shirt, ...shirt, ...shirt,
    ...shirt, ...shirt, ...shirt,

    //skin head
    ...skin, ...skin, ...skin,
    ...skin, ...skin, ...skin,

    //skin head
    ...skin, ...skin, ...skin,
    ...skin, ...skin, ...skin,

    //skin head
    ...skin, ...skin, ...skin,
    ...skin, ...skin, ...skin,

    //skin head
    ...skin, ...skin, ...skin,
    ...skin, ...skin, ...skin,
    //skin head
    ...skin, ...skin, ...skin,
    ...skin, ...skin, ...skin,

    ...pants, ...pants, ...pants,
    ...pants, ...pants, ...pants,

    ...pants, ...pants, ...pants,
    ...pants, ...pants, ...pants,

    ...pants, ...pants, ...pants,
    ...pants, ...pants, ...pants,

    ...pants, ...pants, ...pants,
    ...pants, ...pants, ...pants,
  ];

  const manCoords = [

    //shirt down front
    0.4, 0.425, 0.6, 0.425, 0.6, 0.71,
    0.4, 0.425, 0.6, 0.71, 0.4, 0.71,

    //shirt down back
    0.6, 0.425, 0.8, 0.425, 0.8, 0.71,
    0.6, 0.425, 0.8, 0.71, 0.6, 0.71,

    //shirt down left
    0.6, 0.14, 0.8, 0.14, 0.8, 0.425,
    0.6, 0.14, 0.8, 0.425, 0.6, 0.425,

    //shirt down right
    0.4, 0.14, 0.6, 0.14, 0.6, 0.425,
    0.4, 0.14, 0.6, 0.425, 0.4, 0.425,

    //skin head front
    0, 0, 0.2, 0, 0.2, 0.1428,
    0, 0, 0.2, 0.1428, 0, 0.1428,

    //skin head back
    0.4, 0, 0.6, 0, 0.6, 0.1428,
    0.4, 0, 0.6, 0.1428, 0.4, 0.1428,

    //skin head right
    0.2, 0, 0.4, 0, 0.4, 0.1428,
    0.2, 0, 0.4, 0.1428, 0.2, 0.1428,

    //skin head left
    0.8, 0, 1, 0, 1, 0.1428,
    0.8, 0, 1, 0.1428, 0.8, 0.1428,

    //skin head top
    0.6, 0, 0.8, 0, 0.8, 0.1428,
    0.6, 0, 0.8, 0.1428, 0.6, 0.1428,

    //pants front
    0.2, 0.425, 0.4, 0.425, 0.4, 0.7,
    0.2, 0.425, 0.4, 0.7, 0.2, 0.7,


    //pants back
    0, 0.425, 0.2, 0.425, 0.2, 0.7,
    0, 0.425, 0.2, 0.7, 0, 0.7,

    //pants right
    0, 0.14, 0.2, 0.14, 0.2, 0.425,
    0, 0.14, 0.2, 0.425, 0, 0.425,

    //pants left
    0.2, 0.14, 0.4, 0.14, 0.4, 0.425,
    0.2, 0.14, 0.4, 0.425, 0.2, 0.425,
  ];

  const cubePosition = [
    // Front face
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,


    // Back face
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0,
    -1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,
    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,
    // Right face
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, -1.0, -1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0,
  ];

  const cubeColor = [
    // Front face
    ...white,
    ...white,
    ...white,
    ...white,
    ...white,
    ...white,


    // Back face
    ...white,
    ...white,
    ...white,
    ...white,
    ...white,
    ...white,

    // Top face
    ...white,
    ...white,
    ...white,
    ...white,
    ...white,
    ...white,
    // Bottom face
    ...white,
    ...white,
    ...white,
    ...white,
    ...white,
    ...white,
    // Right face
    ...white,
    ...white,
    ...white,
    ...white,
    ...white,
    ...white,

    // Left face
    ...white,
    ...white,
    ...white,
    ...white,
    ...white,
    ...white,
  ]

  const floorPosition = [
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,
  ]

  const floorColor = [
    ...floor,
    ...floor,
    ...floor,
    ...floor,
    ...floor,
    ...floor,

  ]
  let temp;

  [manVertBuffer, manNumItems, manItemSize] = initBuffer(manPosition, 3);
  [manColorBuffer] = initBuffer(manColor, 3)

  let temp3;

  [manCoordsBuffer, manCoordsNumItems, manCoordsItemSize] = initBuffer(manCoords, 2);


  let temp2;
  [cubeVertBuffer, cubeNumItems, cubeItemSize] = initBuffer(cubePosition, 3);
  [cubeColorBuffer] = initBuffer(cubeColor, 2) 


  //load texture
  textureBuffer = gl.createTexture();
  var textureImg = new Image();
  textureImg.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImg);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }
  textureImg.src = "texture.png" 



  const aspect = gl.viewportWidth / gl.viewportHeight;
  let fov = 45.0 * Math.PI / 180.0;
  let zFar = 100.0;
  let zNear = 0.1;

  uPMatrix = [
    1.0 / (aspect * Math.tan(fov / 2)), 0, 0, 0,
    0, 1.0 / (Math.tan(fov / 2)), 0, 0,
    0, 0, (zFar + zNear) / (zFar - zNear), -1,
    0, 0, (2 * zFar * zNear) / (zFar - zNear), 0.0
  ];

  requestAnimationFrame(tick);
}
function tick() {
  //console.log(manVertBuffer)
  const pos = [0, -0.5, 3];
  let uMMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    ...pos, 1
  ]

  let uMTranslateZ = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]

  let uMTranslateConstMinusX = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    -2, 0, 0, 1
  ]

  let uMTranslateConstX = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    2, 0, 0, 1
  ]

  let uMTranslateConstMinusZ = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, -2, 1
  ]

  let uMTranslateConstZ = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 2, 1
  ]


  let uMRotZ = [
    Math.cos(angleZ * Math.PI / 180.0), Math.sin(angleZ * Math.PI / 180.0), 0, 0,
    -Math.sin(angleZ * Math.PI / 180.0), Math.cos(angleZ * Math.PI / 180.0), 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];

  let uMRotY = [
    Math.cos(angleY * Math.PI / 180.0), 0, -Math.sin(angleY * Math.PI / 180.0), 0,
    0, 1, 0, 0,
    Math.sin(angleY * Math.PI / 180.0), 0, Math.cos(angleY * Math.PI / 180.0), 0,
    0, 0, 0, 1
  ];

  let uMRotX = [
    1, 0, 0, 0,
    0, Math.cos(angleX * Math.PI / 180.0), Math.sin(angleX * Math.PI / 180.0), 0,
    0, -Math.sin(angleX * Math.PI / 180.0), Math.cos(angleX * Math.PI / 180.0), 0,
    0, 0, 0, 1
  ];

  let scaleMatrix = [
    0.05, 0, 0, 0,
    0, 0.05, 0, 0,
    0, 0, 0.05, 0,
    0, 0, 0, 1
  ];


  let uMScale = [
    10, 0, 0, 0,
    0, 10, 0, 0,
    0, 0, 10, 0,
    0, 0, 0, 1
  ];

  //uMMatrix = MatrixMul(uMMatrix, scaleMatrix);
  uMMatrix = MatrixMul(uMMatrix, uMRotX);
  uMMatrix = MatrixMul(uMMatrix, uMRotY);
  uMMatrix = MatrixMul(uMMatrix, uMRotZ);
  //uMMatrix = MatrixMul(uMMatrix, uMTranslateZ);


  let uMTranslate = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    translateX, translateY, translateZ, 1
  ]

  uManMatrix = MatrixMul(uMTranslate, scaleMatrix);

  let posV = [0, 0, 10];
  let uVMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    ...posV, 1
  ]


  let uVRotZ = [
    Math.cos(angleVZ * Math.PI / 180.0), Math.sin(angleVZ * Math.PI / 180.0), 0, 0,
    -Math.sin(angleVZ * Math.PI / 180.0), Math.cos(angleVZ * Math.PI / 180.0), 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];

  let uVRotY = [
    Math.cos(angleVY * Math.PI / 180.0), 0, -Math.sin(angleVY * Math.PI / 180.0), 0,
    0, 1, 0, 0,
    Math.sin(angleVY * Math.PI / 180.0), 0, Math.cos(angleVY * Math.PI / 180.0), 0,
    0, 0, 0, 1
  ];

  let uVRotX = [
    1, 0, 0, 0,
    0, Math.cos(angleVX * Math.PI / 180.0), Math.sin(angleVX * Math.PI / 180.0), 0,
    0, -Math.sin(angleVX * Math.PI / 180.0), Math.cos(angleVX * Math.PI / 180.0), 0,
    0, 0, 0, 1
  ];

  let uVTranslate = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    translateVX, translateVY, translateVZ, 1
  ]


  uVMatrix = MatrixMul(uVMatrix, uVRotX);
  uVMatrix = MatrixMul(uVMatrix, uVRotY);
  uVMatrix = MatrixMul(uVMatrix, uVRotZ);
  uVMatrix = MatrixMul(uVMatrix, uVTranslate);
  uVMatrix = invertMatrix(uVMatrix);


  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  gl.depthFunc(gl.LEQUAL);


  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(shaderProgram);


  //pass matrices
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, new Float32Array(uPMatrix));
  gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, false, new Float32Array(uVMatrix));


  attribLocPos = programInfo.attribLocations.vertexPosition;
  attribLocCol = programInfo.attribLocations.vertexColor;
  attribLocCoords = programInfo.attribLocations.vertexCoords;


  switchBuffers(manVertBuffer, manColorBuffer, manNumItems, manItemSize)
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uManMatrix));

  gl.bindBuffer(gl.ARRAY_BUFFER, manCoordsBuffer);
  gl.vertexAttribPointer(attribLocCoords, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribLocCoords);

   gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

  drawTriangles(manNumItems)
  //gl.drawArrays(gl.POINTS, 0 , 3)
}


function drawTriangles(size) {
  gl.drawArrays(gl.TRIANGLES, 0, size);
}

function initBuffer(data, size) {
  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

  const num = data.length / size;
  return [buffer, num, size];

}

function switchBuffers(vert, color, num, size) {
  gl.bindBuffer(gl.ARRAY_BUFFER, vert);
  gl.vertexAttribPointer(attribLocPos, size, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribLocPos);

  gl.bindBuffer(gl.ARRAY_BUFFER, color);
  gl.vertexAttribPointer(attribLocCol, size, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribLocCol);
}


function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);

  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initalize" + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("error during compiling" + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

window.addEventListener("DOMContentLoaded", () => {
  main();
  document.addEventListener("keydown", (e) => {
    if (e.code == "KeyW") translateVY -= 0.5;
    if (e.code == "KeyS") translateVY += 0.5;
    if (e.code == "KeyA") translateVX -= 0.5;
    if (e.code == "KeyD") translateVX += 0.5;
    if (e.code == "KeyQ") translateVZ -= 0.5;
    if (e.code == "KeyE") translateVZ += 0.5;


    if (e.code == "KeyI") angleVY -= 0.5;
    if (e.code == "KeyK") angleVY += 0.5;
    if (e.code == "KeyJ") angleVX -= 0.5;
    if (e.code == "KeyL") angleVX += 0.5;
    if (e.code == "KeyU") angleVZ -= 0.5;
    if (e.code == "KeyO") angleVZ += 0.5;

    if (e.code == "ArrowUp") translateZ += 1;
    if (e.code == "ArrowDown") translateZ -= 1;
    if (e.code == "ArrowLeft") translateX -= 1;
    if (e.code == "ArrowRight") translateX += 1;
    if (e.code == "PageUp") translateY += 1;
    if (e.code == "PageDown") translateY -= 1;

    requestAnimationFrame(tick);
  })
})

function invertMatrix(matrix) {

  // Adapted from: https://github.com/mrdoob/three.js/blob/master/src/math/Matrix4.js

  // Performance note: Try not to allocate memory during a loop. This is done here
  // for the ease of understanding the code samples.
  var result = [];

  var n11 = matrix[0], n12 = matrix[4], n13 = matrix[8], n14 = matrix[12];
  var n21 = matrix[1], n22 = matrix[5], n23 = matrix[9], n24 = matrix[13];
  var n31 = matrix[2], n32 = matrix[6], n33 = matrix[10], n34 = matrix[14];
  var n41 = matrix[3], n42 = matrix[7], n43 = matrix[11], n44 = matrix[15];

  result[0] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
  result[4] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
  result[8] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
  result[12] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
  result[1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
  result[5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
  result[9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
  result[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
  result[2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
  result[6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
  result[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
  result[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
  result[3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
  result[7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
  result[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
  result[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

  var determinant = n11 * result[0] + n21 * result[4] + n31 * result[8] + n41 * result[12];

  if (determinant === 0) {
    throw new Error("Can't invert matrix, determinant is 0");
  }

  for (var i = 0; i < result.length; i++) {
    result[i] /= determinant;
  }

  return result;
}