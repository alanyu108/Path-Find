import React, { useState, useCallback, useRef } from "react";
import aStarPath from "../algorithms/a_star_algorithm";

const ROWS = 30;
const COLS = 30;

//generate an empty grid
const createEmptyGrid = () => {
  let grid = [];
  for (let i = 0; i < ROWS; i++) {
    let rows = [];
    for (let j = 0; j < COLS; j++) {
      rows.push({
        inOpenSet: false,
        inClosedSet: false,
        position: [i, j],
        isStart: false,
        isEnd: false,
        isPath: false,
        isWall: false,
        f_score: 0,
        g_score: 0,
        h_score: 0,
        prevNode: undefined,
      });
    }
    grid.push(rows);
  }
  return grid;
};

function AStar() {
  const [grid, setGrid] = useState(() => {
    return createEmptyGrid();
  });

  //nodes and walls
  const [checkedBoxes, setCheckedBoxes] = useState({
    items: [true, false],
  });

  //starts or ends the path finding algorithm
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const [mouseDown, setMouseDown] = useState(false);

  //allows users to toggle between the nodes and the walls
  const changeClick = (e, i) => {
    const { checked } = e.target;
    setCheckedBoxes((prevState) => ({
      items: prevState.items.map((value, index) =>
        index === i ? checked : false
      ),
    }));
  };

  const findColor = useCallback((col) => {
    let { isStart, isEnd, isPath, isWall, inClosedSet, inOpenSet } = col;

    let background = "white";
    if (isStart) {
      background = "green";
    } else if (isEnd) {
      background = "red";
    } else if (isPath) {
      background = "yellow";
    } else if (isWall) {
      background = "black";
    } else if (inOpenSet) {
      background = "blue";
    } else if (inClosedSet) {
      background = "orange";
    }

    return background;
  }, []);

  const handleMouseDown = useCallback(() => {
    if (checkedBoxes.items[1]) {
      setMouseDown(true);
    }
  }, [checkedBoxes.items]);

  const handleMouseUp = useCallback(() => {
    if (checkedBoxes.items[1]) {
      setMouseDown(false);
    }
  }, [checkedBoxes.items]);

  const handleMouseMove = useCallback(
    ({ position }) => {
      if (checkedBoxes.items[1]) {
        if (mouseDown) {
          const newGrid = grid.slice();
          const newSquare = newGrid[position[0]][position[1]];
          if (!newGrid[position[0]][position[1]].isWall) {
            newSquare.isWall = true;
            newSquare.isEnd = false;
            newSquare.isStart = false;
            newSquare.isPath = false;
            newSquare.inOpenSet = false;
            newSquare.inClosedSet = false;
            setGrid(newGrid);
          }
        }
      }
    },
    [grid, mouseDown, checkedBoxes.items]
  );

  const handleOnClick = useCallback(
    ({ position }) => {
      const newGrid = grid.slice();
      if (checkedBoxes.items[0]) {
        let limit = 0;
        for (let i = 0; i < ROWS; i++) {
          for (let j = 0; j < COLS; j++) {
            if (newGrid[i][j].isStart || newGrid[i][j].isEnd) {
              limit += 1;
            }
          }
        }

        //only a start node and end node are allowed to be created
        if (limit < 2) {
          const newSquare = newGrid[position[0]][position[1]];
          if (limit === 0) {
            newSquare.isStart = true;
          } else if (limit === 1) {
            newSquare.isEnd = true;
          }

          setGrid(newGrid);
        }
      }
    },
    [grid, checkedBoxes.items]
  );

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
    [grid]
  );

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

      let a_star_obj = aStarPath(newGrid, openSet, closedSet);
      openSet = a_star_obj.openSet;
      closedSet = a_star_obj.closedSet;

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
        drawClosedandOpenSet(newGrid, openSet, closedSet, a_star_obj.path);
      });
    },
    [animatePath]
  );

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

    if (end && start) {
      start.inOpenSet = true;
      openSet.push(start);
      drawClosedandOpenSet(newGrid, openSet, closedSet, path);
    } else {
      setRunning(false);
      return;
    }
  }, [grid, drawClosedandOpenSet]);

  return (
    <>
      <button
        onClick={() => {
          setRunning(false);
          setGrid(createEmptyGrid());
        }}
      >
        Clear
      </button>
      <button
        onClick={() => {
          setRunning(false);
          let newGrid = createEmptyGrid();
          for (let rows of newGrid) {
            for (let cols of rows) {
              let [x, y] = cols.position;
              if (grid[x][y].isStart) {
                cols.isStart = true;
              } else if (grid[x][y].isEnd) {
                cols.isEnd = true;
              }
            }
          }
          setGrid(newGrid);
        }}
      >
        Clear Walls and Path
      </button>

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
      {checkedBoxes.items[1] && (
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
      )}

      <span>
        {checkedBoxes.items.map((names, i) => (
          <label key={`${i}`}>
            <input
              name={i === 0 ? "nodes" : "walls"}
              type={"checkbox"}
              checked={names}
              onChange={(e) => changeClick(e, i)}
            />
            {i === 0 ? "nodes" : "walls"}
          </label>
        ))}
      </span>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              onClick={() => {
                handleOnClick(col);
              }}
              onMouseUp={handleMouseUp}
              onMouseDown={handleMouseDown}
              onMouseMove={() => {
                if (!runningRef.current) {
                  handleMouseMove(col);
                }
              }}
              key={`${i}-${k}`}
              style={{
                width: 20,
                height: 20,
                borderBottom: i === ROWS - 1 ? `solid 1px black` : "0",
                borderRight: k === COLS - 1 ? `solid 1px black` : "0",
                borderTop: `solid 1px black`,
                borderLeft: `solid 1px black`,
                backgroundColor: `${findColor(col)}`,
              }}
            ></div>
          ))
        )}
      </div>
    </>
  );
}

export default AStar;
