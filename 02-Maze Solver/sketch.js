// Escape the Island
// Alexander Ha
// October 9 2023
//
// Extra for Experts:
// - I did some cool things with saving things in text files, 
//   parsing through textures classes some other fun things 
//   'n' what not IDK I think its pretty cool

let levels;
let textures;
let buttons;
let backgrounds;

function preload(){
  createCanvas(800, 400);
  loadImage("Textures.png", function(texturePack){ 
    textures = new Textures(texturePack, [32, 32]);
  });

  loadStrings("levels.txt", function(data){
    levels = new Levels(data, 0);
  });
  loadImage("Buttons.png", function(buttonTextures){
    buttons = new Buttons(buttonTextures);
  });
  backgrounds = [223, color(0, 192, 236), 223];
}

function setup() {
  resizeCanvas(800, 400); 
  frameRate(24); 
}

function draw() {
  background(backgrounds[levels.gameState]);
  if(levels.gameState === 1){
    levels.mazes[levels.currentMaze].player.castNext(levels.mazes[levels.currentMaze]);
    levels.draw(levels.mazes[levels.currentMaze], textures.assets , levels.playerState);
  }
  buttons.draw(levels.gameState);
}

function keyTyped(){
  //Key binds for reset, prevMaze, and nextMaze
  if(keyCode === 82){
    levels.resetMaze(levels.currentMaze);
  }
  if(levels.currentMaze > 0){
    if(keyCode === 13){
      if(levels.currentMaze + 1 < levels.n){
        levels.resetMaze(levels.currentMaze);
        levels.currentMaze++;
      }
    }
    if(keyCode === 66){
      if(levels.currentMaze - 1 > 0){
        levels.resetMaze(levels.currentMaze);
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