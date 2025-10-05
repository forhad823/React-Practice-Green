import React from "react";

const SquareBlocks = ({ id, bgColor }) => {
  return (
    <>
      <div
        className={`p-0 text-xl h-[30px] w-[30px] flex items-center justify-center text-center ${bgColor}`}
        id={id}
      >
        {/* {id} */}
      </div>
    </>
  );
};

export default SquareBlocks;
