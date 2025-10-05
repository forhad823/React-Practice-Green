import React, { useEffect, useRef, useState } from "react";
import SquareBlocks from "./SquareBlocks";
import { moveRight, obstacleIds } from "./utils";

const SnakeInterface = () => {
  const [isPaused, setIsPaused] = useState(false);

  // Generate all IDs first
  const ids = [];
  for (let i = 97; i < 97 + 16; i++) {
    // 97 = 'a', run 16 times upto 'p'
    let rowLetter = String.fromCharCode(i);
    for (let j = 0; j <= 12; j++) {
      ids.push(rowLetter + j); // string concatenation
    }
  }

  useEffect(() => {
    if (isPaused) return; // stop running interval
    console.log("mounted");
    const intervalId = setInterval(() => {
      moveRight();
    }, 100);

    // ------stop interval after 7s to see cleanup----
    /* const stopId = setTimeout(() => {
      clearInterval(intervalId);
    }, 7000); */

    // cleanup when component unmounts
    return () => {
      console.log("unmounts , return statement run");
      clearInterval(intervalId);
    };
  }, [isPaused]); // depend on isPaused

  return (
    <div className="w-96 bg-blue-300 border border-transparent rounded-lg">
      <header className="flex justify-around items-center text-center font-bold   bg-green-400 text-white text-lg">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="bg-blue-800 px-2 cursor-pointer"
        >
          {isPaused ? "resume" : "pause"}
        </button>
        <div>score</div>
      </header>

      <div className="grid grid-cols-13 font-semibold">
        {ids.map((id) =>
          obstacleIds.includes(id) ? (
            <SquareBlocks key={id} id={id} bgColor={"bg-red-500"} />
          ) : (
            <SquareBlocks key={id} id={id} bgColor={"bg-blue-300"} />
          )
        )}
      </div>
    </div>
  );
};

export default SnakeInterface;
