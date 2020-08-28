import React, { useState } from "react";
import AStar from "./components/AStar";
import Euclid from "./components/Euclid";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, DropdownButton } from "react-bootstrap";

function App() {
  const [openEuclid, setEuclid] = useState(true);
  const [openAStar, setAStar] = useState(false);
  return (
    <>
      <DropdownButton id="dropdown-basic-button" title="Select Algorithm">
        <Dropdown.Item
          as="button"
          onClick={() => {
            setEuclid(true);
            setAStar(false);
          }}
        >
          Euclidean Algorithm
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item
          as="button"
          onClick={() => {
            setAStar(true);
            setEuclid(false);
          }}
        >
          A* Algorithm
        </Dropdown.Item>
      </DropdownButton>

      {openEuclid && <Euclid />}
      {openAStar && <AStar />}
    </>
  );
}

export default React.memo(App);
