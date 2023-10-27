// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const dimension = [40, 40];
let cellSize;
let grid;
let state = false;

function setup() {
  createCanvas(400, 400);
  cellSize = [width/dimension[0], height/dimension[1]];
  grid = new Array(dimension[0]);
  for(let i=0; i<dimension[0]; i++){
    grid[i] = new Array(dimension[1]).fill(false);
  }
  frameRate(10);
}

function mouseReleased(){
  if(!state){
    let x = floor(mouseX/cellSize[0]);
    let y = floor(mouseY/cellSize[1]);
    if(x > -1 && x < dimension[0] &&
       y > -1 && y < dimension[1]){
      grid[x][y] = !grid[x][y];
    }
  }
}

function keyTyped(){
  if(keyCode === ENTER){
    state = !state;
  }
  if(!state && keyCode === 82){
    grid = randomGrid();
  }
}

function draw() {
  background(220);
  if(state){
    grid = evaluate(grid);
  }
  for(let i=0; i<dimension[0]; i++){
    for(let j=0; j<dimension[1]; j++){
      fill(grid[i][j]*255);
      rect(i*cellSize[0], j*cellSize[1], cellSize[0], cellSize[1]);
    }
  }
}

function evaluate(grid){
  let newGrid = new Array(dimension[0]);
  for(let i=0; i<dimension[0]; i++){
    newGrid[i] = new Array(dimension[1]).fill(false);
  }
  for(let i=0; i<dimension[0]; i++){
    for(let j=0; j<dimension[1]; j++){
      let sum = findNeighbours(grid, [i,j]);
      if(grid[i][j]  === true){
        if(sum === 2 || sum === 3){
          newGrid[i][j] = true;
        }
      }
      else{
        if(sum === 3){
          newGrid[i][j] = true;
        }
      }
    }
  }
  return newGrid;
}

function findNeighbours(_grid, _pos){
  let sum = 0;
  for(let i=0; i<8; i++){
    let x = (1-2*(i<3))*(i!==3&i!==4);
    let z = (i-x+1)%3;
    let y = (1-2*(z===1))*(z!==0);
    try{
      sum += _grid[_pos[0]+x][_pos[1]+y];
    }
    catch{
      sum += 0;
    }
  }
  return sum;
}

function randomGrid(){
  for(let i=0; i<grid.length; i++){
    for(let j=0; j<grid[i].length; j++){
      grid[i][j] = random()>0.5;
    }
  }
}