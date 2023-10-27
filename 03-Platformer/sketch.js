// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class Island{
  constructor(_points, _tangents){
    this.points = _points;
    this.controls = _tangents;
  }
  draw(){
    stroke(255);
    strokeWeight(1);
    noFill();
    let scale = 40;
    for(let i=0; i<this.points.length; i++){
      let [x1, y1] = [this.points[i][0]*scale, this.points[i][1]*scale];
      let x2, y2;
      try{
        [x2, y2] = [this.points[i+1][0]*scale, this.points[i+1][1]*scale];
      }
      catch {
        [x2, y2] = [this.points[0][0]*scale, this.points[0][1]*scale];
      }
      let [x3, y3] = [this.controls[i*2][0]*scale, this.controls[i*2][1]*scale];
      let [x4, y4] = [this.controls[i*2+1][0]*scale, this.controls[i*2+1][1]*scale];
      bezier(x1,y1,x3,y3,x4,y4,x2,y2);
    }
    fill(255,0,0);
    for(let i=0; i<this.points.length; i++){
      circle(this.points[i][0]*scale, this.points[i][1]*scale, 5);
    }
    fill(0,255,255);
    for(let i=0; i<this.controls.length; i++){
      circle(this.controls[i][0]*scale, this.controls[i][1]*scale, 5);
    }
  }
}

let island;

function setup() {
  createCanvas(400, 400);
  island = new Island([
    [1.66,0],  
    [3,1],  
    [5,1.33], 
    [2,2],
    [1.5,3],
    [1,2],
    [0,1.5],
    [1,1]
  ],[
    [3,0],
    [2.85,0.70],
    [3.15,1.31],
    [5,1],
    [5,2],
    [2.27,1.57],
    [1.73,2.42],
    [2,3],
    [1,3],
    [1.35,2.35],
    [0.65, 1.65],
    [0,2],
    [0,1],
    [0.71,1.41],
    [1.29,0.59],
    [1,0]
  ]);
  console.log(island);
}

function draw() {
  background(0);
  island.draw();
}
