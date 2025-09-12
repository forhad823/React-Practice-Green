import React from "react";
import SquareBlocks from "./SquareBlocks";
import { obstacleIds } from "./utils";

const SnakeInterface = () => {
  // Generate all IDs first
  const ids = [];
  for (let i = 97; i < 97 + 16; i++) {
    let rowLetter = String.fromCharCode(i);
    for (let j = 1; j <= 13; j++) {
      ids.push(rowLetter + j);
    }
  }
  return (
    <div className="w-96 bg-blue-300 border border-transparent rounded-lg">
      <header className="text-center font-bold   bg-green-400 text-white text-lg">
        score
      </header>
      <div className="grid grid-cols-13 text-xs font-semibold">
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
