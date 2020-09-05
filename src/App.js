import React from "react";
import "./App.css";
import Select from "./components/Select";
import { GridProvider } from "./GridContext";
import Display from "./components/Display";

function App(props) {
  return (
    <>
      <GridProvider>
        <div className={"top"}>
          Algorithms here:
          <Select
            options={[
              { key: "o1", value: "Dijkstra's Algorithm" },
              { key: "o2", value: "A* Algorithm" },
            ]}
          />
        </div>

        <Display />
      </GridProvider>
    </>
  );
}

export default React.memo(App);
