import React from "react";

function Square({ onClick, squareInfo, onMouseMove, onMouseUp, onMouseDown }) {
  let { position, isStart, isEnd, isPath, isWall } = squareInfo;

  let background = "";
  if (isStart) {
    background = "green";
  } else if (isEnd) {
    background = "red";
  } else if (isPath) {
    background = "yellow";
  } else if (isWall) {
    background = "black";
  } else {
    background = "white";
  }

  let borderTop = "";
  if (position[0] === 0) {
    borderTop = `solid 1px black`;
  } else {
    borderTop = "none";
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
        borderTop: borderTop,
        borderLeft: `solid 1px black`,
        borderRight: `solid 1px black`,
        borderBottom: `solid 1px black`,
        backgroundColor: background,
      }}
    ></div>
  );
}

export default React.memo(Square);
