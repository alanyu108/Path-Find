import React, { useState, useRef, useCallback } from "react";
import Square from "./Square";
import findEuclidPath from "./algorithms/euclideanAlgorithm";

//size of the grid
const ROWS = 20;
const COLS = 20;

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
      });
    }
    grid.push(rows);
  }
  return grid;
};

function App() {
  const [grid, setGrid] = useState(() => {
    return createEmptyGrid();
  });

  //starts or ends the path finding algorithm
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  //animates the path from the start to the end node
  const animatePath = (grid) => {
    let current = [];
    let end = [];

    if (!runningRef.current) {
      setRunning(false);
      return;
    }

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
      let path = findEuclidPath(grid);
      if (path.length !== 0) {
        //node is then added to the grid and re-rendered
        let newGrid = grid.slice();
        newGrid[current[0]][current[1]].isCurrent = false;
        newGrid[path[0]][path[1]].isCurrent = true;
        newGrid[path[0]][path[1]].isPath = true;
        setGrid(newGrid);

        //animates the new path
        requestAnimationFrame(() => {
          animatePath(grid);
        });
      }
    } else {
      console.log("end or start node not detected");
      setRunning(false);
      return;
    }
  };

  const findColor = useCallback((col) => {
    let { isStart, isEnd, isPath } = col;
    let background = "white";
    if (isStart) {
      background = "green";
    } else if (isEnd) {
      background = "red";
    } else if (isPath) {
      background = "yellow";
    }

    return background;
  }, []);

  const handleOnClick = useCallback(
    (position) => {
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
          newSquare.isCurrent = true;
        } else if (limit === 1) {
          newSquare.isEnd = true;
        }
        newGrid[position[0]][position[1]] = newSquare;
        setGrid(newGrid);
      }
    },
    [grid]
  );

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
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            animatePath(grid);
          }
        }}
      >
        {runningRef.current ? "Stop Path Finding" : "Start Finding Path"}
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <Square
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
