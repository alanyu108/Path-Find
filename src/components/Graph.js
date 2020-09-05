import React, { useCallback, useRef, useContext } from "react";
import { GridContext } from "../GridContext.js";
import graphPath from "../algorithms/graph_based_algorithm";
import newMaze from "../algorithms/smaller_maze";

function Graph(props) {
  const { gridValue, resetFunction, algorithmValue, runningValue } = useContext(
    GridContext
  );
  const [grid, setGrid] = gridValue;
  const [algorithm] = algorithmValue;
  const [createEmptyGrid] = resetFunction;
  const [running, setRunning] = runningValue;

  const runningRef = useRef(running);
  runningRef.current = running;

  //animates the path recursively if it is found
  //through the algorithm
  const animatePath = useCallback(
    (path) => {
      let newGrid = grid.slice();

      if (!runningRef.current) {
        setRunning(false);
        return;
      }

      if (path.length === 0) {
        setRunning(false);
        for (let rows of newGrid) {
          for (let cols of rows) {
            cols.inClosedSet = false;
            cols.inOpenSet = false;
          }
        }
        setGrid(newGrid);
        return;
      }

      let firstNode = path.pop();
      newGrid[firstNode.position[0]][firstNode.position[1]].isPath = true;
      setGrid(newGrid);

      requestAnimationFrame(() => {
        animatePath(path);
      });
    },
    [grid, setGrid, setRunning]
  );

  //displays the open and closed sets when the both
  //A* and Dijkstra's algorithm is running
  //blue color corresponds to the open set
  //orange color corresponds to the closed set
  const drawClosedandOpenSet = useCallback(
    (grid, openSet, closedSet, path) => {
      let newGrid = grid.slice();

      if (!runningRef.current) {
        setRunning(false);
        return;
      }

      if (path.length !== 0 || openSet.length === 0) {
        animatePath(path);
        return;
      }

      for (let rows of newGrid) {
        for (let cols of rows) {
          cols.isPath = false;
          if (cols.inOpenSet) {
            openSet.push(cols);
          } else if (cols.inClosedSet) {
            closedSet.push(cols);
          }
        }
      }

      //finds the open and closed set given the pervious closed and open set
      let graph_obj = graphPath(newGrid, openSet, closedSet, algorithm);

      openSet = graph_obj.openSet;
      closedSet = graph_obj.closedSet;

      //draws the open and closed sets
      for (let node of openSet) {
        let newPath = node.position;
        if (!newPath.inOpenSet) {
          newGrid[newPath[0]][newPath[1]].inOpenSet = true;
        }
      }
      for (let node of closedSet) {
        let newPath = node.position;
        if (!newPath.inClosedSet) {
          newGrid[newPath[0]][newPath[1]].inClosedSet = true;
        }
      }
      setGrid(newGrid);

      requestAnimationFrame(() => {
        drawClosedandOpenSet(newGrid, openSet, closedSet, graph_obj.path);
      });
    },
    [animatePath, setGrid, algorithm, setRunning]
  );

  //start the algorithms depending on
  //which alogrithm was selected by the user
  //either A* or Dijkstra
  const createPath = useCallback(() => {
    let openSet = [];
    let closedSet = [];
    let start, end;
    let path = [];

    let newGrid = grid.slice();
    for (let rows of newGrid) {
      for (let cols of rows) {
        if (cols.isStart) {
          start = cols;
        } else if (cols.isEnd) {
          end = cols;
        }
      }
    }

    //checks if there is a start and an end node
    if (end && start) {
      start.inOpenSet = true;
      openSet.push(start); //pushes the start node into the open set
      drawClosedandOpenSet(newGrid, openSet, closedSet, path);
    } else {
      setRunning(false);
      return;
    }
  }, [grid, drawClosedandOpenSet, setRunning]);

  return (
    <>
      <div className={"grid-button"}>
        {/* clears the grid */}
        <button
          onClick={() => {
            setRunning(false);
            setGrid(createEmptyGrid());
          }}
        >
          Clear
        </button>

        {/* starts or stops the algorithm currently running */}
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              let newGrid = grid.slice();
              createPath(newGrid);
            }
          }}
        >
          {runningRef.current ? "Stop Path Finding" : "Start Finding Path"}
        </button>

        {/* generates random walls if the user is too lazy to drag click the walls */}
        <button
          onClick={() => {
            let newGrid = createEmptyGrid();
            setRunning(false);
            for (let rows of newGrid) {
              for (let cols of rows) {
                if (grid[cols.position[0]][cols.position[1]].isStart) {
                  cols.isStart = true;
                } else if (grid[cols.position[0]][cols.position[1]].isEnd) {
                  cols.isEnd = true;
                } else {
                  let randomNumber = Math.random();
                  if (randomNumber >= 0.7) {
                    cols.isWall = true;
                  }
                }
              }
            }
            setGrid(newGrid);
          }}
        >
          Generate Random Walls
        </button>

        {/* generates a new maze using a recursive backtracker */}
        <button
          onClick={() => {
            setRunning(false);
            let newGrid = createEmptyGrid();
            //returns a list of nodes and where their correspoding walls should be
            let mazePath = newMaze(newGrid);

            console.log(mazePath);
            for (let elements of mazePath) {
              let [x, y] = elements.position;
              for (let i = 0; i < elements.walls.length; i++) {
                let walls = elements.walls[i];
                if (walls) {
                  if (i === 0) {
                    //top
                    if (x - 1 >= 0) {
                      newGrid[x - 1][y].isWall = true;
                    }
                  }
                  if (i === 1) {
                    //right
                    if (y + 1 < newGrid[0].length) {
                      newGrid[x][y + 1].isWall = true;
                    }
                  }
                  if (i === 2) {
                    //bottom
                    if (x + 1 < grid.length) {
                      newGrid[x + 1][y].isWall = true;
                    }
                  }
                  if (i === 3) {
                    //left
                    if (y - 1 >= 0) {
                      newGrid[x][y - 1].isWall = true;
                    }
                  }
                }
              }
            }

            //makes all the diagonals of the even nodes to be walls
            for (let rows of newGrid) {
              for (let cols of rows) {
                if (cols.position[1] % 2 === 0 && cols.position[0] % 2 === 0) {
                  let operations = [
                    [-1, 1],
                    [1, 1],
                    [1, -1],
                    [-1, -1],
                  ];
                  for (let transform of operations) {
                    let [x, y] = transform;
                    let newX = cols.position[0] + x;
                    let newY = cols.position[1] + y;
                    if (
                      newX >= 0 && //makes sure the new values is within bounds of the grid
                      newX < grid.length &&
                      newY >= 0 &&
                      newY < grid[0].length
                    ) {
                      newGrid[newX][newY].isWall = true;
                    }
                  }
                }
              }
            }
            setGrid(newGrid);
          }}
        >
          Create maze
        </button>
      </div>
    </>
  );
}

export default React.memo(Graph);
