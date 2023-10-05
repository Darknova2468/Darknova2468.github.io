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
  updatePos(Xmin, Xmax, Ymin, Ymax){
    for(let i=0; i<2; i++){
      this.pos[i] += this.velocity[i];
    }
    this.pos[0] = this.pos[0]<Xmin-this.radius ? Xmax-this.radius:this.pos[0];
    this.pos[0] = this.pos[0]>Xmax+this.radius ? Xmin+this.radius:this.pos[0];
    this.pos[1] = this.pos[1]<Ymin-this.radius ? Ymax-this.radius:this.pos[1];
    this.pos[1] = this.pos[1]>Ymax+this.radius ? Ymin+this.radius:this.pos[1];
  }
}

let myBall = new ball(100, 100, 3, 4, 25);

function setup() {
  createCanvas(windowWidth, windowHeight);
  fill(0);
}

function draw() {
  background(220);
  myBall.updatePos(0, width, 0, height);
  circle(myBall.pos[0], myBall.pos[1], myBall.radius*2);
  console.log(myBall);
}
