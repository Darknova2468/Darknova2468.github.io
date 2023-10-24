// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let myMap;
const dimension = [48, 16];

function setup() {
  createCanvas(900, 300);
  noStroke();
  myMap = new Array(dimension[0]);

  for(let i=0; i<dimension[0]; i++){
    myMap[i] = [0.5*(noise((i+1)/10)+noise(i))];
    for(let j=1; j<dimension[1]; j++){
      myMap[i].push(0.5*(noise((i+1)/10)+noise(sin(j)+i/10)));
    }
  }
}

function draw() {
  background(220);
  let cellSize = [width/myMap.length, height/myMap[0].length];

  for(let i=0; i<myMap.length; i++){
    for(let j=0; j<myMap[i].length; j++){
      if(j < 0.5*(sin(i)+3*sin(i*2)+3)+dimension[1]/5){
        fill(42, myMap[i][j]*255, myMap[i][j]*127);
      }
      else{
        fill(myMap[i][j]*165, myMap[i][j]*42, 42);
      }
      rect(i*cellSize[0], j*cellSize[1], cellSize[0], cellSize[1]);
    }
  }
}
