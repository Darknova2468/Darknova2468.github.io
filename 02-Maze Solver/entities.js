class Player{
  constructor(_pos){
    this.start = _pos;
    this.pos = _pos;
    this.nextPos = null;
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
      x = Math.round(x);
      y = Math.round(y);
      if(x>=0 && x<_maze.dimension[0] && y>=0 && y<_maze.dimension[1]){
        for(let i=0;i<_maze.playerPortals.length; i++){
          if(_maze.playerPortals[i][0] === x && 
               _maze.playerPortals[i][1] === y &&
               _maze.player.pos[0] !== x &&
               _maze.player.pos[1] !== y){
            this.nextPos = [x, y];
            return [x, y];
          }
        }
      }
    }
    //5,6 8,6 6,3 1,4

    
    let pointer;
    let cases = [
      [0, 1],
      [4, 3]
    ];
    let case1 = [
      [-1, -1],
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 1],
      [-1, 0]
    ];
    let case2 = [
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1,0]
    ];
    let playerX = _maze.cellSize[0]*(this.pos[0]+_maze.offset[0]+0.5*((this.pos[1]+1)%2));
    let playerY = _maze.cellSize[1]*(this.pos[1]+_maze.offset[1]);
    let magnitude = dist(playerX, playerY, mouseX, mouseY);
    let theta = Math.atan((mouseX-playerX)/(mouseY-playerY));
    if(magnitude <= 2*_maze.cellSize[0]){
      if(Math.abs(theta)-1.309 > 0){
        if(playerX > mouseX){
          pointer = 5;
        }
        else {
          pointer = 2;
        }
        
      }
      else {
        pointer = cases[1*(playerY<mouseY)][1*(playerX<mouseX)];
      }
      let x; let y;
      if(this.pos[1]%2 === 1){
        x = this.pos[0]+case1[pointer][0];
        y = this.pos[1]+case1[pointer][1];
      }
      else {
        x = this.pos[0]+case2[pointer][0];
        y = this.pos[1]+case2[pointer][1];
      }
      if(x< _maze.dimension[0] && x>=0 && y<_maze.dimension[1] && y>= 0){
        if(_maze.mazeMap[x][y] !== 0 && _maze.mazeMap[x][y] !== 2){
          this.nextPos = [x, y];
          return [x, y];
        }
        this.nextPos = null;
        return null;
      }
      this.nextPos = null;
      return null;
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
  }
  updatePos(_graph, _player, _dimension){
    this.path = _graph.solve(this.pos, _player);
    if(this.path !== null){
      let id = this.path.shift();
      this.pos = [Math.floor(id/_dimension[1]),id%_dimension[1]];
    }
  }
}