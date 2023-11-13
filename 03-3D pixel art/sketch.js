// Pixel Art Renderer Prototype
// Alexander Ha
// November 13, 2023
//
// Extra for Experts:
// - Well i tried to make a 3D renderer to render a pixel art scene with a bunch 'o' cool stuff but its super buggy
//    -> to play wasd to move forward back and left and right
//    -> space and shift to move up and down
//    -> use your mouse to move the camera around
//        \-> The mouse doesnt wrap around and you will probably see artifacts
// -If you notice any artifacting just reload the page with your mouse in the center of the screen
// -The colors are the uv map where the x is red and y is green the black stuff is a bug to be fixed before i
//  add the texture mapping, lighting, dithering, and color pallete stuff.

let myCamera = {
  pos: [0, -2, 0],
  orien: [0, 0, 0,],
  dim: [320, 180],
  f: 0.5,
  fov: 2*Math.PI/3
};

let myTriangles = [{
  vertices: [
    [-0.5, 0, -0.5], 
    [-0.5, 0, 0.5],
    [0.5, 0, 0.5]
  ],
  uvs: [
    [0, 1],
    [0, 0],
    [1, 0]
  ]
},{
  vertices: [
    [-0.5, 0, -0.5],
    [0.5, 0, -0.5],
    [0.5, 0, 0.5]
  ],
  uvs: [
    [0, 1],
    [1, 1],
    [1, 0]
  ]
}
];

let myImage;

function setup(){
  createCanvas(320,180);
  noSmooth();
  noStroke();
  noCursor();
  fill(255);
}

function draw(){
  background(127);
  myCamera.orien[2] -= (pmouseX-mouseX)*(PI/360);
  myCamera.orien[0] += (pmouseY-mouseY)*(PI/360);
  let x = 0.05*(keyIsDown(68)-keyIsDown(65));
  let y = 0.05*(keyIsDown(87)-keyIsDown(83));
  myCamera.pos[0] += sin(myCamera.orien[0])*y+cos(myCamera.orien[2])*x;
  myCamera.pos[1] += cos(myCamera.orien[0])*y-sin(myCamera.orien[2])*x;
  myCamera.pos[2] += 0.05*(keyIsDown(16)-keyIsDown(32));
  myImage = createImage(myCamera.dim[0], myCamera.dim[1]);
  myImage.loadPixels();
  drawImage(myCamera, myTriangles);
}

function drawImage(_camera, _triangles){
  for(let triangle of _triangles){
    let translatedVertices = rotateTriangle(translateTriangle(triangle.vertices, _camera.pos), _camera.orien);
    let projectedVertices = projectVertices(translatedVertices, _camera.dim, _camera.f, _camera.fov);
    for(let i=0; i<projectedVertices.length; i++){
      fill(triangle.uvs[i][0]*255, triangle.uvs[i][1]*255, 0);
      circle(projectedVertices[i][0], projectedVertices[i][1], 5);
    }
    let uvMap = rasterTriangle(projectedVertices, triangle.uvs);
    uvMap.forEach(element => {
      let i = (element[0]+element[1]*_camera.dim[0])*4;
      myImage.pixels[i] = element[2]*255;
      myImage.pixels[i+1] = element[3]*255;
      myImage.pixels[i+3] = 255;
    });
  }
  myImage.updatePixels();
  image(myImage, 0, 0);
}

//translate vertices;
function translateTriangle(_vertices, _pos){
  let translatedVertices = new Array(3).fill(null);
  for(let i=0; i<3; i++){
    translatedVertices[i] = new Array(3).fill(null);
  }
  for(let i=0; i<3; i++){
    for(let j=0; j<3; j++){
      translatedVertices[i][j] = _vertices[i][j]-_pos[j];
    }
  }
  return translatedVertices;
}

//rotate vertices
function rotateTriangle(_vertices, _orien){
  let sine, cosine;
  let rotatedVertices = new Array(3).fill(null);
  for(let i=0; i<3; i++){
    rotatedVertices[i] = new Array(3).fill(null);
  }
  for(let i = 0; i<3; i++){
    sine = sin(_orien[i]);
    cosine = cos(_orien[i]);
    for(let j=0; j<3; j++){
      rotatedVertices[j][i] = _vertices[j][i];
      rotatedVertices[j][(i+1)%3] = cosine*_vertices[j][(i+1)%3]-sine*_vertices[j][(i+2)%3];
      rotatedVertices[j][(i+2)%3] = sine*_vertices[j][(i+1)%3]+cosine*_vertices[j][(i+2)%3];
    }
    _vertices = structuredClone(rotatedVertices);
  }
  return _vertices;
}

//project triangle verticies onto screen;
function projectVertices(_vertices, _dim, _f, _fov){
  const scaleFactor = _dim[0]/2*(atan(_fov/2)*_f);
  let projectedVertices = new Array(3).fill(null);
  for(let i=0; i<3; i++){
    let x = _vertices[i][0]*_f/_vertices[i][1];
    let y = _vertices[i][2]*_f/_vertices[i][1];
    projectedVertices[i] = [Math.floor(x*scaleFactor+_dim[0]/2), Math.floor(y*scaleFactor+_dim[1]/2)];
  }
  return projectedVertices;
}

