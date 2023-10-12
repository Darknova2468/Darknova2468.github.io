class node {
  constructor(_id, _edges){
    this.id = _id;
    this.edges = _edges;
    this.f = Infinity;
    this.prevNode = 0;
  }
}

class Graph {
  constructor(_mazeMap, _dimension) {
    this.dimension = _dimension;
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
    let portals = [];
    this.nodes = [];
    for(let i=0; i<_dimension[0]; i++){
      for(let j=0; j<_dimension[1]; j++){
        if(_mazeMap[i][j] !== 0 && _mazeMap[i][j] !== 2){
          let cNode = new node(i*_dimension[1]+j, []);
          if(_mazeMap[i][j] === 6 || _mazeMap[i][j] === 8){
            portals.push(cNode.id);
          }
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
            let id = x*_dimension[1]+y;
            if(x< _dimension[0] && x>=0 && y<_dimension[1] && y>= 0){
              if(_mazeMap[x][y] !== 0 && _mazeMap[x][y] !== 2){
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
    for(let i=0; i<portals.length; i++){
      let id = portals[i];
      for(let j=0; j<portals.length; j++){
        if(portals[j] !== id){
          this.nodes[portals[i]].edges.push([portals[j], 1]);
        }
      }
    }
  }
  solve(start, end){
    let check = new Array(this.nodes.length).fill(false);
    start = start[0]*this.dimension[1]+start[1];
    end = end[0]*this.dimension[1]+end[1];
    if(start === end){
      return null;
    }
    let stack = [start];
    if(this.nodes[start] === null && this.nodes[end] === null){
      console.log("invalid start or end");
      return null;
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
    if(this.nodes[end].prevNode === 0){
      return null;
    }
    while(result[0] !== start){
      if(this.nodes[result[0]].prevNode === undefined){
        return null;
      }
      result.unshift(this.nodes[result[0]].prevNode);
    }
    result.shift();
    for(let i=0; i<check.length; i++){
      if(check[i] === true){
        this.nodes[i].f = Infinity;
        this.nodes[i].prevNode = 0;
      }
    }

    return result;
  }
}