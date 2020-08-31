import React, { useState, useRef, useCallback } from "react";
import findEuclidPath from "../algorithms/euclidean_algorithm";
import "./css/component.css";

//size of the grid
const ROWS = 30;
const COLS = 30;

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

function Euclid() {
  const [grid, setGrid] = useState(() => {
    return createEmptyGrid();
  });

  //starts or ends the path finding algorithm
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const drawPath = (grid, start, current, end) => {
    let newGrid = grid.slice();
    let path = findEuclidPath(newGrid, current, end);

    //find the next node to move towards

    if (!runningRef.current) {
      setRunning(false);
      return;
    }

    if ((current[0] === end[0] && current[1] === end[1]) || !path) {
      console.log("end or start node not detected");
      setRunning(false);
      return;
    }

    //node is then added to the grid and re-rendered
    newGrid[current[0]][current[1]].isCurrent = false;
    newGrid[path[0]][path[1]].isCurrent = true;
    newGrid[path[0]][path[1]].isPath = true;
    setGrid(newGrid);

    //animates the new path
    requestAnimationFrame(() => {
      drawPath(newGrid, start, path, end);
    });
  };

  //animates the path from the start to the end node
  const animatePath = () => {
    let start = [];
    let current = [];
    let end = [];
    let newGrid = grid.slice();
    //finds the start and the end node
    for (let rows of newGrid) {
      for (let cols of rows) {
        if (cols.isStart) {
          start = cols.position;
          current = cols.position;
        }
        if (cols.isEnd) {
          end = cols.position;
        }
        cols.isPath = false;
      }
    }

    setGrid(newGrid);
    drawPath(newGrid, start, current, end);
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
        const newSquare = newGrid[position[0]][position[1]];
        if (limit === 0) {
          newSquare.isStart = true;
          newSquare.isCurrent = true;
        } else if (limit === 1) {
          newSquare.isEnd = true;
        }

        setGrid(newGrid);
      }
    },
    [grid]
  );

  return (
    <>
      <div className={"display"}>
        <div className={"text"}>
          <div className={"paragragh-1"}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply
            dummy text of the printing and typesetting industry. Lorem Ipsum has
            been the industry's standard dummy text ever since the 1500s, when
            an unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.
          </div>
          {/* mathjax */}
          <div className={"paragragh-2"}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </div>
        </div>
        <div className={"grid"}>
          <div className={"grid-button"}>
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
                  animatePath();
                }
              }}
            >
              {runningRef.current ? "Stop Path Finding" : "Start Finding Path"}
            </button>
          </div>
          <div className={"grid-square"}>
            {grid.map((rows, i) =>
              rows.map((col, k) => (
                <div
                  key={`${i}-${k}`}
                  onClick={() => {
                    handleOnClick([i, k]);
                  }}
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
        </div>
      </div>
    </>
  );
}

export default React.memo(Euclid);
