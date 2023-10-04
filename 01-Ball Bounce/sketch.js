//CS-30, Alexander Ha, Period 3, Interactive Scene, October 2 2023

//for extra for experts if it counts I used classes not sure if thats valid tho lol

//instantiates global variables the player and credit object the position of the ball distance of the cursor to the player the time the game started the state of the game the number of points youve accumulated and the length of the game respectivley
let player, credit, pos, d, time;
let points = 0;
let state = 0;
let timer = 10;

function setup() {
  //draws canvas
  createCanvas(400, 400);
  
  //defining the balls parameters including boundaries
  player = new ball([width / 2, 15], [0, 0], 15);
  player.addBoundary([0, 0, width, 0]);
  player.addBoundary([0, 0, 0, height]);
  player.addBoundary([width, 0, width, height]);
  player.addBoundary([0, height, width, height]);
  
  //defines the credit you try and hit
  credit = new coin([width / 2, height / 2], 10);
  
  //defines the overall draw loop properties
  fill(255);
  stroke(255);
  strokeWeight(2);
}

function draw() {
  background(40);

  //state 0 tells us that the screen is in the start screen
  //state 1 tells us the game has begun
  //state 2 tells us that the game is over
  
  if (state === 0) {
    //draw the start screen
    startScreen();
    
  } 
  else if (state === 1) {
    //draws the trajectory of the ball
    if (mouseIsPressed) {
      line(pos[0], height - pos[1], mouseX, mouseY);
    }
    
    //draws ui
    drawUI();
    
    //checks if time is up
    if ((millis() - time) / 1000 > timer) {
      state = 2;
    }
    
  } 
  else {
    //draws end screen
    endScreen();
  }

  //updates the players position
  pos = player.updatePos(1 / 60);
  let creditpos = credit.getPosition();

  //checks if you got a point
  if (credit.checkCollision(pos, player.getRadius())) {
    points += 1;
    state = 1;
  }

  //draws the player and credit
  circle(pos[0], height - pos[1], player.getRadius() * 2 - 2);
  circle(creditpos[0], height - creditpos[1], credit.getRadius() * 2 - 2);
}

function mouseReleased() {
  //updates the velocity of the ball when the player interacts with it
  if (state < 2) {
    let i, j;
    d = Math.abs(dist(pos[0], height - pos[1], mouseX, height - mouseY));
    d = d > 150 ? 15 : d / 10;
    let slope = atan((mouseX - pos[0]) / (mouseY - (height - pos[1])));
    i = mouseX > pos[0] ? 1 : -1;
    j = mouseY > height - pos[1] ? -1 : 1;
    player.updateVelocity([
      i * d * Math.abs(sin(slope)),
      j * d * Math.abs(cos(slope)),
    ]);
  } 
  else {
    state = 0;
    timer = 10;
    time = 0;
    points = 0;
    player.setPosition([width / 2, 15]);
    credit.setPosition([width / 2, height / 2]);
  }
}

//draws start screen
function startScreen() {
  textSize(50);
  textAlign(CENTER);
  text("BALL BOUNCE", width / 2, height / 2 - 25);
  textSize(20);
  text("(click the ball to begin)", width / 2, height / 2 + 30);
  textAlign(RIGHT);
  time = millis();
}

//draws end screen
function endScreen() {
  textSize(50);
  textAlign(CENTER);
  text("TIMES UP", width / 2, height / 2 - 25);
  textSize(20);
  text(
    "Press to Play Again \n \n Your Score \n" + points + " points",
    width / 2,
    height / 2
  );
}

//draws UI
function drawUI() {
  text("Points: " + points, 375, 40);
  text(Math.round(timer - (millis() - time) / 1000) + "s", 375, 65);
}