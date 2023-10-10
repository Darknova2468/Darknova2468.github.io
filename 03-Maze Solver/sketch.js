// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let colorCode; 
let maze;
let player;
let enemy1;
let enemy2;
let path1;
let path2;
let won = false;
let graph;
let devMode = false;
let nextPos;

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
      [2, 1, 1, 1, 2, 2, 4],
      [0, 2, 1, 2, 1, 1, 0],
      [0, 0, 0, 1, 0, 0, 0]
    ],
    dimension: [8, 7],
  };
  maze.cellWidth = width*0.75/(maze.dimension[1]+1);
  maze.cellHeight = height*0.75/(maze.dimension[0]+1);
  player = [0, 3];
  enemy1 = [2, 1];
  enemy2 = [3, 6];
  graph = new generateGraph(maze);
  path1 = graph.solve(enemy1, player);
  path2 = graph.solve(enemy2, player);
}

function keyTyped() {
  if(key === " "){
    devMode = !devMode;
  }
}

function draw() {
  background(220);
  drawMaze(maze, player, [enemy1, enemy2]);
  nextPos = castNext(player);
  if(devMode){
    visualizeNodes(maze, graph.nodes);
  }
}

function mouseReleased(){
  if(nextPos !== null){
    player = nextPos;
    path1 = graph.solve(enemy1, player);
    path2 = graph.solve(enemy2, player);
    if(path1 !== null){
      enemy1 = [Math.floor(path1[0]/7),path1[0]%7];
    }
    if(path2 !== null){
      enemy2 = [Math.floor(path2[0]/7),path2[0]%7];
    }
    if(enemy1[0] === player[0] && enemy1[1] === player[1] ||
      enemy2[0] === player[0] && enemy2[1] === player[1]){
      loseScreen();
    }
    else if(player[0] === 5 && player[1] === 6){
      winScreen();
    }
  }
}

function drawMaze(_maze, _pos, _enemys){
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

  fill(255, 165, 0);
  for(let i=0; i<_enemys.length; i++){
    let x =_maze.cellWidth*(_enemys[i][0]+1.75+0.5*((_enemys[i][1]+1)%2));
    let y = _enemys[i][1]*_maze.cellHeight+0.25*height;
    ellipse(x, y, _maze.cellWidth*0.5, _maze.cellHeight*0.5);
  }
}

function castNext(_pos){
  let pointer;
  let cases = [
    [0, 1],
    [4, 3]
  ];
  let case1 = [
    [-1, -1],
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 1],
    [-1, 0]
  ];
  let case2 = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1,0]
  ];
  let playerX = maze.cellWidth*(_pos[0]+1.75+0.5*((_pos[1]+1)%2));
  let playerY = _pos[1]*maze.cellHeight+0.25*height;
  let magnitude = dist(playerX, playerY, mouseX, mouseY);
  let theta = Math.atan((mouseX-playerX)/(mouseY-playerY));
  if(magnitude <= 2*maze.cellWidth){
    if(Math.abs(theta)-1.309 > 0){
      if(playerX > mouseX){
        pointer = 5;
      }
      else {
        pointer = 2;
      }
      
    }
    else {
      pointer = cases[1*(playerY<mouseY)][1*(playerX<mouseX)];
    }
    let x; let y;
    if(_pos[1]%2 === 1){
      x = _pos[0]+case1[pointer][0];
      y = _pos[1]+case1[pointer][1];
    }
    else {
      x = _pos[0]+case2[pointer][0];
      y = _pos[1]+case2[pointer][1];
    }
    if(x< maze.dimension[0] && x>=0 && y<maze.dimension[1] && y>= 0){
      if(maze.mazeMap[x][y] !== 0 && maze.mazeMap[x][y] !== 2){
        let screenX = maze.cellWidth*(x+1.75+0.5*((y+1)%2));
        let screenY = y*maze.cellHeight+0.25*height;
        fill(0, 200, 200);
        ellipse(screenX, screenY, maze.cellWidth*0.5, maze.cellHeight*0.5);
        fill(192);
        ellipse(screenX, screenY, maze.cellWidth*0.25, maze.cellHeight*0.25);
        return [x, y];
      }
      return null;
    }
    return null;
  }
  return null;
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

function winScreen(){
  textSize(50);
  fill(0, 255, 0);
  text("YOU WIN", width/2, height/2);
  console.log("win");
}

function loseScreen(){
  textSize(50);
  fill(255,0,0);
  text("YOU LOSE", width/2, height/2);
  console.log("lose");
}