class Levels {
  constructor(_data, _gameState, _sfx){
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
      this.mazes.push(new Maze(i, mazeMap, dimension, start, end, enemies, portals, powerUps));
    }
    this.currentMaze = 0;
    this.n = 8;
    this.gameState = _gameState;
    this.playerState = true;
    this.wait = false;
    this.sfx = _sfx;
    this.isWaiting = false;
  }
  draw(_maze, _textures){
  //draws map;
    for(let j=0; j<_maze.textureMap[0].length; j++){
      for(let i=0; i<_maze.textureMap.length; i++){
        if(_maze.textureMap[i][j] !== null){
          let [x, y] = this.worldToScreen([i,j], _maze.cellSize, _maze.mazeOffset);
          for(let k=0; k<_maze.textureMap[i][j].length; k++){
            if(_maze.textureMap[i][j][k] === 18){
              image(_textures[_maze.textureMap[i][j][k]+(Math.floor(frameCount/4)+i+j)%8], x, y, _maze.cellSize[0], _maze.cellSize[0]);
            }
            else{
              image(_textures[_maze.textureMap[i][j][k]], x, y, _maze.cellSize[0], _maze.cellSize[0]);
            }
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

    fill(0);
    textAlign(LEFT);
    textSize(50);
    if(this.currentMaze === 0){
      text("Tutorial", width/50, height/25+50);
    }
    else {
      text("Level " + this.currentMaze, width/50, height/25+50);
    }
    textSize(25);
    text('Press "R" to Restart', width/50, height*24/25);
  }
  resetMaze(_n, _win){
    if(_win !== null){
      let currentMaze = this.mazes[_n];
      this.wait = true;
      this.playerState = false;
      this.sfx.play(!_win*1);
      this.sleep(3000).then(() =>{
      //resets player power ups and enemy pos;
        currentMaze.player.pos = structuredClone(currentMaze.player.start);
        for(let i=0; i<currentMaze.enemies.length; i++){
          currentMaze.enemies[i].pos = currentMaze.enemies[i].start;
        }
        for(let i=0; i<currentMaze.powerUps.length; i++){
          currentMaze.powerUps[i].grabbed = false;
        }
        this.wait = false;
        this.playerState = true;
      });
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
        if(currentMaze.player.nextPos[3] === true){
          this.wait = true;
          this.isWaiting = true;
          this.playerState = false;
          this.sfx.play(3);
          this.sleep(1500).then(() =>{
            this.wait = false;
            this.isWaiting = false;
            this.playerState = true;
          });
        }
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
        if(!this.isWaiting){
          this.playerState = true;
        }
        //checks if you are dead
        let lost = false;
        for(let i=0; i<currentMaze.enemies.length; i++){
          if(currentMaze.player.pos[0] === currentMaze.enemies[i].pos[0] &&
            currentMaze.player.pos[1] === currentMaze.enemies[i].pos[1]){
            this.resetMaze(this.currentMaze, false);
            lost = true;
            break;
          }
        }  
        if(currentMaze.end[0] === currentMaze.player.pos[0] &&
          currentMaze.end[1] === currentMaze.player.pos[1] && !lost){
          if(this.currentMaze === 0){
            this.resetMaze(this.currentMaze, true);
            this.gameState = 0;
          }
          else if(this.currentMaze + 1 < this.n){
            this.resetMaze(this.currentMaze, true);
            this.currentMaze++;
          }
          else {
            this.resetMaze(this.currentMaze, true);
            this.gameState = 2;
          }
          this.wait = false;
          this.playerState = true;
        }
        //checks if you have grabbed a powerUp
        for(let i=0; i<currentMaze.powerUps.length; i++){
          if(currentMaze.player.pos[0] === currentMaze.powerUps[i].pos[0] &&
            currentMaze.player.pos[1] === currentMaze.powerUps[i].pos[1] &&
            currentMaze.powerUps[i].grabbed === false){
            currentMaze.player.powerUp = true;
            currentMaze.powerUps[i].grabbed = true;
            this.wait = true;
            this.playerState = false;
            this.sfx.play(2);
            this.sleep(2000).then(() =>{
              this.wait = false;
              this.playerState = true;
            });
            break;
          }
        }  
        //checks if you have beat the level
      });
    } 
  }
}

class Maze {
  constructor(_id, _mazeMap, _dimension, _player, _end, _enemies, _portals, _powerUps){
    this.id = _id;
    this.mazeMap = _mazeMap;
    this.dimension = _dimension;
    this.player = _player;
    this.playerPortals = _portals;
    this.end = _end;
    this.enemies = _enemies;
    this.graph = new Graph(this.mazeMap, this.dimension);
    this.cellSize;
    this.offset;
    this.powerUps = _powerUps;
    this.autoScale(_dimension, _mazeMap);
    this.generateTextureMap(_mazeMap, _dimension);
  }
  autoScale(_dimension, _mazeMap) {
    let sum = 0;
    for(let i=0; i<_mazeMap[0].length; i+=2){
      sum += _mazeMap[_mazeMap.length-1][i];
    }
    let xOffset, yOffset, xScale;
    xScale = width/(_dimension[0]+2.5);
    if(2*height/(_dimension[1]+3) < xScale){
      xScale = 2*height/(_dimension[1]+3);
      yOffset = 1;
      xOffset = (width-xScale*(_dimension[0]+0.5*(sum>0)))/(2*xScale);
    }
    else {
      xOffset = 1+0.25*(sum===0);
      yOffset = (4*width-xScale*(_dimension[0]+1))/(24*xScale);
    }
    this.offset = [xOffset, yOffset];
    this.cellSize = [xScale, xScale*0.5];
  }
  generateTextureMap(_mazeMap, _dimension){
    this.textureMap = new Array(_dimension[0]+2*floor(this.offset[0]+3));
    for(let j=0; j<this.textureMap.length; j++){
      this.textureMap[j] = new Array(_dimension[1]+3*floor(this.offset[1]+3)).fill([18]);
    }
    let direction = [
      [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,0]],
      [[-1,-1],[0,-1],[1,0],[0,1],[-1,1],[-1,0]]
    ];
    for(let j=0; j<_dimension[0]; j++){
      for(let k=0; k<_dimension[1]; k++){
        let [a, b] = [j+floor(this.offset[0])+3, k+floor(this.offset[1])+3];
        if(_mazeMap[j][k] === 1 ||
           _mazeMap[j][k] > 2){
          this.textureMap[a][b] = [1];
          for(let l=0; l<6; l++){
            let x = j+direction[k%2][l][0];
            let y = k+direction[k%2][l][1];
            if(x >= 0 && x <_dimension[0] &&
               y >= 0 && y <_dimension[1]){
              if(_mazeMap[x][y] === 2 ||
                 _mazeMap[x][y] === 0){
                this.textureMap[a][b].push(l+9);
              }
            }
            else {
              this.textureMap[a][b].push(l+9);
            }
          }
          if(_mazeMap[j][k] === 4) {
            this.textureMap[a][b].push(3);
          }
          if(_mazeMap[j][k] === 5) {
            this.textureMap[a][b].push(17);
          }
          if(_mazeMap[j][k] > 5){
            this.textureMap[a][b].push(_mazeMap[j][k]-2);
          }
        }
        if(_mazeMap[j][k] === 2){
          this.textureMap[a][b] = [0];
          if(random() < 0.3){
            this.textureMap[a][b].push(15);
          }
          else if(random() > 0.7){
            this.textureMap[a][b].push(16);
          }
        }
      }
    }
    this.mazeOffset = [this.offset[0]-floor(this.offset[0])-3, this.offset[1]-floor(this.offset[1])-3];
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
        _levels.gameState = 0;
        _levels.resetMaze(_levels.currentMaze);
      },
      function(_levels) {
        _levels.gameState = 0;
      }
    ];
    this.state = [0,0,1,2];
    this.textureProperties = [
      [72,9,true],
      [72,9,true],
      [18,18,false],
      [72,9,true]
    ];
    this.dimensions = [
      [width/4, height/2.5, width/2, height/8],
      [width/4, height/2.5+height/6, width/2, height/8],
      [width*21/24, height/12, height/6, height/6],
      [width/4, height/1.75, width/2, height/8]
    ];
    this.loadButtons(_textures, this.textureProperties);
  }
  loadButtons(_textures, _properties){
    this.textures = [];
    let [x, y] = [0, 0];
    for(let i = 0; x < _textures.width && y < _textures.height; i++){
      let newAsset = [];
      newAsset.push(_textures.get(x = 0, y, _properties[i][0], _properties[i][1])); 
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