// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class Island{
  constructor(_island){
    this.points = this.parsePoints(_island);
  }
  parsePoints(_island){
    let points = [];

    for(let i=0; i<_island.length; i++){
      if(_island[i][0] === 1){
        points.push([i, 0]);
        break;
      }
    }

    let direction = 0;
    let pos = structuredClone(points[0]);
    pos[direction%2] += direction *0.5 < 1 ? 1:-1;

    while(pos[0] !== points[0][0] || pos[1] !== points[0][1]){
      let state = this.checkCase(_island, direction, pos);
      if(state < 2){
        let nextPoint = structuredClone(pos);
        nextPoint[direction%2] += direction *0.5 < 1 ? 1:-1;
        points.push(nextPoint);
        direction = this.rotate(state, direction, 3);
      }
      pos[direction%2] += direction *0.5 < 1 ? 1:-1;
      console.log(pos, direction);
    }
    console.log(points);
    return points;
  }

  checkCase(_island, _dir, _pos){
    for(let i=0; i<2; i++){
      _pos[_dir%2] += _dir *0.5 < 1 ? 1:-1;
      if(_pos[0] > -1 && _pos[0] <_island.length &&
         _pos[1] > -1 && _pos[1] <_island[0].length){
        if(_island[_pos[0]][_pos[1]] === i){
          return i;
        }
      }
      else {
        return 0;
      }
      this.rotate(1, _dir, 3);
    }
    return 2;
  }

  rotate(_sign, _value, _limit){
    if(_sign === 1){
      if(_value === _limit){
        return 0;
      }
      return _value++;
    }
    if(_value === 0){
      return _limit;
    }
    return _value--;
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
    [0, 1, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 0, 0, 0]
  ]);
}

function draw() {
  background(0);
}
