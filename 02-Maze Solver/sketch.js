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
let startScreen;
let theme;

function preload(){
  createCanvas(800, 400);
  let sfx;
  loadImage("Textures.png", function(texturePack){ 
    textures = new Textures(texturePack, [32, 32]);
  });
  loadSound("11 Fanfare Level Up.mp3", function(sfx1){
    loadSound("21 Pokédex Evaluation... No Good!.mp3", function(sfx2){
      loadSound("27 Picked Up an Item!.mp3", function(sfx3) {
        loadSound("79 Portal Sound.mp3", function(sfx4) {
          sfx = new SFX([sfx1, sfx2, sfx3, sfx4]);
          loadStrings("levels.txt", function(data){
            levels = new Levels(data, 0, sfx);
          });
        });
      });
    });
  });
  loadImage("Buttons.png", function(buttonTextures){
    buttons = new Buttons(buttonTextures);
  });
  backgrounds = [223, color(0, 192, 236), 223];
  startScreen = loadImage("Backgrounds.png");
  loadSound("03 Title Screen.mp3", function(song1){
    loadSound("10 Battle! (Trainer Battle).mp3", function(song2){
      loadSound("53 Ending.mp3", function(song3){
        theme = new Music([song1, song2, song3]);
      });
    });
  });
}

function setup() {
  resizeCanvas(800, 400); 
  frameRate(24); 
}

function draw() {
  background(backgrounds[levels.gameState]);
  theme.play(levels.gameState, levels.wait);
  if(levels.gameState === 0){
    image(startScreen, 0, 0, width, height);
    fill(0);
    textSize(70);
    textAlign(CENTER);
    text("ESCAPE THE ISLAND", width/2, height/4);
  }
  else if(levels.gameState === 1){
    levels.mazes[levels.currentMaze].player.castNext(levels.mazes[levels.currentMaze]);
    levels.draw(levels.mazes[levels.currentMaze], textures.assets, levels.playerState);
  }
  else{
    image(startScreen, 0, 0, width, height);
    fill(0);
    textSize(70);
    textAlign(CENTER);
    text("YOU ESCAPED\nTHE ISLAND", width/2, height/4);
  }
  buttons.draw(levels.gameState);
}

function keyTyped(){
  //Key binds for reset, prevMaze, and nextMaze
  if(keyCode === 82 && levels.playerState === true){
    levels.resetMaze(levels.currentMaze, false);
  }
  if(levels.currentMaze > 0){
    if(keyCode === 13 && levels.playerState === true){
      if(levels.currentMaze + 1 < levels.n){
        levels.resetMaze(levels.currentMaze, null);
        levels.currentMaze++;
      }
    }
    if(keyCode === 66 && levels.playerState === true){
      if(levels.currentMaze - 1 > 0){
        levels.resetMaze(levels.currentMaze, null);
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