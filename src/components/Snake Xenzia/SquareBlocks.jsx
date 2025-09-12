import React from "react";

const SquareBlocks = ({ id, bgColor }) => {
  return (
    <>
      <div
        className={`h-[30px] flex items-center justify-center ${bgColor}`}
        id={id}
      >
        {/* {id} */}
      </div>
    </>
  );
};

export default SquareBlocks;
