class node {
  constructor(_pos, _dimension){
    this.id = _pos[0]*_dimension+_pos[1];
    this.connections = [];
    this.f = Infinity;
  }
}

class createGraph{
  constructor(maze, dimension){
    this.nodes = [];
    this.dimension = dimension;
    let directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];
    for(let i=0; i<dimension[0]; i++){
      for(let j=0; j<dimension[1]; j++){
        if(maze[i][j]!==1){
          let newNode = new node([i,j], this.dimension[1]);
          for(let k=0; k<4; k++){
            let x = i+directions[k][0];
            let y = j+directions[k][1];
            let id = x*this.dimension[1]+y;
            if(x >= 0 && x < dimension[0] && y >= 0 && y < dimension[1]){
              if(maze[x][y] !== 1){
                newNode.connections.push([id, 1]);
              }
            }
          }
          this.nodes.push(newNode);
        }
        else {
          this.nodes.push(null);
        }
      }
    }
  }
  findPath(start, end){
    let startID = start[0]*this.dimension[1]+start[1];
    let endID = end[0]*this.dimension[1]+end[1];
    let openSet = [startID];
    this.nodes[startID].f = 0;
    let n=0;
    while(n < 3){
      let nextSet = [];
      for(let i=0; i<openSet.length; i++){
        console.log(this.nodes[openSet[i]].f);
        let currentF = this.nodes[openSet[i]].f;
        let connections = this.nodes[openSet[i]].connections;
        for(let j=0; j<connections.length; j++){
          let nextF = currentF + connections[1];
          if(this.nodes[connections[j][0]].f < nextF) {
            this.nodes[connections[j][0]].f = nextF;
          }
        }
      }
      openSet = nextSet.slice;
      n++;
    }
  }
}