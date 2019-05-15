// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
var test;
var translateVX = 0.0;
var translateVY = 0.0;
var translateVZ = 0.0;
var shirt = [0.2, 0.2, 0.9];
var skin = [0.6, 0.3, 0.2];
var pants = [0.4, 0.3, 0.6];
var white = [0.9, 0.9, 0.9];
var black = [0, 0, 0];
var floor = white;
var zeroone = [0.0, 1.0];
var oneone = [1.0, 1.0];
var zerozero = [0.0, 0.0];
var textureBuffer;

function MatrixMul(matrix1, matrix2) {
  var c = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      c[i * 4 + j] = 0.0;

      for (var k = 0; k < 4; k++) {
        c[i * 4 + j] += matrix1[i * 4 + k] * matrix2[k * 4 + j];
      }
    }
  }

  return c;
}

function main() {
  var canv = document.getElementById("canvas");
  gl = null;

  try {
    gl = canv.getContext("experimental-webgl");
  } catch (e) {}

  if (!gl) alert("webgl not found");
  gl.viewportWidth = canv.width;
  gl.viewportHeight = canv.height;
  var vsSource = "\n    precision highp float;\n    attribute vec3 aVertexColor;\n    attribute vec3 aVertexPosition;\n    attribute vec2 aVertexCoords;\n\n    uniform mat4 uMMatrix;\n    uniform mat4 uPMatrix;\n    uniform mat4 uVMatrix;\n\n\n    varying vec3 vColor;\n    varying vec2 vTexUV;\n    void main(){\n        gl_Position = uPMatrix * uVMatrix  * uMMatrix * vec4(aVertexPosition, 1.0);\n\n        vColor = aVertexColor;\n        vTexUV = aVertexCoords;\n        \n    }\n\n  ";
  var fsSource = "\n    precision highp float;\n    varying vec3 vColor;\n    varying vec2 vTexUV;\n    uniform sampler2D uSampler;\n    void main(){\n        //gl_FragColor = vec4(vColor, 1.0);\n        gl_FragColor = texture2D(uSampler, vTexUV);\n    }\n  ";
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
      viewMatrix: gl.getUniformLocation(shaderProgram, 'uVMatrix')
    }
  };
  var manPosition = [//shirt down back
  0, 0, 0, 4, 0, 0, 4, 2, 0, 0, 0, 0, 4, 2, 0, 0, 2, 0, //shirt down front
  0, 0, 1.5, 4, 0, 1.5, 4, 2, 1.5, 0, 0, 1.5, 4, 2, 1.5, 0, 2, 1.5, //shirt down front
  4, 0, 0, 4, 0, 1.5, 4, 2, 1.5, 4, 0, 0, 4, 2, 1.5, 4, 2, 0, //shirt down front
  0, 0, 0, 0, 0, 1.5, 0, 2, 1.5, 0, 0, 0, 0, 2, 1.5, 0, 2, 0, //shirt top back
  -4, 0, 0, -4, -1, 0, 8, -1, 0, -4, 0, 0, 8, -1, 0, 8, 0, 0, //shirt top front
  -4, 0, 1.5, -4, -1, 1.5, 8, -1, 1.5, -4, 0, 1.5, 8, -1, 1.5, 8, 0, 1.5, //shirt top front
  8, -1, 0, 8, -1, 1.5, 8, 0, 1.5, 8, -1, 0, 8, 0, 1.5, 8, 0, 0, //shirt top front
  -4, -1, 0, -4, -1, 1.5, -4, 0, 1.5, -4, -1, 0, -4, 0, 1.5, -4, 0, 0, //skin head back
  0, -6, 0, 4, -6, 0, 4, -2, 0, 0, -6, 0, 4, -2, 0, 0, -2, 0, //skin head front
  0, -6, 3, 4, -6, 3, 4, -2, 3, 0, -6, 3, 4, -2, 3, 0, -2, 3, //skin head back
  4, -6, 0, 4, -6, 3, 4, -2, 3, 4, -6, 0, 4, -2, 3, 4, -2, 0, //skin head back
  0, -6, 0, 0, -6, 3, 0, -2, 3, 0, -6, 0, 0, -2, 3, 0, -2, 0, //skin neck back
  1, -2, 0, 3, -2, 0, 3, -1, 0, 1, -2, 0, 3, -1, 0, 1, -1, 0, //skin neck back
  1, -2, 1, 3, -2, 1, 3, -1, 1, 1, -2, 1, 3, -1, 1, 1, -1, 1, //skin neck back
  3, -2, 0, 3, -2, 1.5, 3, -1, 1.5, 3, -2, 0, 3, -1, 1.5, 3, -1, 0, //skin neck back
  1, -2, 0, 1, -2, 1.5, 1, -1, 1.5, 1, -2, 0, 1, -1, 1.5, 1, -1, 0, //skin leg right back
  0.5, 8, 0, 1.5, 8, 0, 1.5, 11, 0, 0.5, 8, 0, 1.5, 11, 0, 0.5, 11, 0, //skin leg right back
  0.5, 8, 1, 1.5, 8, 1, 1.5, 11, 1, 0.5, 8, 1, 1.5, 11, 1, 0.5, 11, 1, //skin leg right back
  1.5, 8, 0, 1.5, 8, 1.5, 1.5, 11, 1.5, 1.5, 8, 0, 1.5, 11, 1.5, 1.5, 11, 0, //skin leg right back
  0.5, 8, 0, 0.5, 8, 1.5, 0.5, 11, 1.5, 0.5, 8, 0, 0.5, 11, 1.5, 0.5, 11, 0, //skin leg left back
  2.5, 8, 0, 3.5, 8, 0, 3.5, 11, 0, 2.5, 8, 0, 3.5, 11, 0, 2.5, 11, 0, //skin leg left back
  2.5, 8, 1, 3.5, 8, 1, 3.5, 11, 1, 2.5, 8, 1, 3.5, 11, 1, 2.5, 11, 1, //skin leg left back
  3.5, 8, 0, 3.5, 8, 1, 3.5, 11, 1, 3.5, 8, 0, 3.5, 11, 1, 3.5, 11, 0, //skin leg left back
  2.5, 8, 0, 2.5, 8, 1, 2.5, 11, 1, 2.5, 8, 0, 2.5, 11, 1, 2.5, 11, 0, //skin hand left
  //2.5, 0, 0, 3.5, 0, 0, 3.5, 3, 0,
  //2.5, 0, 0, 3.5, 3, 0, 2.5, 3, 0,
  //pants back
  0, 2, 0, 4, 2, 0, 4, 8, 0, 0, 2, 0, 4, 8, 0, 0, 8, 0, //pants back
  0, 2, 1.5, 4, 2, 1.5, 4, 8, 1.5, 0, 2, 1.5, 4, 8, 1.5, 0, 8, 1.5, 4, 2, 0, 4, 2, 1.5, 4, 8, 1.5, 4, 2, 0, 4, 8, 1.5, 4, 8, 0, 0, 2, 0, 0, 2, 1.5, 0, 8, 1.5, 0, 2, 0, 0, 8, 1.5, 0, 8, 0];
  var manColor = [].concat(shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, shirt, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, skin, pants, pants, pants, pants, pants, pants, pants, pants, pants, pants, pants, pants, pants, pants, pants, pants, pants, pants, pants, pants, pants, pants, pants, pants);
  var manCoords = [].concat(zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, [//skin head front
  0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, //skin head back
  0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1], zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero, zerozero);
  var cubePosition = [// Front face
  -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, // Back face
  -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, // Top face
  -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, // Bottom face
  -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, // Right face
  1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, // Left face
  -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0];
  var cubeColor = [].concat(white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white);
  var floorPosition = [-1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0];
  var floorColor = [].concat(floor, floor, floor, floor, floor, floor);
  var temp;

  var _initBuffer = initBuffer(manPosition, 3);

  var _initBuffer2 = _slicedToArray(_initBuffer, 3);

  manVertBuffer = _initBuffer2[0];
  manNumItems = _initBuffer2[1];
  manItemSize = _initBuffer2[2];

  var _initBuffer3 = initBuffer(manColor, 3);

  var _initBuffer4 = _slicedToArray(_initBuffer3, 1);

  manColorBuffer = _initBuffer4[0];
  var temp3;

  var _initBuffer5 = initBuffer(manCoords, 2);

  var _initBuffer6 = _slicedToArray(_initBuffer5, 3);

  manCoordsBuffer = _initBuffer6[0];
  manCoordsNumItems = _initBuffer6[1];
  manCoordsItemSize = _initBuffer6[2];
  var temp2;

  var _initBuffer7 = initBuffer(cubePosition, 3);

  var _initBuffer8 = _slicedToArray(_initBuffer7, 3);

  cubeVertBuffer = _initBuffer8[0];
  cubeNumItems = _initBuffer8[1];
  cubeItemSize = _initBuffer8[2];

  var _initBuffer9 = initBuffer(cubeColor, 2);

  var _initBuffer10 = _slicedToArray(_initBuffer9, 1);

  cubeColorBuffer = _initBuffer10[0];
  //load texture
  textureBuffer = gl.createTexture();
  var textureImg = new Image();

  textureImg.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImg);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  };

  textureImg.src = "tex.png";
  var aspect = gl.viewportWidth / gl.viewportHeight;
  var fov = 45.0 * Math.PI / 180.0;
  var zFar = 100.0;
  var zNear = 0.1;
  uPMatrix = [1.0 / (aspect * Math.tan(fov / 2)), 0, 0, 0, 0, 1.0 / Math.tan(fov / 2), 0, 0, 0, 0, (zFar + zNear) / (zFar - zNear), -1, 0, 0, 2 * zFar * zNear / (zFar - zNear), 0.0];
  requestAnimationFrame(tick);
}

