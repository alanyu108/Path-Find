const euclideanDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

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

const includes = (closedSet, { position }) => {
  for (let nodes of closedSet) {
    let node = nodes.position;
    if (euclideanDistance(node[0], node[1], position[0], position[1]) === 0) {
      return true;
    }
  }
  return false;
};

let operations = [
  [0, 1],
  [1, 0],
  [-1, 0],
  [0, -1],
];

const aStarPath = (grid) => {
  let openSet = [];
  let closedSet = [];
  let start;
  let end;

  for (let rows of grid) {
    for (let cols of rows) {
      if (cols.isStart) {
        start = cols;
      } else if (cols.isEnd) {
        end = cols;
      }
    }
  }
  openSet.push(start);

  while (openSet.length !== 0) {
    let low_f = 0;

    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f_score < openSet[low_f].f_score) {
        low_f = i;
      }
    }

    let currentNode = openSet[low_f];

    if (
      euclideanDistance(
        currentNode.position[0],
        currentNode.position[1],
        end.position[0],
        end.position[1]
      ) === 0
    ) {
      let path = [];
      let temp_node = currentNode;
      path.push(temp_node);
      while (temp_node.prevNode) {
        let previousNode = temp_node.prevNode;
        path.unshift(grid[previousNode[0]][previousNode[1]]);
        temp_node = grid[previousNode[0]][previousNode[1]];
      }

      return path;
    }

    openSet = deleteFromArray(openSet, currentNode);
    closedSet.push(currentNode);

    for (let neighbors of operations) {
      let [x, y] = neighbors;
      let newX = x + currentNode.position[0];
      let newY = y + currentNode.position[1];

      if (
        newX >= 0 && //makes sure the new values is within bounds of the grid
        newX < grid.length &&
        newY >= 0 &&
        newY < grid[0].length
      ) {
        let neighbor = grid[newX][newY];

        if (!includes(closedSet, neighbor)) {
          let temp_g = currentNode.g_score + 1;

          if (includes(openSet, neighbor)) {
            if (temp_g < neighbor.g_score) {
              neighbor.g_score = temp_g;
            }
          } else {
            neighbor.g_score = temp_g;
            openSet.push(neighbor);
          }

          neighbor.h_score = euclideanDistance(
            neighbor.position[0],
            neighbor.position[1],
            end.position[0],
            end.position[1]
          );
          neighbor.f_score = neighbor.h_score + neighbor.g_score;
          neighbor.prevNode = currentNode.position;
        }
      }
    }
  }
};

export default aStarPath;
