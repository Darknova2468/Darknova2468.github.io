// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class ball {
  constructor(x, y, dx, dy, r){
    this.pos = [x, y];
    this.velocity = [dx, dy];
    this.radius = r;
  }
  updatePos(Xmax, Ymax){
    for(let i=0; i<2; i++){
      this.pos[i] += this.velocity[i];
    }
    this.pos[0] = (this.pos[0]-this.radius)%(Xmax-this.radius*2)+this.radius;
    this.pos[1] = (this.pos[1]-this.radius)%(Ymax-this.radius*2)+this.radius;
  }
}

let myBall = new ball(100, 100, 3, 4, 25);

function setup() {
  createCanvas(windowWidth, windowHeight);
  fill(0);
}

function draw() {
  background(220);
  myBall.updatePos(width, height);
  circle(myBall.pos[0], myBall.pos[1], myBall.radius*2);
}
