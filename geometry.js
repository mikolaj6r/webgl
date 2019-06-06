import {
  invert1dMat, CrossProduct, Normalize, isPowerOf2, MatrixMul, transpose1dMat, scale3dMat,
  translate3dMat, identity3dMat, rotateX, rotateY, rotateZ, rotate3d, createTexture
} from './utils.js'

const yellowClr = [0.5, 0.6, 0.9];
export function createSphere(R = 5, n = 32, m = 32) { // radius, num in width, num in height

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

 function getRandomInt(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max-min)) + min;
}

export function genPointCloud(n){
    let pos = [];
    for( let i=0; i<n; i++ ){
        //position
        pos.push( getRandomInt(-5, 5 )); //x
        pos.push( getRandomInt(-3, 3 ) ); //y
        pos.push( getRandomInt(-6, 6 ) ); //z
    }
    return pos;


}

export function genPointColors(n){
    let color = [];
    for( let i=0; i<n; i++ ){
        color.push( ...[  Math.random() , Math.random(), Math.random()   ] ); //x  
        color.push( ...[  Math.random() , Math.random(), Math.random()   ] ); //x 
        color.push( ...[  Math.random() , Math.random(), Math.random()   ] ); //x 
    }
    return color;

}
export function genPointNormals(n){
    let normals = [];
    for( let i=0; i<n; i++ ){
        normals.push( ...[Math.random()*3.5, Math.random()*3.5, Math.random()*3.5 ] ); //x  
    }
    return normals;

}
export function genPointCoords(n){
    let coords = [];
    for( let i=0; i<n; i++ ){
        coords.push( ...[Math.random()*3.5, Math.random()*3.5 ] ); //x  
    }
    return coords;

}
export function updatePosition(pos, vel, n ,dt){
    for(let i=0; i<n; i++){
        pos[i*3+0] += vel[i*3+0] * dt;
        pos[i*3+1] += vel[i*3+1] * dt;
        pos[i*3+2] += vel[i*3+2] * dt;
    }
    return pos;
}



export function createTriangle(pos, n, s){
    
    let vertex = [];
    for(let i=0; i<n; i++){
        vertex.push( ...[ pos[3*i+0]-s, pos[3*i+1]+ getRandomInt(0, 2)*0.1, pos[3*i+2]-s ] );
        vertex.push( ...[ pos[3*i+0]+s, pos[3*i+1]+s, pos[3*i+2]-s ] );
        vertex.push( ...[ pos[3*i+0]+s,   pos[3*i+1]+s, pos[3*i+2]+s ] );
    }
    return vertex;

}

export function createVelocity(n){
    let pos = [];
    for( let i=0; i<n; i++ ){
        //position
        pos.push( getRandomInt(-10, 10 )*1); //x
        pos.push( getRandomInt(-10, 10 )*1 ); //y
        pos.push( getRandomInt(-10, 10 )*1 ); //z
    }
    return pos;    
}

