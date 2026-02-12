// src/components/SnakeXenzia/SquareBlocks.jsx
import React from "react";
import { useGame } from "./GameContext";

/*
  index: numeric index (0..TOTAL-1)
  We decide the content and CSS class from game state.
*/

const SquareBlocks = ({ index }) => {
  const { snake, head, food, obstacleSet } = useGame();

  // quick lookup (for readability). For performance, convert snake -> Set if you have huge snakes.
  const isHead = head === index;
  const isBody = snake.includes(index) && !isHead;
  const isFood = food === index;
  const isObstacle = obstacleSet.has(index);

  const char = isHead ? "o" : isBody ? "+" : isFood ? "●" : "";
  // classes - keep minimal; you can style further
  const base = "flex items-center justify-center text-center text-sm";

  let className = `${base} bg-blue-200`; // default: empty cell

  if (isObstacle) {
    className = `${base} bg-red-500`;
  } else if (isFood) {
    className = `${base} bg-yellow-300`;
  } else if (isHead) {
    className = `${base} bg-green-700 text-white`;
  } else if (isBody) {
    className = `${base} bg-green-500 text-white`;
  }

  return (
    <div data-index={index} className={`${className}`}>
      {char}
    </div>
  );
};

export default SquareBlocks;
