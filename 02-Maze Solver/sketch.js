// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let levels;
let textures;
let buttons;
let backgrounds;

function preload(){
  createCanvas(800, 400);
  loadImage("Textures.png", function(texturePack){ 
    textures = loadTextures(texturePack, [32,32]);
  });

  loadStrings("levels.txt", function(data){
    levels = new Levels(data, 0);
  });

  buttons = new Buttons();

  backgrounds = [223, color(0, 192, 236), 223];
}

function setup() {
  resizeCanvas(800, 400); 
  frameRate(24); 
}

function draw() {
  background(backgrounds[levels.gameState]);
  buttons.draw(levels.gameState);
  if(levels.gameState === 1){
    levels.mazes[levels.currentMaze].player.castNext(levels.mazes[levels.currentMaze]);
    levels.draw(levels.mazes[levels.currentMaze], textures, levels.playerState);
  }
}

function keyTyped(){
  //Key binds for reset, prevMaze, and nextMaze
  if(keyCode === 82){
    levels.resetMaze();
  }
  if(levels.currentMaze > 0){
    if(keyCode === 13){
      if(levels.currentMaze + 1 < levels.n){
        levels.currentMaze++;
      }
    }
    if(keyCode === 66){
      if(levels.currentMaze - 1 > 0){
        levels.currentMaze--;
      }
    }
  }
}

function mouseReleased(){
  buttons.clicked(levels);
  //moves player and enemies;
  if(levels.gameState === 1){
    levels.click();
  }
}