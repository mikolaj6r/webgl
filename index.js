/*
    przygotowac symulacje ukladu slonecznego

    na srodku zolte, nieoswietlone slonce
    dookola kraza planety, poteksturowane
    minimum 5 planet, roznej wielkosci, krecace wokol wlasnej osi
    bonus: ksiezyc, krecacy dookola ziemi lub pierscienie dookola jowisza
    i wszystko ma sie krecic dookola slonca
    mozna sterowac kamera`
    obiekt nic nie przyslania, dla slonca if wylaczajacy oswietlenie (uSmack ==0), dla innych planet (uSmack == 1) 
    
*/

import {
  invert1dMat, CrossProduct, Normalize, isPowerOf2, MatrixMul, transpose1dMat, scale3dMat,
  translate3dMat, identity3dMat, rotateX, rotateY, rotateZ, rotate3d, createTexture
} from './utils.js'

//import { createHuman } from './human.js'
import { createSphere, genPointCloud, genPointColors, genPointNormals, genPointCoords, updatePosition,
       createTriangle, createVelocity} from './geometry.js'

var gl;
var shaderProgram;
var uPMatrix;

var manVertBuffer;
var manColorBuffer;
var manItemSize;
var manNumItems;
var manCoordsBuffer;
var manCoordsItemSize;
var normalBuffer;
var normalItemSize;

var vertexPointCloudPositionBuffer;
var vertexPointCloudColorBuffer;
var vertexPointCloudCoordsBuffer;
var vertexPointCloudNormalBuffer;

  let PointCloudPosition;

let prevTime;

var programInfo;

var angleVZ = 0.0;
var angleVY = 0.0;
var angleVX = 180.0;

var translateX = 0.0;
var translateY = 0.0;
var translateZ = -3.0;
var translateVX = 50.0;
var translateVY = 0.0;
var translateVZ = -120.0;

let textures = [];
const yellowClr = [1, 1, 0];
let moveAroundSun = 1;


