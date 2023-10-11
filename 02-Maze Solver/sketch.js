// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let levels;
let data;
let colorCode; 

function preload(){
  data = loadStrings("levels.txt");
}

function setup() {
  createCanvas(600, 300);
  levels = {
    mazes: loadLevels(data),
    currentMaze: 0,
  };
  colorCode = [null, color(192), color(64), color(2, 204, 254), color(2, 204, 254), color(255, 36, 0)];
}

function draw() {
  background(220);
  drawMaze(levels.mazes[levels.currentMaze]);
}

function drawMaze(_maze){
  //draws map;
  for(let i=0; i<_maze.dimension[0]; i++){
    for(let j=0; j<_maze.dimension[1]; j++){
      if(_maze.mazeMap[i][j] !== 0){
        fill(colorCode[_maze.mazeMap[i][j]]);
        let x = _maze.cellSize[0]*(i+1.5+0.5*((j+1)%2));
        let y = _maze.cellSize[1]*(j+2);
        ellipse(x, y, _maze.cellSize[0], _maze.cellSize[1]);
      }
    }
  }
  //draws player;
  fill(0, 255, 0);
  let playerPos = _maze.player.pos;
  let x = _maze.cellSize[0]*(playerPos[0]+1.5+0.5*((playerPos[1]+1)%2));
  let y = _maze.cellSize[1]*(playerPos[1]+2);
  ellipse(x, y, _maze.cellSize[1], _maze.cellSize[1]*0.5);

  //draws enemies;
  fill(255, 165, 0);
  for(let i=0; i<_maze.enemies.length; i++){
    let enemyPos = _maze.enemies[i].pos;
    let x = _maze.cellSize[0]*(enemyPos[0]+1.5+0.5*((enemyPos[1]+1)%2));
    let y = _maze.cellSize[1]*(enemyPos[1]+2);
    ellipse(x, y, _maze.cellSize[1], _maze.cellSize[1]*0.5);
  }
}

//incorperate this function into the player class under entitites.js
/* 
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
*/