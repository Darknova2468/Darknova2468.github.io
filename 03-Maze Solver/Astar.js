class node {
  constructor(_id, _edges){
    this.id = _id;
    this.edges = _edges;
    this.f = Infinity;
    this.prevNode;
  }
}

class generateGraph {
  constructor(maze) {
    let checks = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ];
    this.nodes = [];
    for(let i=0; i<maze.length; i++){
      for(let j=0; j<maze[i].length; j++){
        if(maze[i][j] !== 1){
          let cNode = new node(i*8+j, []);
          for(let k=0; k<4; k++){
            let x = i+checks[k][0];
            let y = j+checks[k][1];
            let id = x*8+y;
            if(x<= 7 && x>=0 && y<=7 && y>= 0){
              if(maze[x][y] !== 1){
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
    if(this.nodes[start] !== null && this.nodes[end] !== null){
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
    else {
      console.log("invalid start or end");
    }
  }
}