class Maze {
  constructor(_id, _mazeMap, _dimension, _player, _end, _enemies){
    this.id = _id;
    this.mazeMap = _mazeMap;
    this.dimension = _dimension;
    this.player = _player;
    this.playerPortals = findPortals(_mazeMap);
    this.end = _end;
    this.enemies = _enemies;
    this.graph = new Graph(this.mazeMap, this.dimension);
    this.cellSize;
    this.offset;
    this.autoScale(_dimension);
  }
  autoScale(_dimension){
    let xRatio = (_dimension[1]+2)/(_dimension[0]+2.5);
    let yRatio = (_dimension[0]+2.5)/(_dimension[1]+2);
    if(width*xRatio < height*yRatio){
      let yScale = height/(_dimension[1]+2);
      let yOffset = 1;
      let xScale = yScale*2;
      let xOffset = (width-xScale*_dimension[0])/(1.25*xScale);
      this.cellSize = [xScale, yScale];
      this.offset = [xOffset, yOffset];
    }
    else{
      let xScale = width/(_dimension[0]+2.5);
      let xOffset = 1.5;
      let yScale = xScale/2;
      let yOffset = (height-yScale*_dimension[1])/(1.5*yScale);
      this.cellSize = [xScale, yScale];
      this.offset = [xOffset, yOffset];
    }
  }
}



function findPortals(_mazeMap){
  let portals = [];
  for(let i=0; i<_mazeMap.length; i++){
    for(let j=0; j<_mazeMap.length; j++){
      if(_mazeMap[i][j] === 6 || _mazeMap[i][j] === 7){
        portals.push([i,j]);
      }
    }
  }
  return portals;
}

function loadLevels(_data){
  let levels = [];
  let levelNumber = _data.shift();
  for(let i=0; i<levelNumber; i++){
    let dimension = _data.shift().split(",", 2).map(Number);
    dimension = [parseInt(dimension[0]), parseInt(dimension[1])];
    let mazeMap = new Array(dimension[0]);
    for(let j=0; j<mazeMap.length; j++){
      mazeMap[j] = new Array(dimension[1]).fill(null);
    }
    for(let j=0; j<dimension[1]; j++){
      let row = _data.shift().split(",", dimension[0]).map(Number);
      for(let k=0; k<dimension[0]; k++){
        mazeMap[k][j] = row.shift();
      }
    }
    let start = new Player(_data.shift().split(",", 2).map(Number));
    let end = _data.shift().split(",", 2).map(Number);
    let enemies = [];
    let enemyNumber =_data.shift();
    for(let i=0; i<enemyNumber; i++){
      enemies.push(new Enemy(_data.shift().split(",", 2).map(Number)));
    }
    levels.push(new Maze(i, mazeMap, dimension, start, end, enemies));
  }
  return levels;
}