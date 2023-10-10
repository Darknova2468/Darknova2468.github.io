class node {
  constructor(_id, _edges){
    this.id = _id;
    this.edges = _edges;
    this.f = Infinity;
    this.prevNode;
  }
}

class generateGraph {
  constructor(_maze) {
    let maze = _maze.mazeMap;
    let case1 = [
      [-1, 1],
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, -1],
      [-1, 0]
    ];
    let case2 = [
      [0, 1],
      [1, 1],
      [1, 0],
      [0,-1],
      [1, -1],
      [-1, 0]
    ];
    this.nodes = [];
    for(let i=0; i<_maze.dimension[0]; i++){
      for(let j=0; j<_maze.dimension[1]; j++){
        if(maze[i][j] !== 0 && maze[i][j] !== 2){
          let cNode = new node(i*_maze.dimension[1]+j, []);
          for(let k=0; k<6; k++){
            let x; let y;
            if(j%2 === 1){
              x = i + case1[k][0];
              y = j + case1[k][1];
            }
            else {
              x = i + case2[k][0];
              y = j + case2[k][1];
            }
            let id = x*_maze.dimension[1]+y;
            if(x<= _maze.dimension[1] && x>=0 && y<=_maze.dimension[0] && y>= 0){
              if(maze[x][y] !== 0 && maze[x][y] !== 2){
                cNode.edges.push([id, 1]);
              }
            }
          }
          this.nodes.push(cNode);
        } 
        else {
          this.nodes.push(null);
        }
      }
    }
    console.log(this.nodes);
  }
  solve(start, end){
    let time = millis();
    let check = new Array(this.nodes.length).fill(false);
    let stack = [start];
    if(this.nodes[start] === null && this.nodes[end] === null){
      console.log("invalid start or end");
      return [];
    }
    this.nodes[start].f = 0;
    while(stack.length > 0){
      let nextStack = [];
      for(let i=0; i<stack.length; i++){
        let cNode = this.nodes[stack[i]];
        let cF = cNode.f;
        for(let j=0; j<cNode.edges.length; j++){
          if(!check[cNode.edges[j][0]]){
            if(cNode.edges[j][1]+cF<this.nodes[cNode.edges[j][0]].f){
              this.nodes[cNode.edges[j][0]].f = cNode.edges[j][1]+cF;
              this.nodes[cNode.edges[j][0]].prevNode = cNode.id;
            }
            nextStack.push(cNode.edges[j][0]);
          }
        }
        check[cNode.id] = true;
      }
      stack = [...nextStack];
    }
    let result = [end];
    while(result[0] !== start){
      result.unshift(this.nodes[result[0]].prevNode);
    }
    console.log(millis()-time);
    return result;
  }
}