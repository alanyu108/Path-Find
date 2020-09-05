import React from "react";
import Graph from "./components/Graph";
import "./App.css";
import Select from "./components/Select";
import AStarText from "./components/AStarText";
import { GridProvider } from "./GridContext";
import Display from "./components/Display";

function App(props) {
  return (
    <>
      <GridProvider>
        <div>
          Algorithms here:
          <Select
            options={[
              { key: "o1", value: "Dijkstra's Algorithm" },
              { key: "o2", value: "A* Algorithm" },
            ]}
          />
        </div>
        <AStarText />
        <Graph />
        <Display />
      </GridProvider>
    </>
  );
}

export default React.memo(App);
