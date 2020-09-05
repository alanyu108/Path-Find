import React, { useState, useCallback, useContext } from "react";
import { GridContext } from "../GridContext.js";
import AStarText from "./AStarText";
import DijkstraText from "./DijkstraText";
import Graph from "./Graph";
import "./Display.css";

//displays the grid that the user interacts with
const Display = () => {
  const { gridValue, runningValue, algorithmValue } = useContext(GridContext);
  const [grid, setGrid] = gridValue;
  const [running, setRunning] = runningValue;
  const [algorithm, setAlgorithm] = algorithmValue;

  const [mouseDown, setMouseDown] = useState(false);

  //changes the color of the cell in the grid depending
  //on which function the cell serves
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

  //handles the selection of the start and end node for
  //the algorithms
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
      if (!newSquare.isWall) {
        if (!limit[0] || !limit[1]) {
          if (!limit[0]) {
            newSquare.isStart = true;
          }
          if (!limit[1]) {
            newSquare.isEnd = true;
          }
        }
        setGrid(newGrid);
      }
    },
    [grid, setGrid]
  );

  const handleMouseDown = useCallback(() => {
    setMouseDown(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setMouseDown(false);
  }, []);

  //allows the user to drag and create walls if their
  //mouse button is down
  const handleMouseMove = useCallback(
    ({ position }) => {
      if (mouseDown) {
        const newGrid = grid.slice();
        const newSquare = newGrid[position[0]][position[1]];
        if (!newSquare.isWall && !newSquare.isEnd && !newSquare.isSTart) {
          newSquare.isWall = true;
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
    <>
      <div className={"display"}>
        <div className={"text"}>
          {algorithm === "A* Algorithm" && <AStarText />}
          {algorithm === "Dijkstra's Algorithm" && <DijkstraText />}
        </div>

        <div>
          <Graph />

          <div
            className={"grid"}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${grid.length}, 1.2rem)`,
            }}
          >
            {grid.map((rows, i) =>
              rows.map((col, k) => (
                <div
                  className={"grid-square"}
                  onClick={() => {
                    handleOnClick([i, k]);
                  }}
                  onMouseUp={handleMouseUp}
                  onMouseDown={handleMouseDown}
                  onMouseMove={() => {
                    if (!running) {
                      handleMouseMove(col);
                    }
                  }}
                  key={`${i}-${k}`}
                  style={{
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
};

export default Display;
