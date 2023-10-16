// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let levels;
let textures;
let gameState = 0;
let playerState = true;
let startButtons;
let levelButtons;
let endButtons;
let backgrounds;

function preload(){
  createCanvas(600, 300);
  loadImage("Textures.png", function(texturePack){ 
    textures = loadTextures(texturePack, [32,32]);
  });
  loadStrings("levels.txt", function(data){
    levels = {
      mazes: loadLevels(data, ),
      currentMaze: 0,
      mazeNumbers: 6
    };
  });
  startButtons = {
    text: ["Play", "Tutorial", "Level Select"],
    buttons: createButtons(3, width/2, height/8, height/6)
  };
  levelButtons = {
    text: ["<"],
    buttons: [width*7/8, height/4, 50]
  };
  endButtons = {
    text: ["Back to Home"],
    buttons: createButtons(1, width/2, height/8, height/6)
  };
  backgrounds = [192, color(0, 192, 236), 192];
}
function setup() {
  console.log(levels);
  console.log(textures);
  resizeCanvas(600, 300); 
  frameRate(24); 
  textAlign(CENTER);
}

function draw() {
  background(backgrounds[gameState]);
  if(gameState === 0){
    startScreen();
  }
  else if(gameState < 2){
    levels.mazes[levels.currentMaze].player.castNext(levels.mazes[levels.currentMaze]);
    //draws maze;
    drawMaze(levels.mazes[levels.currentMaze], textures);
  }
  else {
    endScreen();
  }
}

function keyTyped(){
  //Key binds for reset, and nextMaze
  if(keyCode === 82){
    resetMaze();
  }
  if(keyCode === 13){
    if(levels.currentMaze + 1 < levels.mazeNumbers){
      levels.currentMaze++;
    }
  }
}

function mouseReleased(){
  if(gameState === 0){
    //buttons
    for(let i=0; i<startButtons.text.length; i++){
      let [x,y,w,h] = startButtons.buttons[i];
      if(mouseX > x && mouseX < x+w &&
         mouseY > y && mouseY < y+h){
        if(i === 0){
          levels.currentMaze = 1;
          gameState = 1;
        }
        else if(i === 1){
          levels.currentMaze = 0;
          gameState = 1;
        }
        else {
          console.log("do something");
        }
      }
    }
  }
  //moves player and enemies;
  else if(gameState === 1){
    if(levels.mazes[levels.currentMaze].player.nextPos !== null && playerState){
      let currentMaze = levels.mazes[levels.currentMaze];
      if(currentMaze.player.nextPos[2] !== true){
        currentMaze.player.updatePos();
      }
      //if an enemy is killed reset their spawn point
      else{
        currentMaze.enemies[currentMaze.player.nextPos[3]].pos = currentMaze.enemies[currentMaze.player.nextPos[3]].start;
        currentMaze.enemies[currentMaze.player.nextPos[3]].isDead = true;
        currentMaze.player.powerUp = false;
      }
      playerState = false;
      sleep(200).then(() =>{
        for(let i=0; i<levels.mazes[levels.currentMaze].enemies.length; i++){
          currentMaze.enemies[i].updatePos(
            currentMaze.graph, 
            currentMaze.player.pos, 
            currentMaze.dimension);
        }
        playerState = true;
        //checks if you are dead
        for(let i=0; i<currentMaze.enemies.length; i++){
          if(currentMaze.player.pos[0] === currentMaze.enemies[i].pos[0] &&
            currentMaze.player.pos[1] === currentMaze.enemies[i].pos[1]){
            resetMaze();
            break;
          }
        }  
        //checks if you have grabbed a powerUp
        for(let i=0; i<currentMaze.powerUps.length; i++){
          if(currentMaze.player.pos[0] === currentMaze.powerUps[i].pos[0] &&
            currentMaze.player.pos[1] === currentMaze.powerUps[i].pos[1] &&
            currentMaze.powerUps[i].grabbed === false){
            currentMaze.player.powerUp = true;
            currentMaze.powerUps[i].grabbed = true;
            break;
          }
        }  
        //checks if you have beat the level
        if(currentMaze.end[0] === currentMaze.player.pos[0] &&
          currentMaze.end[1] === currentMaze.player.pos[1]){
          if(levels.currentMaze === 0){
            resetMaze();
            gameState = 0;
          }
          else if(levels.currentMaze + 1 < levels.mazeNumbers){
            resetMaze();
            levels.currentMaze++;
          }
          else {
            resetMaze();
            gameState = 2;
          }
        }
      });
    }
  }
  else {
    //buttons
    for(let i=0; i<endButtons.text.length; i++){
      let [x,y,w,h] = endButtons.buttons[i];
      if(mouseX > x && mouseX < x+w &&
         mouseY > y && mouseY < y+h){
        gameState = 0;
      }
    }
  }
}

