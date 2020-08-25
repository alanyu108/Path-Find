import React from "react";

function Square({ positionY, positionX, onClick, background }) {
  return (
    <div
      onClick={() => {
        onClick([positionX, positionY]);
      }}
      style={{
        width: 20,
        height: 20,
        border: `solid 1px black`,
        borderTop: positionX === 0 ? `solid 1px black` : "0",
        backgroundColor: background,
      }}
    ></div>
  );
}

export default React.memo(Square);
