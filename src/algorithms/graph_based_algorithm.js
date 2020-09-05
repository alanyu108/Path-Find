//finds the euclidean distance between two nodes
const euclideanDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

//deletes an element from an array
const deleteFromArray = (openSet, { position }) => {
  return openSet.filter(
    (node) =>
      euclideanDistance(
        node.position[0],
        node.position[1],
        position[0],
        position[1]
      ) !== 0
  );
};

//checks if a given element is within an array
const includes = (closedSet, { position }) => {
  for (let nodes of closedSet) {
    let node = nodes.position;
    if (euclideanDistance(node[0], node[1], position[0], position[1]) === 0) {
      return true;
    }
  }
  return false;
};

//used to find the neighbors of the current node
let operations = [
  [0, 1],
  [1, 0],
  [-1, 0],
  [0, -1],
  // [-1, 1],
  // [1, 1],
  // [1, -1],
  // [-1, -1],
];

const graphPath = (grid, openSet, closedSet, algorithm) => {
  let end;
  let path = [];
  let currentNode = [];

  for (let rows of grid) {
    for (let cols of rows) {
      if (cols.isEnd) {
        end = cols;
      }
    }
  }

  //finds the lowest f-score in the open set (A*)
  //finds the lowest g-score in the open set (Dijkstra)
  if (algorithm === "A* Algorithm") {
    let low_f = 0;

    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f_score < openSet[low_f].f_score) {
        low_f = i;
      }
    }

    currentNode = openSet[low_f];
  } else if (algorithm === "Dijkstra's Algorithm") {
    let low_g = 0;

    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].g_score < openSet[low_g].g_score) {
        low_g = i;
      }
    }

    currentNode = openSet[low_g];
  }

  //checks if the current node is equal to the end node
  //if it is, we have reached the end and the can backtrack to
  //find the path from the start node to the end node
  if (
    euclideanDistance(
      currentNode.position[0],
      currentNode.position[1],
      end.position[0],
      end.position[1]
    ) === 0
  ) {
    let temp_node = currentNode;
    path.push(temp_node);
    while (temp_node.prevNode) {
      let previousNode = temp_node.prevNode;
      path.unshift(grid[previousNode[0]][previousNode[1]]);
      temp_node = grid[previousNode[0]][previousNode[1]];
    }

    return { closedSet: closedSet, openSet: openSet, path: path };
  }

  openSet = deleteFromArray(openSet, currentNode);
  currentNode.inOpenSet = false;
  currentNode.inClosedSet = true;
  closedSet.unshift(currentNode);

  //loops through all the neighbors of the current node
  for (let neighbors of operations) {
    let [x, y] = neighbors;
    let newX = x + currentNode.position[0];
    let newY = y + currentNode.position[1];
    let betterPath = false;

    //makes sure the new values is within bounds of the grid
    if (
      newX >= 0 &&
      newX < grid.length &&
      newY >= 0 &&
      newY < grid[0].length &&
      !grid[newX][newY].isWall
    ) {
      let neighbor = grid[newX][newY];

      //checks if the neighbor isnt already in the closed set
      if (!includes(closedSet, neighbor)) {
        let temp_g = currentNode.g_score + 1;

        //checks if the neighbor is in the open set
        if (includes(openSet, neighbor)) {
          if (temp_g < neighbor.g_score) {
            //if the current g score is less then the
            //the neigbhor's g score, then let the neighbor g score
            //equal to the current g score
            neighbor.g_score = temp_g;
            betterPath = true;
          }
        } else {
          neighbor.g_score = temp_g;
          neighbor.inOpenSet = true;
          openSet.unshift(neighbor);
          betterPath = true;
        }

        //if the neighbor in the open set has a lower g score
        if (betterPath) {
          if (algorithm === "A* Algorithm") {
            //h score is the huerisitic of the A* algorithm
            //the hueristic in this case is the euclidean distance
            neighbor.h_score = euclideanDistance(
              neighbor.position[0],
              neighbor.position[1],
              end.position[0],
              end.position[1]
            );
            neighbor.f_score = neighbor.h_score + neighbor.g_score;
            neighbor.prevNode = currentNode.position;
          } else if (algorithm === "Dijkstra's Algorithm") {
            //allows the node to keep track from where theyw came from
            neighbor.prevNode = currentNode.position;
          }
        }
      }
    }
  }

  return { closedSet: closedSet, openSet: openSet, path: path };
};

export default graphPath;
