import React, { useState, useCallback } from "react";
import aStarPath from "./algorithms/a_star_algorithm";

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
          if (!grid[position[0]][position[1]].isWall) {
            newSquare.isWall = true;
            newSquare.isEnd = false;
            newSquare.isStart = false;
            newSquare.isPath = false;
            setGrid(newGrid);
          }
        }
      }
    },
    [grid, mouseDown, checkedBoxes.items]
  );

  const handleOnClick = useCallback(
    ({ position }) => {
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
          const newGrid = grid.slice();
          const newSquare = grid[position[0]][position[1]];
          if (limit === 0) {
            newSquare.isStart = true;
          } else if (limit === 1) {
            newSquare.isEnd = true;
          }
          newGrid[position[0]][position[1]] = newSquare;
          setGrid(newGrid);
        }
      }
    },
    [grid, checkedBoxes.items]
  );

  const createPath = useCallback(() => {
    let path = aStarPath(grid);
    let newGrid = grid.slice();
    for (let node of path) {
      let newPath = node.position;
      newGrid[newPath[0]][newPath[1]].isPath = true;
    }
    setGrid(newGrid);
  }, [grid]);

  return (
    <>
      <button
        onClick={() => {
          //setRunning(false);
          setGrid(createEmptyGrid());
        }}
      >
        Clear
      </button>
      <button
        onClick={() => {
          //setRunning(false);
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
          createPath(grid);
        }}
      >
        Start A Star Algorithm
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
            <div
              onClick={() => {
                handleOnClick(col);
              }}
              onMouseUp={handleMouseUp}
              onMouseDown={handleMouseDown}
              onMouseMove={() => {
                handleMouseMove(col);
              }}
              key={`${i}-${k}`}
              style={{
                width: 20,
                height: 20,
                border: `solid 1px black`,
                borderTop: i === 0 ? `solid 1px black` : "0",
                backgroundColor: `${findColor(col)}`,
              }}
            ></div>
          ))
        )}
      </div>

      <div>yes</div>
    </>
  );
}

export default AStar;
