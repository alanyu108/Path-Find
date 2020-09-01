import React, { useState } from "react";
import AStar from "./components/AStar";
import Euclid from "./components/Euclid";
import Dijkstra from "./components/Dijkstra";
import "./App.css";
import { ReactComponent as CarrotIcon } from "./img/carrot.svg";

function App(props) {
  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(null);
  function Option(props) {
    const onSelect = (e) => {
      e.preventDefault();
      props.onSelect(props.option);
    };
    return (
      <>
        <li>
          <div href="#" onClick={onSelect}>
            {props.option.value}
          </div>
        </li>
      </>
    );
  }

  function Select(props) {
    const onOpen = () => {
      setOpen(!open);
    };

    const onSelect = (option) => {
      setSelect(option);
      setOpen(false);
    };

    return (
      <div className="select" onClick={onOpen}>
        <span>
          {select ? select.value : "Select"}
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
  let select1 = [
    { key: "o1", value: "Euclidean Algorithm" },
    { key: "o2", value: "Dijkstra's Algorithm" },
    { key: "o3", value: "A* Algorithm" },
  ];
  let renderComponent = select ? select.value : "Euclidean Algorithm";
  return (
    <>
      <div>
        Algorithms here:
        <Select options={select1} />
      </div>
      <div>
        {renderComponent === "Euclidean Algorithm" && <Euclid />}
        {renderComponent === "A* Algorithm" && <AStar />}
        {renderComponent === "Dijkstra's Algorithm" && <Dijkstra />}
      </div>
    </>
  );
}

export default React.memo(App);
