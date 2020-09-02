import React, { useState, useCallback, useContext } from "react";
import { GridContext } from "./GridContext.js";

const Display = () => {
  const { gridValue } = useContext(GridContext);
  const [grid, setGrid] = gridValue;
  const [mouseDown, setMouseDown] = useState(false);

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

  const handleOnClick = useCallback(
    (position) => {
      let limit = [false, false];
      for (let rows of grid) {
        for (let cols of rows) {
          if (cols.isStart) {
            limit[0] = true;
          } else if (cols.isEnd) {
            limit[1] = true;
          }
        }
      }
      //only a start node and end node are allowed to be created
      const newGrid = grid.slice();
      const newSquare = newGrid[position[0]][position[1]];
      if (!limit[0] || !limit[1]) {
        if (!limit[0]) {
          newSquare.isStart = true;
        }
        if (!limit[1]) {
          newSquare.isEnd = true;
        }
      }

      setGrid(newGrid);
    },
    [grid, setGrid]
  );

  const handleMouseDown = useCallback(() => {
    setMouseDown(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setMouseDown(false);
  }, []);

  const handleMouseMove = useCallback(
    ({ position }) => {
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
    },
    [grid, mouseDown, setGrid]
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(30, 20px)" }}>
      {grid.map((rows, i) =>
        rows.map((col, k) => (
          <div
            onClick={() => {
              handleOnClick([i, k]);
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
  );
};

export default Display;
