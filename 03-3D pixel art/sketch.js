// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let myCamera = {
  pos: [0, -1, 0],
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
  UVs: [
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
  UVs: [
    [0, 1],
    [1, 1],
    [1, 0]
  ]
}
];

function setup(){
  createCanvas(320,180);
  fill(255);
  frameRate(1);
}

function draw(){
  background(0);
  drawImage(myCamera, myTriangles);
}

function drawImage(_camera, _triangles){
  for(let triangle of _triangles){
    let translatedVertices = rotateTriangle(translateTriangle(triangle.vertices, _camera.pos), _camera.orien);
    let projectedVertices = projectVertices(translatedVertices, _camera.dim, _camera.f, _camera.fov);
    let uvMap = rasterTriangle(projectedVertices, triangle.UVs);
  }
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
  _vertices.sort((x, y) => x[1] - y[1]);
  let raster = [];
  try {
    let slope = 
  } 
  return raster;
}

//rasters a horizontal line;
function rasterLine(_raster, _start, _end, _uvStart, _uvEnd){
  let y = _start[1];
  let length = Math.abs(_start[0]-_end[0]);
  let uvxr = (_uvEnd[0]-_uvStart[0])/length;
  let uvyr = (_uvEnd[1]-_uvStart[1])/length;
  let [uvx, uvy] = _uvStart;
  for(let x = _start[0]; x<_end[0]; x++){
    _raster.push([x, y, uvx, uvy]);
    uvx += uvxr;
    uvy += uvyr;
  }
  return _raster;
}