function tick() {
  //console.log(manVertBuffer)
  var pos = [0, -0.5, 3];
  var uMMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0].concat(pos, [1]);
  var uMTranslateZ = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  var uMTranslateConstMinusX = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -2, 0, 0, 1];
  var uMTranslateConstX = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 2, 0, 0, 1];
  var uMTranslateConstMinusZ = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -2, 1];
  var uMTranslateConstZ = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 2, 1];
  var uMRotZ = [Math.cos(angleZ * Math.PI / 180.0), Math.sin(angleZ * Math.PI / 180.0), 0, 0, -Math.sin(angleZ * Math.PI / 180.0), Math.cos(angleZ * Math.PI / 180.0), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  var uMRotY = [Math.cos(angleY * Math.PI / 180.0), 0, -Math.sin(angleY * Math.PI / 180.0), 0, 0, 1, 0, 0, Math.sin(angleY * Math.PI / 180.0), 0, Math.cos(angleY * Math.PI / 180.0), 0, 0, 0, 0, 1];
  var uMRotX = [1, 0, 0, 0, 0, Math.cos(angleX * Math.PI / 180.0), Math.sin(angleX * Math.PI / 180.0), 0, 0, -Math.sin(angleX * Math.PI / 180.0), Math.cos(angleX * Math.PI / 180.0), 0, 0, 0, 0, 1];
  var scaleMatrix = [0.05, 0, 0, 0, 0, 0.05, 0, 0, 0, 0, 0.05, 0, 0, 0, 0, 1];
  var uMScale = [10, 0, 0, 0, 0, 10, 0, 0, 0, 0, 10, 0, 0, 0, 0, 1]; //uMMatrix = MatrixMul(uMMatrix, scaleMatrix);

  uMMatrix = MatrixMul(uMMatrix, uMRotX);
  uMMatrix = MatrixMul(uMMatrix, uMRotY);
  uMMatrix = MatrixMul(uMMatrix, uMRotZ); //uMMatrix = MatrixMul(uMMatrix, uMTranslateZ);

  var uMTranslate = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, translateX, translateY, translateZ, 1];
  uManMatrix = MatrixMul(uMTranslate, scaleMatrix);
  var posV = [0, 0, 10];
  var uVMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0].concat(posV, [1]);
  var uVRotZ = [Math.cos(angleVZ * Math.PI / 180.0), Math.sin(angleVZ * Math.PI / 180.0), 0, 0, -Math.sin(angleVZ * Math.PI / 180.0), Math.cos(angleVZ * Math.PI / 180.0), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  var uVRotY = [Math.cos(angleVY * Math.PI / 180.0), 0, -Math.sin(angleVY * Math.PI / 180.0), 0, 0, 1, 0, 0, Math.sin(angleVY * Math.PI / 180.0), 0, Math.cos(angleVY * Math.PI / 180.0), 0, 0, 0, 0, 1];
  var uVRotX = [1, 0, 0, 0, 0, Math.cos(angleVX * Math.PI / 180.0), Math.sin(angleVX * Math.PI / 180.0), 0, 0, -Math.sin(angleVX * Math.PI / 180.0), Math.cos(angleVX * Math.PI / 180.0), 0, 0, 0, 0, 1];
  var uVTranslate = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, translateVX, translateVY, translateVZ, 1];
  uVMatrix = MatrixMul(uVMatrix, uVRotX);
  uVMatrix = MatrixMul(uVMatrix, uVRotY);
  uVMatrix = MatrixMul(uVMatrix, uVRotZ);
  uVMatrix = MatrixMul(uVMatrix, uVTranslate);
  uVMatrix = invertMatrix(uVMatrix);
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthMask(gl.TRUE);
  gl.depthFunc(gl.LEQUAL);
  gl.depthRange(0.0, 3.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clearDepth(0.0);
  gl.useProgram(shaderProgram); //pass matrices

  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, new Float32Array(uPMatrix));
  gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, false, new Float32Array(uVMatrix));
  attribLocPos = programInfo.attribLocations.vertexPosition;
  attribLocCol = programInfo.attribLocations.vertexColor;
  attribLocCoords = programInfo.attribLocations.vertexCoords;
  /*   //uMMatrix = MatrixMul(uMMatrix, uMScale);
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstMinusX);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    switchBuffers(cubeVertBuffer, cubeColorBuffer, cubeNumItems, cubeItemSize)
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstZ);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstZ);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstX);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstMinusX);
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstZ);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstZ);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstZ);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstZ);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
    // end of left, now right
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstX);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstX);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstMinusZ);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstMinusZ);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstX);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstX);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstMinusX);
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstMinusZ);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstMinusZ);
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstMinusZ);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstMinusZ);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstMinusX);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstX);
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstX);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstX);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstX);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstZ);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstZ);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstMinusX);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstX);
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstZ);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstZ);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstZ);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstZ);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstMinusX);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize)
  
    uMMatrix = MatrixMul(uMMatrix, uMTranslateConstMinusX);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uMMatrix));
    drawTriangles(cubeNumItems * cubeItemSize) */

  switchBuffers(manVertBuffer, manColorBuffer, manNumItems, manItemSize);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, new Float32Array(uManMatrix));
  gl.bindBuffer(gl.ARRAY_BUFFER, manCoordsBuffer);
  gl.vertexAttribPointer(attribLocCoords, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribLocCoords);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);
  drawTriangles(manNumItems);
}

function drawTriangles(size) {
  gl.drawArrays(gl.TRIANGLES, 0, size);
}

function initBuffer(data, size) {
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  var num = data.length / size;
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
  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  var shaderProgram = gl.createProgram();
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
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("error during compiling" + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

window.addEventListener("DOMContentLoaded", function () {
  main();
  document.addEventListener("keydown", function (e) {
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
  });
});

function invertMatrix(matrix) {
  // Adapted from: https://github.com/mrdoob/three.js/blob/master/src/math/Matrix4.js
  // Performance note: Try not to allocate memory during a loop. This is done here
  // for the ease of understanding the code samples.
  var result = [];
  var n11 = matrix[0],
      n12 = matrix[4],
      n13 = matrix[8],
      n14 = matrix[12];
  var n21 = matrix[1],
      n22 = matrix[5],
      n23 = matrix[9],
      n24 = matrix[13];
  var n31 = matrix[2],
      n32 = matrix[6],
      n33 = matrix[10],
      n34 = matrix[14];
  var n41 = matrix[3],
      n42 = matrix[7],
      n43 = matrix[11],
      n44 = matrix[15];
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
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49603" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/graphics.e31bb0bc.js.map