function startScreen(){
  textSize(height/10); 
  for(let i=0; i<startButtons.text.length; i++){
    let [x, y, w, h] = startButtons.buttons[i];
    fill(192);
    rect(x, y, w, h, h*0.25);
    fill(0);
    text(startButtons.text[i], x+w/2, y+height/10);
  }
}

function drawMaze(_maze, _textures){
  //draws map;
  for(let j=0; j<_maze.dimension[1]; j++){
    for(let i=0; i<_maze.dimension[0]; i++){
      if(_maze.textureMap[i][j] !== null){
        let [x, y] = worldToScreen([i,j], _maze.cellSize, _maze.offset);
        for(let k=0; k<_maze.textureMap[i][j].length; k++){
          image(_textures[_maze.textureMap[i][j][k]], x, y, _maze.cellSize[0], _maze.cellSize[0]);
        }
      }
    }
  }
  //draws player;
  fill(0, 255, 0);
  let [x, y] = worldToScreen(_maze.player.pos, _maze.cellSize, _maze.offset);
  ellipse(x+_maze.cellSize[1], y+_maze.cellSize[1]/1.25, _maze.cellSize[1], _maze.cellSize[1]*0.5);

  //draws enemies;
  fill(255, 165, 0);
  for(let i=0; i<_maze.enemies.length; i++){
    let [x, y] = worldToScreen(_maze.enemies[i].pos, _maze.cellSize, _maze.offset);
    ellipse(x+_maze.cellSize[1], y+_maze.cellSize[1]/1.25, _maze.cellSize[1], _maze.cellSize[1]*0.5);
  }
    
  //draw players next move;
  if(_maze.player.nextPos !== null && playerState){
    let [x, y] = worldToScreen(_maze.player.nextPos, _maze.cellSize, _maze.offset);
    if(_maze.player.nextPos[2] === true){
      fill(255, 0, 0);
    }
    else {
      fill(0, 255, 0);
    }
    ellipse(x+_maze.cellSize[1], y+_maze.cellSize[1]/1.25, _maze.cellSize[1], _maze.cellSize[1]/2);
    if(_maze.player.nextPos[2] === true){
      fill(255, 165, 0);
    }
    else {
      fill(192);
    }
    ellipse(x+_maze.cellSize[1], y+_maze.cellSize[1]/1.25, _maze.cellSize[1]/2, _maze.cellSize[1]/4);
  }

  //draws PowerUps
  fill(128, 0, 128);
  for(let i=0; i<_maze.powerUps.length; i++){
    if(_maze.powerUps[i].grabbed === false){
      let [x, y] = worldToScreen(_maze.powerUps[i].pos, _maze.cellSize, _maze.offset);
      image(_textures[2], x, y, _maze.cellSize[0], _maze.cellSize[0]);
    }
  }
}

function resetMaze(){
  let currentMaze = levels.mazes[levels.currentMaze];
  //resets player power ups and enemy pos;
  currentMaze.player.pos = currentMaze.player.start;
  for(let i=0; i<currentMaze.enemies.length; i++){
    currentMaze.enemies[i].pos = currentMaze.enemies[i].start;
  }
  for(let i=0; i<currentMaze.powerUps.length; i++){
    currentMaze.powerUps[i].grabbed = false;
  }
}

function worldToScreen(_pos, _scale, _offset){
  //converts world coordinates to screen cordinates
  let x = _scale[0]*(_pos[0]+_offset[0]+0.5*((_pos[1]+1)%2));
  let y = _scale[1]*(_pos[1]+_offset[1]);
  return [x,y];
}

function sleep(_ms) {
  //calls a funciton after x amount of time
  return new Promise(resolve => setTimeout(resolve, _ms));
}

function endScreen(){
  //draws end screen
  textSize(50);
  text("YOU WIN", width/2, height/3);
  textSize(height/10);
  for(let i=0; i<endButtons.text.length; i++){
    let [x, y, w, h] = endButtons.buttons[i];
    fill(192);
    rect(x, y, w, h, h*0.25);
    fill(0);
    text(endButtons.text[i], x+w/2, y+height/10);
  }
}

function createButtons(_n, _width, _height, _spacing){
  //auto-generates button placement
  let buttons = [];
  let x = (width-_width)/2;
  let y = (height-_n*_spacing)/2;
  for(let i=0; i<_n; i++){
    buttons.push([x, y+i*_spacing, _width, _height]);
  }
  return buttons;
}