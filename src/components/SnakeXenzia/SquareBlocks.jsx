// src/components/SnakeXenzia/SquareBlocks.jsx
import React, { useMemo } from "react";
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

  const className = useMemo(() => {
    if (isObstacle) return `${base} bg-red-500`;
    if (isFood) return `${base} bg-yellow-300`;
    if (isHead) return `${base} bg-green-700 text-white`;
    if (isBody) return `${base} bg-green-500 text-white`;
    return `${base} bg-blue-200`;
  }, [isObstacle, isFood, isHead, isBody]);

  return (
    <div
      data-index={index}
      className={`${className}`}
      style={{ width: 20, height: 20 }}
    >
      {char}
    </div>
  );
};

export default SquareBlocks;
