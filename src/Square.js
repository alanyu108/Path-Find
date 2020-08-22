import React from "react";

function Square({ onClick, squareInfo, onMouseMove, onMouseUp, onMouseDown }) {
  let { isStart, isEnd, isPath, isWall } = squareInfo;
  let borderColor = "black";
  let background = "";
  if (isStart) {
    borderColor = "green";
    background = "green";
  } else if (isEnd) {
    borderColor = "red";
    background = "red";
  } else if (isPath) {
    background = "yellow";
    borderColor = "yellow";
  } else if (isWall) {
    background = "black";
  } else {
    background = "white";
  }

  return (
    <div
      onClick={onClick}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      style={{
        width: 20,
        height: 20,
        border: `solid 1px ${borderColor}`,
        backgroundColor: background,
      }}
    ></div>
  );
}

export default React.memo(Square);
