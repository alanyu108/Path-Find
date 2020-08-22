const euclideanDistace = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

function findPath(grid) {
  let maxDistance = 1000;
  let current, end;
  let currentPoint;
  let operations = [
    [0, 1],
    [1, 0],
    [-1, 0],
    [0, -1],
  ];

  //checks if there is a start and an end node
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      let { isCurrent, isEnd, position } = grid[i][j];
      if (isCurrent) {
        current = position;
      } else if (isEnd) {
        end = position;
      }
    }
  }

  let [x1, y1] = current;
  let [x2, y2] = end;
  if (x1 === x2 && y1 === y2) {
    return;
  }
  //checks the nesw directions to find the node with the shortest distance
  operations.forEach(([x, y]) => {
    let newX = x + x1;
    let newY = y + y1;

    if (
      newX >= 0 && //makes sure the new values is within bounds of the grid
      newX < grid.length &&
      newY >= 0 &&
      newY < grid[0].length &&
      !grid[newX][newY].isWall
    ) {
      let currentDistance = euclideanDistace(newX, newY, x2, y2);
      if (currentDistance < maxDistance) {
        maxDistance = currentDistance;
        currentPoint = [newX, newY];
      }
    }
  });
  x1 = currentPoint[0];
  y1 = currentPoint[1];

  return currentPoint;
}

export default findPath;
