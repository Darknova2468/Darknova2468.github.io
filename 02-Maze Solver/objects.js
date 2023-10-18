class Levels {
  constructor(_data, _gameState){
    let direction = [
      [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,0]],
      [[-1,-1],[0,-1],[1,0],[0,1],[-1,1],[-1,0]]
    ];
    this.mazes = [];
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
      this.mazes.push(new Maze(i, mazeMap, textureMap, dimension, start, end, enemies, portals, powerUps));
    }
    this.currentMaze = 0;
    this.n = 6;
    this.gameState = _gameState;
    this.playerState = true;
  }
  draw(_maze, _textures){
  //draws map;
    for(let j=0; j<_maze.dimension[1]; j++){
      for(let i=0; i<_maze.dimension[0]; i++){
        if(_maze.textureMap[i][j] !== null){
          let [x, y] = this.worldToScreen([i,j], _maze.cellSize, _maze.offset);
          for(let k=0; k<_maze.textureMap[i][j].length; k++){
            image(_textures[_maze.textureMap[i][j][k]], x, y, _maze.cellSize[0], _maze.cellSize[0]);
          }
        }
      }
    }
    //draws player;
    fill(0, 255, 0);
    let [x, y] = this.worldToScreen(_maze.player.pos, _maze.cellSize, _maze.offset);
    ellipse(x+_maze.cellSize[1], y+_maze.cellSize[1]/1.25, _maze.cellSize[1], _maze.cellSize[1]*0.5);

    //draws enemies;
    fill(255, 165, 0);
    for(let i=0; i<_maze.enemies.length; i++){
      let [x, y] = this.worldToScreen(_maze.enemies[i].pos, _maze.cellSize, _maze.offset);
      ellipse(x+_maze.cellSize[1], y+_maze.cellSize[1]/1.25, _maze.cellSize[1], _maze.cellSize[1]*0.5);
    }
    
    //draw players next move;
    if(_maze.player.nextPos !== null && this.playerState){
      let [x, y] = this.worldToScreen(_maze.player.nextPos, _maze.cellSize, _maze.offset);
      image(_textures[7+(_maze.player.nextPos[2] === true)], x, y, _maze.cellSize[0], _maze.cellSize[0]);
    }

    //draws PowerUps
    for(let i=0; i<_maze.powerUps.length; i++){
      if(_maze.powerUps[i].grabbed === false){
        let [x, y] = this.worldToScreen(_maze.powerUps[i].pos, _maze.cellSize, _maze.offset);
        image(_textures[2], x, y, _maze.cellSize[0], _maze.cellSize[0]);
      }
    }
  }
  resetMaze(){
    let currentMaze = this.mazes[this.currentMaze];
    //resets player power ups and enemy pos;
    currentMaze.player.pos = currentMaze.player.start;
    for(let i=0; i<currentMaze.enemies.length; i++){
      currentMaze.enemies[i].pos = currentMaze.enemies[i].start;
    }
    for(let i=0; i<currentMaze.powerUps.length; i++){
      currentMaze.powerUps[i].grabbed = false;
    }
  }
  worldToScreen(_pos, _scale, _offset){
    //converts world coordinates to screen cordinates
    let x = _scale[0]*(_pos[0]+_offset[0]+0.5*((_pos[1]+1)%2));
    let y = _scale[1]*(_pos[1]+_offset[1]);
    return [x,y];
  }
  sleep(_ms) {
    //calls a funciton after x amount of time
    return new Promise(resolve => setTimeout(resolve, _ms));
  }
  click(){
    if(this.mazes[this.currentMaze].player.nextPos !== null && this.playerState){
      let currentMaze = this.mazes[this.currentMaze];
      if(currentMaze.player.nextPos[2] !== true){
        currentMaze.player.updatePos();
      }
      //if an enemy is killed reset their spawn point
      else{
        currentMaze.enemies[currentMaze.player.nextPos[3]].pos = currentMaze.enemies[currentMaze.player.nextPos[3]].start;
        currentMaze.enemies[currentMaze.player.nextPos[3]].isDead = true;
        currentMaze.player.powerUp = false;
      }
      this.playerState = false;
      this.sleep(200).then(() =>{
        for(let i=0; i<this.mazes[this.currentMaze].enemies.length; i++){
          currentMaze.enemies[i].updatePos(
            currentMaze.graph, 
            currentMaze.player.pos, 
            currentMaze.dimension);
        }
        this.playerState = true;
        //checks if you are dead
        for(let i=0; i<currentMaze.enemies.length; i++){
          if(currentMaze.player.pos[0] === currentMaze.enemies[i].pos[0] &&
            currentMaze.player.pos[1] === currentMaze.enemies[i].pos[1]){
            this.resetMaze();
            break;
          }
        }  
        //checks if you have grabbed a powerUp
        for(let i=0; i<currentMaze.powerUps.length; i++){
          if(currentMaze.player.pos[0] === currentMaze.powerUps[i].pos[0] &&
            currentMaze.player.pos[1] === currentMaze.powerUps[i].pos[1] &&
            currentMaze.powerUps[i].grabbed === false){
            currentMaze.player.powerUp = true;
            currentMaze.powerUps[i].grabbed = true;
            break;
          }
        }  
        //checks if you have beat the level
        if(currentMaze.end[0] === currentMaze.player.pos[0] &&
          currentMaze.end[1] === currentMaze.player.pos[1]){
          if(this.currentMaze === 0){
            this.resetMaze();
            this.gameState = 0;
          }
          else if(this.currentMaze + 1 < this.n){
            this.resetMaze();
            this.currentMaze++;
          }
          else {
            this.resetMaze();
            this.gameState = 2;
          }
        }
      });
    } 
  }
}

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

