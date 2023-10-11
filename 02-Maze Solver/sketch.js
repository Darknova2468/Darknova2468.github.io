// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let levels;
let colorCode; 

function setup() {
  createCanvas(600, 300);
  loadStrings("levels.txt", function(data){
    levels = {
      mazes: loadLevels(data),
      currentMaze: 0,
    };
  });
  colorCode = [null, color(192), color(64), color(2, 204, 254), color(2, 204, 254), color(255, 36, 0)];
}

function draw() {
  background(220);
  levels.mazes[levels.currentMaze].player.castNext(levels.mazes[levels.currentMaze]);
  //draws maze;
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

  //draw players next move;
  if(_maze.player.nextPos !== null){
    let nextPlayerPos = _maze.player.nextPos;
    let x = _maze.cellSize[0]*(nextPlayerPos[0]+1.5+0.5*((nextPlayerPos[1]+1)%2));
    let y = _maze.cellSize[1]*(nextPlayerPos[1]+2);
    fill(0, 255, 0);
    ellipse(x, y, _maze.cellSize[1], _maze.cellSize[1]/2);
    fill(colorCode[_maze.mazeMap[nextPlayerPos[0]][nextPlayerPos[1]]]);
    ellipse(x, y, _maze.cellSize[1]/2, _maze.cellSize[1]/4);
  }

  //draws enemies;
  fill(255, 165, 0);
  for(let i=0; i<_maze.enemies.length; i++){
    let enemyPos = _maze.enemies[i].pos;
    let x = _maze.cellSize[0]*(enemyPos[0]+1.5+0.5*((enemyPos[1]+1)%2));
    let y = _maze.cellSize[1]*(enemyPos[1]+2);
    ellipse(x, y, _maze.cellSize[1], _maze.cellSize[1]*0.5);
  }
}

function mouseReleased(){
  //moves player and enemies;
  if(levels.mazes[levels.currentMaze].player.nextPos !== null){
    let currentMaze = levels.mazes[levels.currentMaze];
    currentMaze.player.updatePos();
    for(let i=0; i<levels.mazes[levels.currentMaze].enemies.length; i++){
      currentMaze.enemies[i].updatePos(
        currentMaze.graph, 
        currentMaze.player.pos, 
        currentMaze.dimension);
    }
  }
}