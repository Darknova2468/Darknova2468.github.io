// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class Ball {
  constructor(x, y){
    this.pos = [x, y];
    this.radius = random(15,30);
    this.color = [Math.floor(random(0, 8)*32), Math.floor(random(0, 8)*32), Math.floor(random(0, 8)*32)];
    this.velocity = [0, 0];
    this.time = [random(0, 1000), random(0, 1000)];
  }
  update(Xmax, Ymax){
    this.time[0] += deltaTime;
    this.time[1] += deltaTime;

    this.velocity[0] = noise(this.time[0]*0.0001);
    this.velocity[1] = noise(this.time[1]*0.0001);
    this.velocity[0] = map(this.velocity[0], 0, 1, -5, 5);
    this.velocity[1] = map(this.velocity[1], 0, 1, -5, 5);
  
    for(let i=0; i<2; i++){
      this.pos[i] += this.velocity[i];
    }
    this.pos[0] = this.pos[0]+this.radius < 0 ? width-this.radius:this.pos[0];
    this.pos[0] = this.pos[0]-this.radius > width ? this.radius:this.pos[0];
    this.pos[1] = this.pos[1]+this.radius < 0 ? height-this.radius:this.pos[1];
    this.pos[1] = this.pos[1]-this.radius > height ? this.radius:this.pos[1];
    return[this.pos[0], this.pos[1]];
  }
  display(){
    fill(this.color);
    circle(this.pos[0], this.pos[1], this.radius*2);
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
  background(127);
  fill(0);
  myBalls.forEach(ball => {
    ball.update();
    ball.display();
  });
}