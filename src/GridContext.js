import React, { useState } from "react";

const createEmptyGrid = () => {
  let grid = [];
  for (let i = 0; i < 30; i++) {
    let rows = [];
    for (let j = 0; j < 30; j++) {
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

export const GridContext = React.createContext();

export const GridProvider = (props) => {
  const [grid, setGrid] = useState(() => {
    return createEmptyGrid();
  });

  const [algorithm, setAlgorithm] = useState("Dijkstra's Algorithm");
  const [running, setRunning] = useState(false);
  return (
    <GridContext.Provider
      value={{
        gridValue: [grid, setGrid],
        algorithmValue: [algorithm, setAlgorithm],
        resetFunction: [createEmptyGrid],
        runningValue: [running, setRunning],
      }}
    >
      {props.children}
    </GridContext.Provider>
  );
};
