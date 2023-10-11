class Maze {
  constructor(_id, _mazeMap, _dimension, _player, _end, _enemies){
    this.id = _id;
    this.mazeMap = _mazeMap;
    this.dimension = _dimension;
    this.player = _player;
    this.end = _end;
    this.enemies = _enemies;
    this.graph = new Graph(this.mazeMap, this.dimension);
    if(width/2 < height){
      this.cellSize = [width/10, width/20];
    }
    else {
      this.cellSize = [height/5, height/10];
    }
  }
}

function loadLevels(_data){
  let levels = [];
  let levelNumber = _data.shift()
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