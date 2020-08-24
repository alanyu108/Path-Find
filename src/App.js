import React, { useState, useCallback } from "react";
import Square from "./Square";
import findPath from "./findPath";
import produce from "immer";

//size of the grid
const ROWS = 50;
const COLS = 50;

//generate an empty grid
const createEmptyGrid = () => {
  let grid = [];
  for (let i = 0; i < ROWS; i++) {
    let rows = [];
    for (let j = 0; j < COLS; j++) {
      rows.push({
        position: [i, j],
        isStart: false,
        isEnd: false,
        isPath: false,
        isCurrent: false,
        isWall: false,
      });
    }
    grid.push(rows);
  }
  return grid;
};

const findColor = (col) => {
  let { isStart, isEnd, isPath, isWall } = col;
  let background = "white";
  if (isStart) {
    background = "green";
  } else if (isEnd) {
    background = "red";
  } else if (isPath) {
    background = "yellow";
  } else if (isWall) {
    background = "black";
  }

  return background;
};

function App() {
  //grids
  const [grid, setGrid] = useState(() => {
    return createEmptyGrid();
  });

  //nodes and walls
  const [checkedBoxes, setCheckedBoxes] = useState({
    items: [true, false],
  });

  const [mouseDown, setMouseDown] = useState(false);

  //allows users to toggle between the nodes and the walls
  function changeClick(e, i) {
    //if (!runningRef.current) {
    const { checked } = e.target;
    setCheckedBoxes((prevState) => ({
      items: prevState.items.map((value, index) =>
        index === i ? checked : false
      ),
    }));
    //}
  }

  //animates the path from the start to the end node
  const animatePath = () => {
    let current = [];
    let end = [];

    //finds the start and the end node
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j].isCurrent) {
          current = grid[i][j].position;
        } else if (grid[i][j].isEnd) {
          end = grid[i][j].position;
        }
      }
    }

    //checks if we have a start and an end node
    if (current.length + end.length === 4) {
      //find the next node to move towards
      let path = findPath(grid);
      if (path.length !== 0) {
        for (let node of path) {
          setTimeout(() => {
            setGrid((prevState) => {
              return produce(prevState, (draftState) => {
                draftState[node[0]][node[1]].isPath = true;
              });
            });
          }, 1);
        }
      }
    } else {
      console.log("end or start node not detected");
    }
  };

  const handleMouseDown = useCallback(() => {
    if (checkedBoxes.items[1]) {
      setMouseDown(true);
    }
  }, [checkedBoxes.items]);

  const handleOnClick = useCallback(
    (position) => {
      if (checkedBoxes.items[0]) {
        let limit = 0;
        for (let i = 0; i < ROWS; i++) {
          for (let j = 0; j < COLS; j++) {
            if (grid[i][j].isStart || grid[i][j].isEnd) {
              limit += 1;
            }
          }
        }

        //only a start node and end node are allowed to be created
        if (limit < 2) {
          setGrid((prevState) => {
            return produce(prevState, (draftState) => {
              let node = draftState[position[0]][position[1]];
              if (limit === 0) {
                node.isStart = true;
                node.isCurrent = true;
              } else if (limit === 1) {
                node.isEnd = true;
              }
            });
          });
        }
      }
    },
    [grid, checkedBoxes.items]
  );

  const handleMouseUp = useCallback(() => {
    if (checkedBoxes.items[1]) {
      setMouseDown(false);
    }
  }, [checkedBoxes.items]);

  const handleMouseMove = useCallback(
    (position) => {
      if (checkedBoxes.items[1]) {
        if (mouseDown) {
          if (!grid[position[0]][position[1]].isWall) {
            setGrid((prevState) => {
              return produce(prevState, (draftState) => {
                draftState[position[0]][position[1]].isWall = true;
              });
            });
          }
        }
      }
    },
    [grid, mouseDown, checkedBoxes.items]
  );

  return (
    <>
      <button
        onClick={() => {
          setGrid(createEmptyGrid());
        }}
      >
        Clear
      </button>
      <button
        onClick={() => {
          setGrid((prevState) => {
            return produce(prevState, (draftState) => {
              for (let rows of draftState) {
                for (let cols of rows) {
                  cols.isWall = false;
                  cols.isPath = false;
                  if (cols.isStart) {
                    cols.isCurrent = true;
                  } else {
                    cols.isCurrent = false;
                  }
                }
              }
            });
          });
        }}
      >
        Clear Walls and Path
      </button>
      <button
        onClick={() => {
          animatePath();
        }}
      >
        {/* {runningRef.current ? "Stop Path Finding" : "Start Finding Path"} */}
        Start Finding Path
      </button>

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
            <Square
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onClick={handleOnClick}
              key={`${i}-${k}`}
              positionX={i}
              positionY={k}
              background={findColor(col)}
            />
          ))
        )}
      </div>
      <div>yes</div>
    </>
  );
}

export default React.memo(App);
