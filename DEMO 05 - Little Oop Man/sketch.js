// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class ManWithDimenstia {
  constructor(_name, _pos, _speed, _size, _color){
    this.name = _name;
    this.pos = _pos;
    this.speed = _speed;
    this.size = _size;
    this.color = _color;
  }
  walk() {
    let direction = Math.floor(random(0, 2));
    let speed = random(this.speed*2)-this.speed;
    this.pos[direction%2] += speed;
    fill(this.color);
    circle(this.pos[0]*this.size, this.pos[1]*this.size, this.size);
  }
}

let oopMans = [];

function setup() {
  createCanvas(600, 300);
  background(220);
  noStroke();
  oopMans.push(new ManWithDimenstia("bob", [40, 30], 2, 5, "blue"));
  oopMans.push(new ManWithDimenstia("bill", [80, 30], 2, 5, "red"));
  frameRate(15);
}

function draw() {
  oopMans.forEach(man => {
    man.walk();
  });
}
