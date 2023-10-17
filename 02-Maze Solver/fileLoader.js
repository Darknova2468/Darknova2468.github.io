class Maze {
  constructor(_id, _mazeMap, _textureMap, _dimension, _player, _end, _enemies, _portals, _powerUps){
    this.id = _id;
    this.mazeMap = _mazeMap;
    this.textureMap = _textureMap;
    this.dimension = _dimension;
    this.player = _player;
    this.playerPortals = _portals;
    this.end = _end;
    this.enemies = _enemies;
    this.graph = new Graph(this.mazeMap, this.dimension);
    this.cellSize;
    this.offset;
    this.powerUps = _powerUps;
    this.autoScale(_dimension);
  }
  autoScale(_dimension) {
    let xRatio = (_dimension[1]+2)/(_dimension[0]+2.5);
    let yRatio = (_dimension[0]+2.5)/(_dimension[1]+2);
    if(width*xRatio*2 < height*yRatio){
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

function loadLevels(_data){
  let direction = [
    [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,0]],
    [[-1,-1],[0,-1],[1,0],[0,1],[-1,1],[-1,0]]
  ];
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
    let textureMap = new Array(dimension[0]);
    for(let j=0; j<textureMap.length; j++){
      textureMap[j] = new Array(dimension[1]).fill(null);
    }
    for(let j=0; j<dimension[0]; j++){
      for(let k=0; k<dimension[1]; k++){
        if(mazeMap[j][k] === 1 ||
           mazeMap[j][k] > 2){
          textureMap[j][k] = [1];
          for(let l=0; l<6; l++){
            let x = j+direction[k%2][l][0];
            let y = k+direction[k%2][l][1];
            if(x >= 0 && x <dimension[0] &&
               y >= 0 && y <dimension[1]){
              if(mazeMap[x][y] === 2 ||
                 mazeMap[x][y] === 0){
                textureMap[j][k].push(l+9);
              }
            }
            else {
              textureMap[j][k].push(l+9);
            }
          }
          if(mazeMap[j][k] === 4) {
            textureMap[j][k].push(3);
          }
          if(mazeMap[j][k] === 5) {
            textureMap[j][k].push(17);
          }
          if(mazeMap[j][k] > 5){
            textureMap[j][k].push(mazeMap[j][k]-2);
          }
        }
        if(mazeMap[j][k] === 2){
          textureMap[j][k] = [0];
          if(random() < 0.3){
            textureMap[j][k].push(15);
          }
          else if(random() > 0.7){
            textureMap[j][k].push(16);
          }
        }
      }
    }
    let start = new Player(_data.shift().split(",", 2).map(Number));
    let end = _data.shift().split(",", 2).map(Number);
    let enemies = [];
    let enemyNumber =_data.shift();
    for(let i=0; i<enemyNumber; i++){
      enemies.push(new Enemy(_data.shift().split(",", 2).map(Number)));
    }
    let powerUps = [];
    let powerUpNumber = _data.shift();
    for(let i=0; i<powerUpNumber; i++){
      powerUps.push(new PowerUp(_data.shift().split(",", 2).map(Number)));
    }
    let portals = [];
    for(let i=0; i<mazeMap.length; i++){
      for(let j=0; j<mazeMap.length; j++){
        if(mazeMap[i][j] === 6 || mazeMap[i][j] === 7){
          portals.push([i,j]);
        }
      }
    }
    levels.push(new Maze(i, mazeMap, textureMap, dimension, start, end, enemies, portals, powerUps));
  }
  return levels;
}

function loadTextures(_texturePack, _size){
  let assets = [];
  for(let j=0; j<_texturePack.height; j+= _size[1]){
    for(let i=0; i<_texturePack.width; i+= _size[0]){
      let newAsset = _texturePack.get(i, j, _size[0], _size[1]);
      assets.push(newAsset);
    }
  }
  return assets;
}