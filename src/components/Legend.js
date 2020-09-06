import React from "react";

function Legend() {
  return (
    <div className={"legend"}>
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "1.2rem",
            height: "1.2rem",
            backgroundColor: "green",
            border: "1px solid black",
          }}
        ></div>
        <div> - Start Node</div>
      </div>

      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "1.2rem",
            height: "1.2rem",
            backgroundColor: "red",
            border: "1px solid black",
          }}
        ></div>
        <div>- End Node</div>
      </div>

      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "1.2rem",
            height: "1.2rem",
            backgroundColor: "orange",
            border: "1px solid black",
          }}
        ></div>
        <div> - Closed set</div>
      </div>

      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "1.2rem",
            height: "1.2rem",
            backgroundColor: "blue",
            border: "1px solid black",
          }}
        ></div>
        <div>- Open set</div>
      </div>

      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "1.2rem",
            height: "1.2rem",
            backgroundColor: "yellow",
            border: "1px solid black",
          }}
        ></div>
        <div>- Path</div>
      </div>

      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "1.2rem",
            height: "1.2rem",
            backgroundColor: "black",
            border: "1px solid black",
          }}
        ></div>
        <div>- Wall</div>
      </div>
    </div>
  );
}

export default Legend;
