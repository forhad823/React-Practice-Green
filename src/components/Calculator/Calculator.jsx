import React, { useEffect, useRef, useState } from "react";
import {
  handleAdd,
  handleClear,
  handleDevide,
  handleMultiply,
  handleResult,
  handleSubtract,
} from "./Operators";
import Display from "./Display";

const Calculator = () => {
  const [active, setActive] = useState(true); // for the placeholder of inputBox.

  const displayRef = useRef(null);
  const workingRef = useRef(null);

  //displayRef.current, workingRef.current

  useEffect(() => {
    // This code runs after the component has mounted
    displayRef.current = document.getElementById("display");
    workingRef.current = document.getElementById("inputBox");
  }, []); // Empty array means this effect runs only once

  return (
    <>
      <div className="bg-red-600 w-72">
        {/*------- Display and InputBox------------- */}
        <div className="py-3 bg-amber-400 h-32 space-y-2">
          {/*-------Display--------  */}
          <Display />
          {/* ------InputBox------ */}
          <div className="text-center">
            <input
              id="inputBox"
              type="number"
              placeholder={
                active ? "input number to calculate" : "Press the Clear button"
              }
              className="bg-black hover:bg-blue-800 text-center text-white w-[95%] h-14 rounded-lg text-xl font-bold "
            ></input>
          </div>
        </div>
        {/* operators */}
        <div className="text-white bg-blue-500 h-60 py-7 ">
          <div className="buttons-container text-5xl font-bold text-center space-y-2">
            <button
              className="px-3 py-1 bg-blue-700 rounded-lg cursor-pointer hover:bg-black"
              onClick={() => handleAdd(displayRef.current, workingRef.current)}
            >
              +
            </button>
            <div className="flex flex-row gap-2 items-center justify-center">
              <button
                onClick={() =>
                  handleMultiply(displayRef.current, workingRef.current)
                }
                className="px-3 py-1 bg-blue-700 rounded-lg cursor-pointer hover:bg-black"
              >
                *
              </button>
              <button
                onClick={() => [
                  handleResult(displayRef.current, workingRef.current),
                  setActive(false),
                ]}
                className="px-3 py-1 bg-green-700 rounded-lg cursor-pointer hover:bg-black"
              >
                =
              </button>
              <button
                onClick={() =>
                  handleDevide(displayRef.current, workingRef.current)
                }
                className="px-3 py-1 bg-blue-700 rounded-lg cursor-pointer hover:bg-black"
              >
                /
              </button>
            </div>
            <button
              onClick={() =>
                handleSubtract(displayRef.current, workingRef.current)
              }
              className="px-3 py-1 bg-blue-700 rounded-lg cursor-pointer hover:bg-black"
            >
              -
            </button>
          </div>
        </div>
        {/* footer buttons */}
        <div className="bg-green-400 text-white h-14 text-right text-xl font-bold">
          <button
            onClick={() => [
              handleClear(displayRef.current, workingRef.current),
              setActive(true),
            ]}
            className="px-3 py-1 bg-red-700 rounded-lg cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>
    </>
  );
};

export default Calculator;
