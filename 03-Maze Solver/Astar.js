class node {
  constructor(_id, _edges){
    this.id = _id;
    this.edges = _edges;
    this.f = Infinity;
    this.prevNode;
  }
}

class testGraph {
  constructor(){
    this.nodes = [
      new node(0, [[1,2],[3,8]]),
      new node(1, [[0,2],[3,5],[4,6]]),
      new node(2, [[4,9],[5,3]]),
      new node(3, [[0,8],[1,5],[4,3],[5,2]]),
      new node(4, [[1,6],[2,9],[3,3],[5,1]]),
      new node(5, [[3,2],[4,1],[2,3]])
    ];
  }
  solve(start, end){
    let check = new Array(this.nodes.length).fill(false);
    let stack = [start];
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
    console.log(this.nodes);
    let result = [end];
    while(result[0] !== start){
      result.unshift(this.nodes[result[0]].prevNode);
    }
    console.log(result);
  }
}