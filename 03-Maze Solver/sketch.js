// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let colorCode; 
let maze;
let player;
let won = false;
let graph;
let devMode = false;

function setup() {
  createCanvas(600, 300);
  textAlign(CENTER);
  textSize(50);
  colorCode = [null, color(192), color(64), color(2, 204, 254), color(2, 204, 254), color(255, 36, 0)];
  maze = {
    mazeMap: [
      [0, 0, 2, 3, 2, 0, 0],
      [2, 2, 2, 1, 1, 2, 2],
      [1, 5, 2, 1, 2, 1, 2],
      [1, 2, 1, 1, 2, 1, 5],
      [2, 1, 2, 1, 1, 2, 2],
      [2, 1, 1, 1, 2, 1, 4],
      [0, 2, 1, 2, 1, 1, 0],
      [0, 0, 0, 1, 0, 0, 0]
    ],
    dimension: [8, 7],
  };
  maze.cellWidth = width*0.75/(maze.dimension[1]+1);
  maze.cellHeight = height*0.75/(maze.dimension[0]+1);
  player = [0, 3];
  graph = new generateGraph(maze);
  console.log(graph.solve(15, 3));
}

function keyTyped() {
  if(key === " "){
    devMode = !devMode;
  }
}

function draw() {
  background(220);
  drawMaze(maze, player);
  if(devMode){
    visualizeNodes(maze, graph.nodes);
  }
}

function drawMaze(_maze, _pos){
  for(let i=0; i<_maze.dimension[0]; i++){
    for(let j=0; j<_maze.dimension[1]; j++){
      if(_maze.mazeMap[i][j] !== 0){
        fill(colorCode[_maze.mazeMap[i][j]]);
        let x = _maze.cellWidth*(i+1.75+0.5*((j+1)%2));
        let y = j*_maze.cellHeight+0.25*height;
        ellipse(x, y, _maze.cellWidth, _maze.cellHeight);
      }
    }
  }
  fill(0, 255, 0);
  let x = _maze.cellWidth*(_pos[0]+1.75+0.5*((_pos[1]+1)%2));
  let y = _pos[1]*_maze.cellHeight+0.25*height;
  ellipse(x, y, _maze.cellWidth*0.5, _maze.cellHeight*0.5);
}

function visualizeNodes(_maze, _nodes){
  fill(255);
  textAlign(CENTER);
  textSize(20);
  for(let i=0; i<_maze.dimension[0]; i++){
    for(let j=0; j<_maze.dimension[1]; j++){
      if(_maze.mazeMap[i][j] !== 0){
        let x = _maze.cellWidth*(i+1.75+0.5*((j+1)%2));
        let y = j*_maze.cellHeight+0.25*height;
        if(_nodes[i*_maze.dimension[1]+j] !== null){
          text((_nodes[i*_maze.dimension[1]+j].id +" "+ _nodes[i*_maze.dimension[1]+j].edges.length), x, y);
        }
      }
    }
  }
}