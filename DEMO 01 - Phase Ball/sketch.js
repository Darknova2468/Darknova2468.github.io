// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class Ball {
  constructor(x, y){
    this.pos = [x, y];
    this.velocity = [random(-5, 5), random(-5, 5)];
    this.radius = random(15,30);
  }
  updatePos(Xmax, Ymax){
    for(let i=0; i<2; i++){
      this.pos[i] += this.velocity[i];
    }
    this.pos[0] = this.pos[0]+this.radius < 0 ? width-this.radius:this.pos[0];
    this.pos[0] = this.pos[0]-this.radius > width ? this.radius:this.pos[0];
    this.pos[1] = this.pos[1]+this.radius < 0 ? height-this.radius:this.pos[1];
    this.pos[1] = this.pos[1]-this.radius > height ? this.radius:this.pos[1];
    return[this.pos[0], this.pos[1]];
  }
}

let myBalls = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function mouseReleased(){
  myBalls.push(new Ball(mouseX, mouseY));
}

function draw() {
  background(220);
  fill(0);
  for(let i=0; i<myBalls.length; i++){
    let pos = myBalls[i].updatePos(width, height);
    circle(pos[0], pos[1], myBalls[i].radius*2);
  }
}