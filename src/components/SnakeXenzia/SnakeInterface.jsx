// src/components/SnakeXenzia/SnakeInterface.jsx
import React from "react";
import { useGame } from "./GameContext";
import SquareBlocks from "./SquareBlocks";

const SnakeInterface = () => {
  const {
    COLS,
    TOTAL,
    score,
    running,
    toggleRunning,
    startGame,
    gameOver,
    resetGame,
    handleDirectionChange, // ✅ make sure this is defined in GameContext
  } = useGame();

  // create array of indices 0..TOTAL-1
  const cells = [...Array(TOTAL).keys()]; // uses iterator from keys()
  return (
    <div className="w-max bg-blue-100 border border-transparent rounded-lg p-2">
      {/* Header */}
      <header className="flex justify-between items-center font-bold bg-green-400 text-white text-lg px-3 py-1 rounded gap-2">
        <div className="flex">
          <button
            onClick={toggleRunning}
            className="bg-blue-800 text-white text-sm px-2 py-1 rounded mr-2"
          >
            {running ? "Pause" : "Resume"}
          </button>
          <button
            onClick={startGame}
            className="bg-white text-black px-2 py-1 rounded text-sm"
          >
            New Game
          </button>
        </div>
        <div>Score: {score}</div>
      </header>

      {/* Game board or Game Over overlay */}
      {!gameOver ? (
        <>
          {/* ----Game board----- */}
          <div
            className="mt-2 border border-blue-500 board-wrapper relative"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${COLS}, 20px)`,
              gridAutoRows: "20px",
              gap: 0,
            }}
          >
            {cells.map((idx) => (
              <SquareBlocks key={idx} index={idx} />
            ))}
          </div>

          {/* -------Touch Controls------- */}
          <div className="mt-4 flex flex-col items-center gap-2 select-none">
            <button
              onClick={() => handleDirectionChange("UP")}
              className="bg-gray-700 text-white px-6 py-2 rounded"
            >
              ⬆️
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => handleDirectionChange("LEFT")}
                className="bg-gray-700 text-white px-6 py-2 rounded"
              >
                ⬅️
              </button>

              <button
                onClick={toggleRunning}
                className="bg-gray-700 text-white px-6 font-bold py-2 rounded"
              >
                {running ? "Pause" : "Resume"}
              </button>
              <button
                onClick={() => handleDirectionChange("RIGHT")}
                className="bg-gray-700 text-white px-6 py-2 rounded"
              >
                ➡️
              </button>
            </div>
            <button
              onClick={() => handleDirectionChange("DOWN")}
              className="bg-gray-700 text-white px-6 py-2 rounded"
            >
              ⬇️
            </button>
          </div>
        </>
      ) : (
        // --Game Over overlay-------
        <div className="flex flex-col items-center justify-center bg-black bg-opacity-70 text-white text-center mt-2 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Game Over 😢</h2>
          <p className="mb-4">Score: {score}</p>
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-green-500 rounded-lg text-white font-semibold hover:bg-green-600"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default SnakeInterface;
