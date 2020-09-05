import React, { useState } from "react";

//creates 2d array of objects with all our maze properties
//that 2D array is stored within the grid state and is passed to
//other components through this grid context
const createEmptyGrid = () => {
  let grid = [];
  for (let i = 0; i < 29; i++) {
    let rows = [];
    for (let j = 0; j < 29; j++) {
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

  //stores which algorithm the user is currently on and is changed
  //selecting an option from the dropdown menu
  const [algorithm, setAlgorithm] = useState("Dijkstra's Algorithm");

  //checks if any of the algorithms are running
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
