import React from "react";
import AStar from "./components/AStar";
import Euclid from "./components/Euclid";

function App() {
  return (
    <>
      <Euclid />
      <div>yes</div>
      <AStar />
    </>
  );
}

export default React.memo(App);
