class Player{
  constructor(_pos){
    this.pos = _pos;
    this.nextPos = null;
  }
  updatePos(){
    this.pos = this.nextPos;
  }
  castNext(_maze){
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
    let playerX = _maze.cellSize[0]*(this.pos[0]+1.5+0.5*((this.pos[1]+1)%2));
    let playerY = _maze.cellSize[1]*(this.pos[1]+2);
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
    this.pos = _pos;
    this.path;
  }
  updatePos(_graph, _player, _dimension){
    this.path = _graph.solve(this.pos, _player);
    let id = this.path.shift();
    this.pos = [Math.floor(id/_dimension[1]),id%_dimension[1]];
  }
}