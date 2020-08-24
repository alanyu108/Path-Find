import React, { useState, useRef, useCallback } from "react";
import Square from "./Square";
import findPath from "./findPath";

//size of the grid
const ROWS = 40;
const COLS = 40;

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
    console.log("yes");
  }
  return grid;
};

function App() {
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
  function changeClick(e, i) {
    if (!runningRef.current) {
      const { checked } = e.target;
      setCheckedBoxes((prevState) => ({
        items: prevState.items.map((value, index) =>
          index === i ? checked : false
        ),
      }));
    }
  }

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
      let path = findPath(grid);
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

  //allows the user to select the start and end nodes
  const toggleNodes = useCallback(
    ({ position }) => {
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
          newSquare.isStart = !newSquare.isStart;
          newSquare.isCurrent = !newSquare.isCurrent;
        } else if (limit === 1) {
          newSquare.isEnd = !newSquare.isEnd;
        }
        newGrid[position[0]][position[1]] = newSquare;
        setGrid(newGrid);
      }
    },
    [grid]
  );

  //allows the user to drag click new walls
  const toggleWalls = useCallback(
    ({ position }) => {
      const newGrid = grid.slice();
      const newSquare = grid[position[0]][position[1]];
      if (!grid[position[0]][position[1]].isWall) {
        console.log(position);
        newSquare.isWall = true;
        newGrid[position[0]][position[1]] = newSquare;
        setGrid(newGrid);
      }
    },
    [grid]
  );

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
    (col) => {
      if (checkedBoxes.items[1]) {
        if (mouseDown) {
          toggleWalls(col);
        }
      }
    },
    [toggleWalls, mouseDown, checkedBoxes.items]
  );

  const handleOnClick = useCallback(
    (col) => {
      if (checkedBoxes.items[0]) {
        toggleNodes(col);
      }
    },
    [toggleNodes, checkedBoxes.items]
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
          setRunning(false);
          let newGrid = grid.slice();
          for (let rows of newGrid) {
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
            animatePath(grid);
          }
        }}
      >
        {runningRef.current ? "Stop Path Finding" : "Start Finding Path"}
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
              onMouseMove={() => {
                handleMouseMove(col);
              }}
              onClick={() => {
                handleOnClick(col);
              }}
              key={`${i}-${k}`}
              positionX={i}
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
