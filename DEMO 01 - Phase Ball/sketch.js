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
    this.pos[0] = Math.abs(this.pos[0])%(Xmax+2*this.radius);
    this.pos[1] = Math.abs(this.pos[1])%(Ymax+2*this.radius);
    return[this.pos[0]-this.radius, this.pos[1]-this.radius];
  }
}

let myBall;

function setup() {
  createCanvas(windowWidth, windowHeight);
  let r = random(15,30);
  myBall = new ball(random(width-r)+r, random(height-r)+r, random(-5, 5), random(-5, 5), r);
  fill(0);
}

function draw() {
  background(220);
  let pos = myBall.updatePos(width, height);
  circle(pos[0], pos[1], myBall.radius*2);
}
