//finds the euclidean distance between two nodes
const euclideanDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};
const includes = (closedSet, { position }) => {
  for (let nodes of closedSet) {
    let node = nodes.position;
    if (euclideanDistance(node[0], node[1], position[0], position[1]) === 0) {
      return true;
    }
  }
  return false;
};

//operations to find the neighbors of a node
let operations = [
  [0, 2],
  [2, 0],
  [-2, 0],
  [0, -2],
];

//finds the position of a node in a 1D array
function position_in_index(loop, x, y) {
  for (let i = 0; i < loop.length; i++) {
    let value = loop[i];
    if (value.position[0] === x && value.position[1] === y) {
      return i;
    }
  }
  return -1;
}

//finds and picks one random neighbor to the given node
function searchNeighbor(loop, current, visited) {
  let neighbors = [];

  //loops in the nesw directions to find the neighboring nodes
  for (let direction of operations) {
    let [x, y] = direction;
    let newX = x + current.position[0];
    let newY = y + current.position[1];
    let index = position_in_index(loop, newX, newY);

    if (loop[index]) {
      if (!includes(visited, loop[index])) {
        neighbors.push(loop[index]);
      }
    }
  }

  //if there is at least one neighbor
  //select a random neighbor
  //if there is no neighbor, undefined is returned
  if (neighbors.length > 0) {
    let randomNeighbor = Math.floor(Math.random() * neighbors.length);
    return neighbors[randomNeighbor];
  } else {
    return undefined;
  }
}

//removes the wall between two neighoboring nodes depending
//on how they are oriented
function removeWall(current, neighbor) {
  if (current.position[0] === neighbor.position[0]) {
    if (current.position[1] - neighbor.position[1] === -2) {
      current.walls[1] = false;
      neighbor.walls[3] = false;
    }
    if (current.position[1] - neighbor.position[1] === 2) {
      current.walls[3] = false;
      neighbor.walls[1] = false;
    }
  } else if (current.position[1] === neighbor.position[1]) {
    if (current.position[0] - neighbor.position[0] === -2) {
      current.walls[2] = false;
      neighbor.walls[0] = false;
    }
    if (current.position[0] - neighbor.position[0] === 2) {
      current.walls[0] = false;
      neighbor.walls[2] = false;
    }
  }

  return [current, neighbor];
}

function newMaze(grid) {
  let newGrid = grid.slice();
  let loop = [];
  let stack = [];
  let visited = [];
  let current = [];

  //adds all the nodes with an even x and even y position
  //to the loop array
  for (let rows of newGrid) {
    for (let cols of rows) {
      if (cols.position[1] % 2 === 0 && cols.position[0] % 2 === 0) {
        cols.walls = [true, true, true, true];
        loop.push(cols);
      }
    }
  }

  //sets the first node in the loop to the current node
  current = loop[0];
  //adds the current node to the visited array
  visited.push(current);

  //if all the nodes are not visited
  while (visited.length !== loop.length) {
    //finds the neighbor to the current node
    let nextNeighbor = searchNeighbor(loop, current, visited);

    //checks if there is a neighbor
    //if there is not neighbor, we backtrack until we find
    //a new node with a neighbor that has not been visisted
    if (nextNeighbor) {
      //remove the wall between the current node and the neighbor
      //thus creating a path in the maze
      let items = removeWall(current, nextNeighbor);
      current = items[0];
      nextNeighbor = items[1];
      visited.push(nextNeighbor);
      stack.push(current);
      //the neighbor node then becomes the next node
      //we check for unvisited neighbors
      current = nextNeighbor;
    } else if (stack.length > 0) {
      //stack stores all the nodes we have visited
      //and we can backtrack to nodes with neighbors
      //if we get stuck with a node that has no neighbors that has
      //not been visited
      current = stack.pop();
    }
  }

  return visited;
}

export default newMaze;
