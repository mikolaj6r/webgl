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
  translate3dMat, identity3dMat, rotateX, rotateY, rotateZ, rotate3d
} from './utils'

import planets from './planets'
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

var programInfo;

var angleVZ = 0.0;
var angleVY = 0.0;
var angleVX = 180.0;

var translateX = 0.0;
var translateY = 0.0;
var translateZ = -3.0;
var translateVX = 50.0;
var translateVY = 0.0;
var translateVZ = -90.0;

let textures = [];
const yellowClr = [1, 1, 0];
let moveAroundSun = 1;

function createTexture(gl, url) {
  const textureBuffer = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textureBuffer);  
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
    1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 255, 255]));

  var textureImg = new Image();
  textureImg.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImg);

    if (isPowerOf2(textureImg.width) && isPowerOf2(textureImg.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // No, it's not a power of 2. Turn off mips and set
      // wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  }
  textureImg.src = url;

  return textureBuffer;
}

function createSphere(R = 5, n = 32, m = 32) { // radius, num in width, num in height

  let position = [], colors = [], coords = [], normals = [];
  const deltaAlfa = 360 / n;
  const deltaBeta = 180 / m;
  const deltaBetaRad = deltaBeta * (Math.PI / 180);

  let uv_y = 0;
  let uv_x = 0;

  const v = 1 / m;
  const u = 1 / n;
  for (let j = -m / 2; j < m / 2; j++) {
    const beta1 = j * deltaBetaRad;
    const beta2 = (j + 1) * deltaBetaRad;

    const r1 = R * Math.cos(beta1);
    const r2 = R * Math.cos(beta2);
    const y1 = R * Math.sin(beta1);
    const y2 = R * Math.sin(beta2);

    uv_x = 0;
    for (let i = 0; i < n; i++) {
      const alfa1 = i * deltaAlfa;
      const alfa1rad = alfa1 * Math.PI / 180;
      const alfa2 = (i + 1) * deltaAlfa;
      const alfa2rad = alfa2 * Math.PI / 180;

      const pnt0X = r1 * Math.cos(alfa1rad);
      const pnt0Z = r1 * Math.sin(alfa1rad);

      const pnt1X = r1 * Math.cos(alfa2rad);
      const pnt1Z = r1 * Math.sin(alfa2rad);

      const pnt2X = r2 * Math.cos(alfa2rad);
      const pnt2Z = r2 * Math.sin(alfa2rad);

      const pnt3X = r2 * Math.cos(alfa1rad);
      const pnt3Z = r2 * Math.sin(alfa1rad);

      const vecA = [pnt1X - pnt0X, y1 - y1, pnt1Z - pnt0Z];
      const vecB = [pnt3X - pnt0X, y2 - y1, pnt3Z - pnt0Z];
      const norm = Normalize(CrossProduct(vecA, vecB));


      position.push(...[pnt0X, y1, pnt0Z]); //0 top
      coords.push(...[uv_x, uv_y]);

      position.push(...[pnt1X, y1, pnt1Z]); //1 top
      coords.push(...[uv_x + u, uv_y]);

      position.push(...[pnt2X, y2, pnt2Z]); //2 bottom
      coords.push(...[uv_x + u, uv_y + v]);

      normals.push(...norm);
      normals.push(...norm);
      normals.push(...norm);

      colors.push(...yellowClr);
      colors.push(...yellowClr)
      colors.push(...yellowClr)

      position.push(...[pnt0X, y1, pnt0Z]); //0 top
      coords.push(...[uv_x, uv_y]);

      position.push(...[pnt2X, y2, pnt2Z]); //2 bottom
      coords.push(...[uv_x + u, uv_y + v])

      position.push(...[pnt3X, y2, pnt3Z]); //3 bottom
      coords.push(...[uv_x, uv_y + v])

      normals.push(...norm);
      normals.push(...norm);
      normals.push(...norm);

      colors.push(...yellowClr);
      colors.push(...yellowClr)
      colors.push(...yellowClr)
      uv_x += u;

    }
    uv_y += v;
  }

  return [position, colors, coords, normals];
}

function main() {
  const canv = document.getElementById("canvas");
  gl = null;
  try {
    gl = canv.getContext("experimental-webgl");
  } catch (e) { }
  if (!gl) alert("webgl not found");

  gl.viewportWidth = canv.width = document.documentElement.clientWidth;
  gl.viewportHeight = canv.height = document.documentElement.clientHeight;

  const aspect = gl.viewportWidth / gl.viewportHeight;
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
    gl.viewportWidth = canv.width = document.documentElement.clientWidth;
    gl.viewportHeight = canv.height = document.documentElement.clientHeight;

    const aspect = gl.viewportWidth / gl.viewportHeight;

    uPMatrix = [
      1.0 / (aspect * Math.tan(fov / 2)), 0, 0, 0,
      0, 1.0 / (Math.tan(fov / 2)), 0, 0,
      0, 0, (zFar + zNear) / (zNear - zFar), -1,
      0, 0, (2 * zFar * zNear) / (zNear - zFar), 0.0
    ];
  };

  const vsSource = `
    precision mediump float;

    attribute lowp vec3 aVertexColor; // attributes are read-only
    attribute highp vec3 aVertexPosition;
    attribute vec2 aVertexCoords;
    attribute vec3 aNormals;

    uniform highp mat4 uMMatrix;// uniforms are read-only and shared vs and fs
    uniform highp mat4 uPMatrix;
    uniform highp mat4 uVMatrix;
    uniform mat4 uMMatrixInverseTranspose;

    uniform bool inLight;

    varying lowp vec3 vColor; // varying are shared vs and fs
    varying vec2 vTexUV;
    varying vec3 vNormal;
    varying vec3 vPosition;

    uniform vec3 uLightPosition;
    uniform vec3 u_viewWorldPosition;

    varying vec3 v_surfaceToLight;
    varying vec3 v_surfaceToView;

    void main(){
        gl_Position = uPMatrix * uVMatrix  * uMMatrix * vec4(aVertexPosition, 1.0);

        vNormal = mat3(uMMatrixInverseTranspose) * aNormals;
        vec3 surfaceWorldPosition = (uMMatrix * vec4(aVertexPosition, 1.0)).xyz;
        v_surfaceToLight =  surfaceWorldPosition - uLightPosition;


        vColor = aVertexColor;
        vTexUV = aVertexCoords;
        vPosition = aVertexPosition;

    }

  `;

  const fsSource = `
    precision mediump float;

    varying lowp vec3 vColor;
    varying vec2 vTexUV;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform sampler2D uSampler;
    uniform vec3 uLightPosition;
    uniform bool inLight;

    varying vec3 v_surfaceToLight;
    varying vec3 v_surfaceToView;

    void main(){

      vec3 normal = normalize(vNormal);
      vec3 surfaceToLightDirection = normalize(v_surfaceToLight);

      float light = dot(normal, surfaceToLightDirection);

      gl_FragColor = texture2D(uSampler, vTexUV);

        if(inLight){
          gl_FragColor.rgb *= light;
        }
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

  // create Sphere
  {
    let [position, colors, coords, normals] = createSphere(5, 50, 50);
    manPosition.push(...position);
    manCoords.push(...coords);
    manColor.push(...colors);
    normalVectors.push(...normals);
  }

  let temp;

  temp = initBuffer(manPosition, 3);
  manVertBuffer = temp[0]; manNumItems = temp[1]; manItemSize = temp[2];
  temp = initBuffer(manColor, 3)
  manColorBuffer = temp[0];

  temp = initBuffer(manCoords, 2);
  manCoordsBuffer = temp[0]; manCoordsItemSize = temp[2];

  temp = initBuffer(normalVectors, 3);
  normalBuffer = temp[0]; normalItemSize = temp[2];


  planets.forEach((el, index) => {
    gl.activeTexture(gl[`TEXTURE${textures.length}`]);
      
    const texture = createTexture(gl, el.file);
    textures.push(texture);
      
    el.orbits.forEach( (orb, ind) => {
        gl.activeTexture(gl[`TEXTURE${textures.length}`]);
        const orbTexture = createTexture(gl, orb.file);
        textures.push(orbTexture);
    });
    
  })

  console.log(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
  requestAnimationFrame(animate);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {

  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clearColor(0.0, 0.0, 0.0, 0.9);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //gl.enable(gl.CULL_FACE);
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

  switchBuffers(programInfo, manVertBuffer, manColorBuffer, manNumItems, manItemSize)

  gl.bindBuffer(gl.ARRAY_BUFFER, manCoordsBuffer);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexCoords, manCoordsItemSize, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexCoords);

  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.vertexAttribPointer(programInfo.attribLocations.normals, normalItemSize, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.normals);

  gl.uniform3fv(programInfo.uniformLocations.lightPosition, [translateX, translateY, translateZ]);
  //gl.uniform3fv(
   // programInfo.uniformLocations.viewWorldPosition, [-translateVX, translateVY, translateVZ]);

  let i= 0;
  planets.forEach((el, index) => {
    //gl.activeTexture(gl[`TEXTURE${index}`]);
    //gl.bindTexture(gl.TEXTURE_2D, textures[index]);
    gl.uniform1i(programInfo.uniformLocations.sampler, i++);
    gl.uniform1i(programInfo.uniformLocations.inLight, el.inLight);

    let tempX = 0, tempY = 0, tempZ = 0;
    let date = Date.now() * 0.0001;
    if(moveAroundSun){
        tempX = Math.cos(date * el.sunCircuit) * (el.orbit - el.radius);
        tempZ = Math.sin(date * el.sunCircuit) * (el.orbit + el.radius);
        //temp_y = Math.sin(date * el.sunCircuit) * (el.orbit + el.radius);
    } 
    else{
        tempX = el.orbit;
        tempZ = 0;
    }
    planets[index].angle += el.ownRotate;

    let uModelMatrix = identity3dMat();
    uModelMatrix = MatrixMul(uModelMatrix, rotate3d(el.angle));
    uModelMatrix = MatrixMul(uModelMatrix, scale3dMat(el.radius));
    uModelMatrix = MatrixMul(uModelMatrix, translate3dMat(tempX, tempY, tempZ));
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uModelMatrix));

    let worldInverseMatrix = invert1dMat(uModelMatrix);
    let worldInverseTransposeMatrix = transpose1dMat(worldInverseMatrix);



    gl.uniformMatrix4fv(
      programInfo.uniformLocations.mMatrixInverseTranspose, false,
      worldInverseTransposeMatrix);

    drawTriangles(manNumItems)
      
    el.orbits.forEach( (orb, ind) => {
        gl.uniform1i(programInfo.uniformLocations.sampler, i++);
        gl.uniform1i(programInfo.uniformLocations.inLight, el.inLight);

        let tempOrbX = 0, tempOrbY = 0, tempOrbZ = 0;
        let dateOrb = Date.now() * 0.0001;
        tempOrbX = Math.cos(dateOrb * orb.planetCircuit) * (orb.orbit - orb.radius);
        tempOrbZ = Math.sin(dateOrb * orb.planetCircuit) * (orb.orbit + orb.radius);
        //temp_y = Math.sin(date * el.sunCircuit) * (el.orbit + el.radius);

        planets[index].orbits[ind].angle += orb.ownRotate;

        let uOrbMatrix = identity3dMat();
        uOrbMatrix = MatrixMul(uOrbMatrix, rotate3d(orb.angle));
        uOrbMatrix = MatrixMul(uOrbMatrix, scale3dMat(orb.radius));
        uOrbMatrix = MatrixMul(uOrbMatrix, translate3dMat(tempX +tempOrbX , tempOrbY, tempZ + tempOrbZ));
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uOrbMatrix));

        let worldInverseMatrixOrb = invert1dMat(uOrbMatrix);
        let worldInverseTransposeMatrixOrb = transpose1dMat(worldInverseMatrixOrb);

        gl.uniformMatrix4fv(
          programInfo.uniformLocations.mMatrixInverseTranspose, false,
          worldInverseTransposeMatrixOrb);

        drawTriangles(manNumItems)  
     })
  })
      
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
      
    if(e.code == "Space") moveAroundSun = !moveAroundSun;  

  })
  main();

})


