// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let levels;
let textures;

function preload(){
  createCanvas(600, 300);
  loadImage("Textures.png", function(texturePack){ 
    textures = loadTextures(texturePack, [32,32]);
  });
  loadStrings("levels.txt", function(data){
    levels = {
      mazes: loadLevels(data, ),
      currentMaze: 0,
      mazeNumbers: 5
    };
  });
  
}
function setup() {
  resizeCanvas(600, 300); 
  //https://coolors.co/palette/f0ead2-dde58f-adc178-a98467-6c584c
}

function draw() {
  background(220);
  levels.mazes[levels.currentMaze].player.castNext(levels.mazes[levels.currentMaze]);
  //draws maze;
  drawMaze(levels.mazes[levels.currentMaze], textures);
}

function drawMaze(_maze, _textures){
  //draws map;
  for(let j=0; j<_maze.dimension[1]; j++){
    for(let i=0; i<_maze.dimension[0]; i++){
      if(_maze.mazeMap[i][j] !== 0){
        let [x, y] = worldToScreen([i,j], _maze.cellSize, _maze.offset);
        image(_textures[_maze.mazeMap[i][j]], x, y, _maze.cellSize[0], _maze.cellSize[0]);
      }
    }
  }
  //draws player;
  fill(0, 255, 0);
  let [x, y] = worldToScreen(_maze.player.pos, _maze.cellSize, _maze.offset);
  ellipse(x+_maze.cellSize[1], y+_maze.cellSize[1]/1.25, _maze.cellSize[1], _maze.cellSize[1]*0.5);

  //draw players next move;
  if(_maze.player.nextPos !== null){
    let [x, y] = worldToScreen(_maze.player.nextPos, _maze.cellSize, _maze.offset);
    fill(0, 255, 0);
    ellipse(x+_maze.cellSize[1], y+_maze.cellSize[1]/1.25, _maze.cellSize[1], _maze.cellSize[1]/2);
    fill(192);
    ellipse(x+_maze.cellSize[1], y+_maze.cellSize[1]/1.25, _maze.cellSize[1]/2, _maze.cellSize[1]/4);
  }

  //draws enemies;
  fill(255, 165, 0);
  for(let i=0; i<_maze.enemies.length; i++){
    let [x, y] = worldToScreen(_maze.enemies[i].pos, _maze.cellSize, _maze.offset);
    ellipse(x+_maze.cellSize[1], y+_maze.cellSize[1]/1.25, _maze.cellSize[1], _maze.cellSize[1]*0.5);
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
    //checks if you have beat the level
    if(currentMaze.end[0] === currentMaze.player.pos[0] &&
       currentMaze.end[1] === currentMaze.player.pos[1] &&
      levels.currentMaze + 1 < levels.mazeNumbers){
      levels.currentMaze++;
    }
    for(let i=0; i<currentMaze.enemies.length; i++){
      if(currentMaze.player.pos[0] === currentMaze.enemies[i].pos[0] &&
        currentMaze.player.pos[1] === currentMaze.enemies[i].pos[1]){
        resetMaze();
        break;
      }
    }
  }
}

function keyTyped(){
  if(key === "r"){
    resetMaze();
  }
  if(keyCode === 13){
    if(levels.currentMaze + 1 < levels.mazeNumbers){
      levels.currentMaze++;
    }
  }
}

function worldToScreen(_pos, _scale, _offset){
  let x = _scale[0]*(_pos[0]+_offset[0]+0.5*((_pos[1]+1)%2));
  let y = _scale[1]*(_pos[1]+_offset[1]);
  return [x,y];
}

function resetMaze(){
  let currentMaze = levels.mazes[levels.currentMaze];
  //resets player and enemy pos;
  currentMaze.player.pos = currentMaze.player.start;
  for(let i=0; i<currentMaze.enemies.length; i++){
    currentMaze.enemies[i].pos = currentMaze.enemies[i].start;
  }
}