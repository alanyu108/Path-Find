import React from "react";
import Graph from "./components/Graph";
import "./App.css";

import { GridProvider } from "./GridContext";
import Display from "./Display";

function App(props) {
  return (
    <>
      <GridProvider>
        <Display />
        <Graph />
      </GridProvider>
    </>
  );
}

export default React.memo(App);