//rasterizes triangles and outputs a UV map;
function rasterTriangle(_vertices, _uvs){
  let uvs = structuredClone(_uvs);
  let dict = sortToDictionary(_vertices);
  let raster = [];
  let data = rasterEdges(
    raster, 
    [_vertices[dict[0]], _vertices[dict[1]]], 
    [_vertices[dict[0]], _vertices[dict[2]]], 
    [uvs[dict[0]], uvs[dict[1]]], 
    [uvs[dict[0]], uvs[dict[2]]]);
  raster = data.raster;
  data = rasterEdges(
    raster,
    [_vertices[dict[1]], _vertices[dict[2]]], 
    [data.midPoint, _vertices[dict[2]]], 
    [uvs[dict[1]], uvs[dict[2]]], 
    [data.midUV, uvs[dict[2]]]
  );
  return data.raster;
}

//raster the edges of two lines based on a vector;
function rasterEdges(_raster, _vectorOne, _vectorTwo, _uvOne, _uvTwo) {
  if(_vectorOne[0][1] !== _vectorOne[1][1]){
    let one = 0; 
    let two = 0;
    let midy = 0;

    let slopeOne = (_vectorOne[1][0] - _vectorOne[0][0]) / (_vectorOne[1][1] - _vectorOne[0][1]);
    let slopeTwo = (_vectorTwo[1][0] - _vectorTwo[0][0]) / (_vectorTwo[1][1] - _vectorTwo[0][1]);
    const shiftOne = Math.abs(slopeOne) > 1 ? Math.floor(slopeOne) : 0;
    const shiftTwo = Math.abs(slopeTwo) > 1 ? Math.floor(slopeTwo) : 0;
    slopeOne = slopeOne - shiftOne;
    slopeTwo = slopeTwo - shiftTwo;
    const directionOne = slopeOne > 0 ? 1 : -1;
    const directionTwo = slopeTwo > 0 ? 1 : -1;

    const uvOneRatioX = (_uvOne[1][0] - _uvOne[0][0]) / (_vectorOne[1][1] - _vectorOne[0][1]);
    const uvOneRatioY = (_uvOne[1][1] - _uvOne[0][1]) / (_vectorOne[1][1] - _vectorOne[0][1]);
    const uvTwoRatioX = (_uvTwo[1][0] - _uvTwo[0][0]) / (_vectorTwo[1][1] - _vectorTwo[0][1]);
    const uvTwoRatioY = (_uvTwo[1][1] - _uvTwo[0][1]) / (_vectorTwo[1][1] - _vectorTwo[0][1]);

    let x1 = _vectorOne[0][0];
    let x2 = _vectorTwo[0][0];
    let uv1 = _uvOne[0];
    let uv2 = _uvTwo[0];

    for (let y = _vectorOne[0][1]; y < _vectorOne[1][1]; y++) {
      x1 += shiftOne;
      x2 += shiftTwo;
      one += slopeOne;
      two += slopeTwo;
      if (Math.abs(one) > 1) {
        one -= directionOne;
        x1 += directionOne;
      }
      if (Math.abs(two) > 1) {
        two -= directionTwo;
        x2 += directionTwo;
      }
      uv1[0] += uvOneRatioX;
      uv1[1] += uvOneRatioY;
      uv2[0] += uvTwoRatioX;
      uv2[1] += uvTwoRatioY;
      _raster = rasterLine(_raster, [x1, y], [x2, y], uv1, uv2);
      midy = y;
    }
    return { 
      raster: _raster,
      midPoint: [x2, midy],
      midUV: [uv2]
    };
  } 
  else {
    return {
      raster: _raster,
      midPoint: _vectorTwo[0],
      midUV: _uvTwo[0]
    };
  }
}

//rasters a horizontal line;
function rasterLine(_raster, _start, _end, _uvStart, _uvEnd){
  let length = Math.abs(_start[0] - _end[0]);

  if(length === 0){
    _raster.push([_start[0], _start[1], _uvStart[0], _uvStart[1]]);
    return _raster;
  }

  if (_start[0] > _end[0]) {
    [_start, _end] = [_end, _start];
  }
  let uvxr = (_uvEnd[0] - _uvStart[0]) / length;
  let uvyr = (_uvEnd[1] - _uvStart[1]) / length;
  let [uvx, uvy] = _uvStart;
  let y = _start[1];

  for(let x = _start[0]; x<_end[0]; x++){
    _raster.push([x, y, uvx, uvy]);
    uvx += uvxr;
    uvy += uvyr;
  }
  return _raster;
}

//creates a dictionary of the order of the _vertices array based of element 1
function sortToDictionary(_vertices) {
  let dict = [0];
  if(_vertices[0][1] < _vertices[1][1]){
    dict.push(1);
  }
  else{
    dict.unshift(1);
  }
  if(_vertices[dict[1]][1]<_vertices[2][1]){
    dict.push(2);
  }
  else if(_vertices[dict[0]][1] < _vertices[2][1]){
    dict.splice(1, 0, 2);
  }
  else{
    dict.unshift(2);
  }
  return dict;
}