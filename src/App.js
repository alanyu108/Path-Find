import React, { useState } from "react";
import AStar from "./components/AStar";
import Euclid from "./components/Euclid";
import "./App.css";
import { ReactComponent as CarrotIcon } from "./carrot.svg";

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
          {select ? select.value : "Select"}{" "}
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
    { key: "o2", value: "A* Algorithm" },
  ];
  let renderComponent = select ? select.value : "Euclidean Algorithm";
  return (
    <>
      <div>
        Example here:
        <Select options={select1} />
      </div>
      <div>
        {renderComponent === "Euclidean Algorithm" && <Euclid />}
        {renderComponent === "A* Algorithm" && <AStar />}
      </div>
    </>
  );
}

// function App() {
//   const [euclid, setEuclid] = useState(true);
//   const [astar, setAStar] = useState(false);
//   function Dropdown(props) {
//     const [on, setOn] = useState(false);
//     return (
//       <>
//         <button
//           onClick={() => {
//             setOn(!on);
//           }}
//         >
//           Select Algorithm
//         </button>
//         {on && <li>{props.children}</li>}
//       </>
//     );
//   }
//   function DropdownItem(props) {
//     return <ul onClick={props.click}>{props.children}</ul>;
//   }

//   const handleItemClickEuclid = () => {
//     setEuclid(!euclid);
//   };

//   const handleItemClickAStar = () => {
//     setAStar(!astar);
//   };

//   return (
//     <>
//       <Dropdown>
//         <DropdownItem click={handleItemClickEuclid}>Euclid</DropdownItem>
//         <DropdownItem click={handleItemClickAStar}>AStar</DropdownItem>
//       </Dropdown>
//       {euclid && <Euclid />}
//       {astar && <AStar />}
//     </>
//   );
// }

export default React.memo(App);
