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
let show = false;

function setup() {
  createCanvas(400, 400);
  textAlign(CENTER);
  textSize(50);
  colorCode = [color(192), color(64), color(2, 204, 254), color(255, 36, 0)];
  maze = {
    mazeMap: [
      [1, 3, 1, 1, 0, 0, 0, 0],
      [1, 0, 1, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 1, 1, 0, 0],
      [0, 1, 0, 1, 0, 0, 0, 1],
      [0, 1, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 0, 1, 0, 0, 2],
      [0, 0, 0, 0, 1, 0, 1, 1],
      [1, 0, 1, 0, 0, 0, 1, 1]
    ],
    dimension: [8, 8],
  };
  maze.cellWidth = width/maze.dimension[0];
  maze.cellHeight = height/maze.dimension[1];
  player = [5, 7];
  graph = new createGraph(maze.mazeMap, maze.dimension);
  graph.findPath([5, 7], [0, 1]);
}

function draw() {
  background(220);
  drawMaze(maze, player);
  checkWin(player);
}

function drawMaze(_maze, _pos){
  for(let i=0; i<_maze.dimension[0]; i++){
    for(let j=0; j<_maze.dimension[1]; j++){
      fill(colorCode[_maze.mazeMap[i][j]]);
      rect(i*_maze.cellWidth, j*_maze.cellHeight, _maze.cellWidth, _maze.cellHeight);
    }
  }
  fill(255, 255, 0);
  circle(_maze.cellWidth*(_pos[0]+0.5), _maze.cellHeight*(_pos[1]+0.5), _maze.cellWidth*0.5);
  if(show){
    showGraph(graph, maze.cellWidth, maze.cellHeight);
  }
}

function keyPressed(){
  if(!won){
    if(key === "s" && maze.mazeMap[player[0]][player[1]+1] !== 1 && player[1]<maze.dimension[0]) {
      player[1]++;
    } 
    if(key === "w" && maze.mazeMap[player[0]][player[1]-1] !== 1 && player[1]>0) {
      player[1]--;
    }
    if(key === "d" && maze.mazeMap[player[0]+1][player[1]] !== 1 && player[0]<maze.dimension[1]-1) {
      player[0]++;
    }
    if(key === "a" && maze.mazeMap[player[0]-1][player[1]] !== 1 && player[0]>0) {
      player[0]--;
    }
    if(key === " "){
      show = !show;
    }
  }
}

function checkWin(_pos){
  if(maze.mazeMap[_pos[0]][_pos[1]] === 3){
    fill(255);
    textSize(50);
    text("YOU WON", 200, 200);
    won = true;
  }
}

function showGraph(_graph, _cellWidth, _cellHeight){
  let nodes = graph.nodes;
  for(let i=0; i<nodes.length; i++){
    if(nodes[i]!== null){
      let x = _cellWidth*(Math.floor(nodes[i].id/8)+0.5);
      let y = _cellHeight*(nodes[i].id%8+0.5);
      fill(64);
      circle(x, y, _cellWidth/2);
      fill(255);
      textSize(10);
      text("ID:" + nodes[i].id, x, y);
    }
  }
}