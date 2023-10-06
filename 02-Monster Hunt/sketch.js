// Monster Hunt
// Alexander Ha
// 06/10/2023
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let you, them, wall;

function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(5);
  you = new player([100,100]);
  them = new enemy([200,200]);
  wall = new boundary([[50,150,150,50]]);
}

function draw() {
  background(220);
  fill("blue");
  circle(you.pos[0], you.pos[1], 50);
  fill("red");
  circle(them.pos[0], them.pos[1], 50);
}
