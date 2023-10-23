// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let r = 25;
let v = 2;
let t = 1;

function setup() {
  createCanvas(400, 400);
  fill(255);
}

function draw() {
  background(20);
  circle(width*6/7, height/7, width/7);
  stroke(225);
  for(let i=0; i<width+1; i++){
    line(i,height,i,height-noise((t+i)/600)*height);
  }
  let y = height - noise((t+width/4+1)/600)*height;
  let sin = y-(height - noise((t+width/4)/600)*height);
  let cosine = cos(asin(sin));
  fill(127);
  circle(width/4-sin*-r, y-Math.abs(cosine*-r), r*2);
  t+=Math.abs(cosine*v);
}
