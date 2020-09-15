import React, { useState, useContext } from "react";
import { ReactComponent as CarrotIcon } from "../img/carrot.svg";
import { GridContext } from "../GridContext";
import "./css/Select.css";

//each option of the dropdown menu
function Option(props) {
  const onSelect = (e) => {
    e.preventDefault();
    props.onSelect(props.option);
  };
  return (
    <>
      <li>
        <div onClick={onSelect}>{props.option.value}</div>
      </li>
    </>
  );
}

function Select(props) {
  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(null);
  const { algorithmValue, gridValue, resetFunction, runningValue } = useContext(
    GridContext
  );
  const [algorithm, setAlgorithm] = algorithmValue;
  const [grid, setGrid] = gridValue;
  const [createEmptyGrid] = resetFunction;
  const [running, setRunning] = runningValue;

  //toggles the dropdown menu
  const onOpen = () => {
    setOpen(!open);
  };

  //when an option is selected, the grid walls,
  //start and end node remains
  //while the rest of the grid is reset
  const onSelect = (option) => {
    setSelect(option);
    setOpen(false);
    setAlgorithm(option.value);
    setRunning(false);
    setGrid((prevState) => {
      let newGrid = createEmptyGrid();

      for (let rows of prevState) {
        for (let cols of rows) {
          if (cols.isStart) {
            newGrid[cols.position[0]][cols.position[1]].isStart = true;
          } else if (cols.isEnd) {
            newGrid[cols.position[0]][cols.position[1]].isEnd = true;
          } else if (cols.isWall) {
            newGrid[cols.position[0]][cols.position[1]].isWall = true;
          }
        }
      }

      return newGrid;
    });
  };

  return (
    <div className="select" onClick={onOpen}>
      <span>
        {select ? select.value : algorithm}
        <div id={"icon"}>
          <CarrotIcon />
        </div>
      </span>
      <ul className={open ? "show" : "hide"}>
        {props.options.map((o) => (
          <Option key={o.key} option={o} onSelect={onSelect} />
        ))}
      </ul>
    </div>
  );
}

export default Select;
