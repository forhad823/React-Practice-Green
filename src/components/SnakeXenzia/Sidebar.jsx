// src/components/SnakeXenzia/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { useGame } from "./GameContext";

const Sidebar = () => {
  const { setSpeed, speed, score, resetGame } = useGame();
  const [high, setHigh] = useState(() =>
    Number(localStorage.getItem("snakeHigh") || 0)
  );

  useEffect(() => {
    if (score > high) {
      setHigh(score);
      localStorage.setItem("snakeHigh", String(score));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  return (
    <div className="ml-3 p-2 w-48 bg-white rounded border">
      <div className="font-bold mb-2">Controls</div>
      <div className="mb-2">Space = Pause / Resume</div>
      <div className="mb-4">
        <button
          onClick={resetGame}
          className="px-2 py-1 mr-2 bg-blue-600 text-white rounded"
        >
          New Game
        </button>
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Speed (ms): {speed}</label>
        <input
          type="range"
          min="60"
          max="400"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
      </div>

      <div className="mt-4">
        <div className="font-semibold">High Score</div>
        <div className="text-xl">{high}</div>
      </div>
    </div>
  );
};

export default Sidebar;
