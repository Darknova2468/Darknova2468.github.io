class Player{
  constructor(_pos){
    this.start = _pos;
    this.pos = _pos;
    this.nextPos = null;
    this.powerUp = false;
  }
  updatePos(){
    this.pos = this.nextPos;
  }
  castNext(_maze){
    //equations found with chatgpt
    if(_maze.mazeMap[_maze.player.pos[0]][_maze.player.pos[1]] === 6 ||
       _maze.mazeMap[_maze.player.pos[0]][_maze.player.pos[1]] === 7){
      let y = mouseY/_maze.cellSize[1]-_maze.offset[1];
      let x = (mouseX-_maze.cellSize[0]*_maze.offset[0]-0.5*_maze.cellSize[0]*((y+1)%2)) / _maze.cellSize[0];
      x = Math.floor(x);
      y = Math.floor(y);
      if(x>=0 && x<_maze.dimension[0] && y>=0 && y<_maze.dimension[1]){
        for(let i=0;i<_maze.playerPortals.length; i++){
          if(_maze.playerPortals[i][0] === x && 
               _maze.playerPortals[i][1] === y &&
               (_maze.player.pos[0] !== x ||
               _maze.player.pos[1] !== y)){
            this.nextPos = [x, y, false];
            return [x, y, false];
          }
        }
      }
    }
    let pointer;
    let direction = [
      [[0, -1],[1, -1],[1, 0],[0, 1],[1, 1],[-1,0]],
      [[-1, -1],[0, -1],[1, 0],[-1, 1],[0, 1],[-1, 0]]
    ];
    let playerX = _maze.cellSize[0]*(this.pos[0]+_maze.offset[0]+0.5*((this.pos[1]+1)%2))+_maze.cellSize[1];
    let playerY = _maze.cellSize[1]*(this.pos[1]+_maze.offset[1])+_maze.cellSize[1]/1.25;
    let magnitude = dist(playerX, playerY, mouseX, mouseY);
    let theta = Math.atan((mouseX-playerX)/(mouseY-playerY));
    if(magnitude <= 2*_maze.cellSize[0]){
      if(Math.abs(theta)-1.309 > 0){
        pointer = playerX>mouseX ? 5:2;
      }
      else {
        pointer = (playerY<mouseY)*3+(playerX<mouseX);
      }
      let x = this.pos[0]+direction[this.pos[1]%2][pointer][0];
      let y = this.pos[1]+direction[this.pos[1]%2][pointer][1];
      if(x< _maze.dimension[0] && x>=0 && y<_maze.dimension[1] && y>= 0){
        if(_maze.mazeMap[x][y] !== 0 && _maze.mazeMap[x][y] !== 2){
          for(let i=0;i<_maze.enemies.length; i++){
            if(_maze.enemies[i].pos[0] === x && 
               _maze.enemies[i].pos[1] === y){
              if(this.powerUp === true){
                this.nextPos = [x, y, true, i];
                return [x, y, true, i];
              } 
              this.nextPos = null;
              return null;
            }
          }
          this.nextPos = [x, y, false];
          return [x, y, false];
        }
      }
    }
    this.nextPos = null;
    return null;
  }
}

class Enemy{
  constructor(_pos){
    this.start = _pos;
    this.pos = _pos;
    this.path = null;
    this.isDead = false;
  }
  updatePos(_graph, _player, _dimension){
    if(this.isDead === true){
      this.isDead = false;
    }
    else {
      this.path = _graph.solve(this.pos, _player);
      if(this.path !== null){
        let id = this.path.shift();
        this.pos = [Math.floor(id/_dimension[1]),id%_dimension[1]];
      }
    }
  }
}

class PowerUp{
  constructor(_pos){
    this.pos = _pos;
    this.grabbed = false;
  }
}