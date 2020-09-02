import React, { useCallback, useRef, useContext } from "react";
import { GridContext } from "../GridContext.js";
import Select from "../Select";
import graphPath from "../algorithms/graph_based_algorithm";

function Graph(props) {
  const { gridValue, resetFunction, algorithmValue, runningValue } = useContext(
    GridContext
  );
  const [grid, setGrid] = gridValue;
  const [algorithm] = algorithmValue;
  const [createEmptyGrid] = resetFunction;
  const [running, setRunning] = runningValue;

  //starts or ends the path finding algorithm

  const runningRef = useRef(running);
  runningRef.current = running;

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

      let graph_obj = graphPath(newGrid, openSet, closedSet, algorithm);

      openSet = graph_obj.openSet;
      closedSet = graph_obj.closedSet;

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
  }, [grid, drawClosedandOpenSet, setRunning]);

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
          <div>
            Algorithms here:
            <Select
              options={[
                { key: "o1", value: "Dijkstra's Algorithm" },
                { key: "o2", value: "A* Algorithm" },
              ]}
            />
          </div>
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
                  let newGrid = grid.slice();
                  createPath(newGrid);
                }
              }}
            >
              {runningRef.current ? "Stop Path Finding" : "Start Finding Path"}
            </button>

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
          </div>
        </div>
      </div>
    </>
  );
}

export default Graph;