class Textures{
  constructor(_texturePack, _size){
    this.assets = [];
    for(let j=0; j<_texturePack.height; j+= _size[1]){
      for(let i=0; i<_texturePack.width; i+= _size[0]){
        let newAsset = _texturePack.get(i, j, _size[0], _size[1]);
        this.assets.push(newAsset);
      }
    }
  }
}

class Buttons{
  constructor(_textures) {
    this.functions = [
      function(_levels) {
        _levels.currentMaze = 1;
        _levels.gameState = 1;
      },
      function(_levels) {
        _levels.currentMaze = 0;
        _levels.gameState = 1;
      },
      function(_levels) {
        console.log("do something");
      },
      function(_levels) {
        _levels.gameState = 0;
        _levels.resetMaze();
      },
      function(_levels) {
        _levels.gameState = 0;
      }
    ];
    this.state = [0,0,0,1,2];
    this.textureProperties = [
      [72,9,true],
      [72,9,true],
      [72,9,true],
      [18,18,false],
      [72,9,true]
    ];
    this.dimensions = [
      [width/4, height/3, width/2, height/8],
      [width/4, height/3+height/6, width/2, height/8],
      [width/4, height/3+2*height/6, width/2, height/8],
      [width*21/24, height/12, height/6, height/6],
      [width/4, height/3, width/2, height/8]
    ];
    this.loadButtons(_textures, this.textureProperties);
  }
  loadButtons(_textures, _properties){
    this.textures = [];
    let [x, y] = [0, 0];
    for(let i = 0; x < _textures.width && y < _textures.height; i++){
      x=0;
      let newAsset = [];
      newAsset.push(_textures.get(x, y, _properties[i][0], _properties[i][1])); 
      if(_properties[i][2]){
        y+=_properties[i][1];
      }
      else{
        x+=_properties[i][0];
      }
      newAsset.push(_textures.get(x, y, _properties[i][0], _properties[i][1]));
      this.textures.push(newAsset);
      y+=_properties[i][1];
    }
    console.log(this.textures);
  }
  draw(_gameState){
    textAlign(CENTER);
    textSize(height/10); 
    for(let i=0; i<this.textures.length; i++){
      if(this.state[i] === _gameState){
        let [x, y, w, h] = this.dimensions[i];
        let hover = 1*(mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h);
        image(this.textures[i][hover], x, y, w , h);
      }
    }
  }
  clicked(_levels){
    for(let i=0; i<this.functions.length; i++){
      if(this.state[i] === _levels.gameState){
        let [x, y, w, h] = this.dimensions[i];
        if(mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h){
          this.functions[i](_levels);
        }
      }
    }
  }
}