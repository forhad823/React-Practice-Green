import React from "react";
// the component was not used in the calculator.
const Display = () => {
  return (
    <>
      <div className="text-center">
        <input
          id="display"
          type="text"
          placeholder="Display"
          // value="Display"
          disabled
          className="text-center bg-black text-white w-[95%] h-10 rounded-lg text-2xl font-bold overflow-scroll"
        ></input>
      </div>
    </>
  );
};

export default Display;