function main() {
  const canv = document.getElementById("canvas");
  try {
    gl = canv.getContext("experimental-webgl");
  } catch (e) { 
      alert("webgl not found");
  }


  canv.width = document.documentElement.clientWidth;
  canv.height = document.documentElement.clientHeight;
    
  const aspect = canvas.clientWidth / canvas.clientHeight;
  let fov = 45.0 * Math.PI / 180.0;
  let zFar = 2000.0;
  let zNear = 1;

  uPMatrix = [
    1.0 / (aspect * Math.tan(fov / 2)), 0, 0, 0,
    0, 1.0 / (Math.tan(fov / 2)), 0, 0,
    0, 0, (zFar + zNear) / (zNear - zFar), -1,
    0, 0, (2 * zFar * zNear) / (zNear - zFar), 0.0
  ];

  window.onresize = function () {
    canv.width = document.documentElement.clientWidth;
    canv.height = document.documentElement.clientHeight;

    const aspect = canvas.clientWidth / canvas.clientHeight;

    uPMatrix = [
      1.0 / (aspect * Math.tan(fov / 2)), 0, 0, 0,
      0, 1.0 / (Math.tan(fov / 2)), 0, 0,
      0, 0, (zFar + zNear) / (zNear - zFar), -1,
      0, 0, (2 * zFar * zNear) / (zNear - zFar), 0.0
    ];
  };

  const vsSource = `
    precision mediump float;

    //attribute highp vec3 aVertexColor;
    attribute highp vec3 aVertexPosition;
    attribute vec2 aVertexCoords;
    attribute vec3 aNormals;
    attribute vec3 aVertexColor;

    uniform highp mat4 uMMatrix;// uniforms are read-only and shared vs and fs
    uniform highp mat4 uPMatrix;
    uniform highp mat4 uVMatrix;

    uniform bool inLight;

    varying vec2 vTexUV; // varying are shared vs and fs
    varying vec3 vNormal;
    varying vec3 vColor;

    uniform vec3 uLightPosition;
    uniform mat4 uMMatrixInverseTranspose;

    varying vec3 v_surfaceToLight;

    void main(){
        gl_Position = uPMatrix * uVMatrix  * uMMatrix * vec4(aVertexPosition, 1.0);
        //vTexUV = aVertexCoords;
              
        vColor = aVertexColor;
        //if(inLight){
        //    vNormal = mat3(uMMatrixInverseTranspose) * aNormals;
        //    vec3 surfaceWorldPosition = (uMMatrix * vec4(aVertexPosition, 1.0)).xyz;
        //    v_surfaceToLight =  surfaceWorldPosition - uLightPosition;
        //        }

    }

  `;

  const fsSource = `
    precision mediump float;

    varying vec2 vTexUV;
    varying vec3 vNormal;
    varying vec3 vColor;
    uniform sampler2D uSampler;
    uniform vec3 uLightPosition;
    uniform bool inLight;

    varying vec3 v_surfaceToLight;

    void main(){

      //gl_FragColor = texture2D(uSampler, vTexUV);

      //if(inLight){
        //vec3 normal = normalize(vNormal);
        //vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
        //float light = dot(normal, surfaceToLightDirection);
        //gl_FragColor.rgb *= light;
        //     gl_FragColor = vec4(vColor, 1.0);
        //  }
        gl_FragColor = vec4(vColor, 1.0);
    }
  `;

  shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
      vertexCoords: gl.getAttribLocation(shaderProgram, 'aVertexCoords'),
      normals: gl.getAttribLocation(shaderProgram, 'aNormals')
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uPMatrix'),
      modelMatrix: gl.getUniformLocation(shaderProgram, 'uMMatrix'),
      viewMatrix: gl.getUniformLocation(shaderProgram, 'uVMatrix'),
      inLight: gl.getUniformLocation(shaderProgram, 'inLight'),
      sampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
      lightPosition: gl.getUniformLocation(shaderProgram, 'uLightPosition'),
      viewWorldPosition: gl.getUniformLocation(shaderProgram, 'u_viewWorldPosition'),
      mMatrixInverseTranspose: gl.getUniformLocation(shaderProgram, 'uMMatrixInverseTranspose'),
    },
  };


  var manPosition = [];
  var manCoords = [];
  var manColor = [];
  var normalVectors = [];
    
  var vertexPointCloudPosition = [];
  var vertexPointCloudCoords = [];
  var vertexPointCloudColor = [];
  var vertexPointCloudNormals = [];

  // create cloud point
  {
    let temp1 = genPointColors(5);
    let temp2 = genPointCoords(5);
    let temp3 = genPointNormals(5);
      
    vertexPointCloudColor.push(...temp1);
    vertexPointCloudCoords.push(...temp2);
    vertexPointCloudNormals.push(...temp3);
  }

    
  let temp;

  temp = initBuffer(vertexPointCloudColor, 3);
  vertexPointCloudColorBuffer = temp[0]; manNumItems = temp[1]; manItemSize = temp[2];
    

  temp = initBuffer(vertexPointCloudCoords, 2);
  vertexPointCloudCoordsBuffer = temp[0]; manCoordsItemSize = temp[2];

  temp = initBuffer(vertexPointCloudNormals, 3);
  vertexPointCloudNormalBuffer = temp[0];

      
  temp = genPointCloud(5);
  PointCloudPosition = temp;
    
  temp = createTriangle(PointCloudPosition, 5, -2); 
  vertexPointCloudPosition = temp;  
    
    
  temp = createVelocity(5);
  let PointCloudVelocity = temp;
    
  gl.activeTexture(gl.TEXTURE0);
  const humanTexture = createTexture(gl, "texture.png");
  textures.push(humanTexture);
    
  requestAnimationFrame(animate);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(0.0, 0.0, 0.0, 0.9);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.useProgram(shaderProgram);
  gl.depthFunc(gl.LEQUAL);


  let uVMatrix = identity3dMat();
  uVMatrix = MatrixMul(MatrixMul(rotateX(angleVX), rotateY(angleVY)), rotateZ(angleVZ))
  uVMatrix = MatrixMul(uVMatrix, translate3dMat(translateVX, translateVY, translateVZ));
  uVMatrix = invert1dMat(uVMatrix);

  //pass matrices
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, new Float32Array(uPMatrix));
  gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, false, new Float32Array(uVMatrix));
  gl.uniform3fv(programInfo.uniformLocations.lightPosition, [translateX, translateY, translateZ]); 
    
    
   //update
  let now = Date.now();
  let dt = now - prevTime;
  prevTime = now;
  let velocity = createVelocity(5);
  PointCloudPosition = updatePosition(PointCloudPosition, velocity, 5, dt);
  console.log(PointCloudPosition);
   //create
  let vertexPointCloudPosition = createTriangle(PointCloudPosition, 5, 100); 
   
  // console.log(PointCloudPosition);
  let temp = initBuffer(PointCloudPosition, 3);
  vertexPointCloudPositionBuffer = temp[0]; 
  let vertexPointCloudPositionNumItems = temp[1];
  let vertexPointCloudPositionItemSize = temp[2];
   

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPointCloudPositionBuffer);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, vertexPointCloudPositionItemSize, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    
   
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPointCloudColorBuffer);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, vertexPointCloudPositionItemSize, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);

    
  //gl.bindBuffer(gl.ARRAY_BUFFER, vertexPointCloudCoordsBuffer);
  //gl.vertexAttribPointer(programInfo.attribLocations.vertexCoords, 2, gl.FLOAT, false, 0, 0);
  //gl.enableVertexAttribArray(programInfo.attribLocations.vertexCoords);

  //gl.bindBuffer(gl.ARRAY_BUFFER, vertexPointCloudNormalBuffer);
  //gl.vertexAttribPointer(programInfo.attribLocations.normals, vertexPointCloudPositionItemSize, gl.FLOAT, false, 0, 0);
  //gl.enableVertexAttribArray(programInfo.attribLocations.normals);


    

  let uSkyModelMatrix = identity3dMat();
  uSkyModelMatrix = MatrixMul(uSkyModelMatrix, scale3dMat(0.001));
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uSkyModelMatrix));
  drawPoints(vertexPointCloudPositionItemSize)
      
}

function drawTriangles(size) {
  gl.drawArrays(gl.TRIANGLES, 0, size);
}

function drawPoints(size) {
  gl.drawArrays(gl.POINTS, 0, size);
}

function initBuffer(data, size) {
  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

  const num = data.length / size;
  return [buffer, num, size];

}

function switchBuffers(programInfo, vert, color, num, size) {
  gl.bindBuffer(gl.ARRAY_BUFFER, vert);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, size, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, color);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, size, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
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

    if (e.code == "ArrowUp") translateY += 0.5;
    if (e.code == "ArrowDown") translateY -= 0.5;
    if (e.code == "ArrowLeft") translateX -= 0.5;
    if (e.code == "ArrowRight") translateX += 0.5;
    if (e.code == "Equal") translateZ += 0.5;
    if (e.code == "Minus") translateZ -= 0.5;

  })
  main();

})


