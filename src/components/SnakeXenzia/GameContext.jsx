// src/components/SnakeXenzia/GameContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import {
  obstacleSetStatic,
  ROWS,
  COLS,
  TOTAL,
  getRandomEmptyIndex,
  initialSnake,
} from "./utils";

const GameContext = createContext();
export const useGame = () => useContext(GameContext);

/**
 * ---------------------------
 * Initial State factory
 * ---------------------------
 */
const createInitialState = (obstacles) => {
  // obstacles ??
  // read (12 Third argument: Lazy initialization) of https://shorturl.at/UP9Tv
  const blocked = new Set([...initialSnake, ...obstacles]);
  return {
    snake: [...initialSnake],
    direction: "RIGHT",
    running: false,
    gameOver: false,
    score: 0,
    food: getRandomEmptyIndex(blocked),
    speed: 30,
  };
};

/**
 * ---------------------------
 * Reducer (PURE): no side effects!
 * ---------------------------
 *
 * IMPORTANT: reducer must only compute and return the next state.
 * Any side-effects (setScore, setFood, storage, network) must
 * live outside in useEffect or the caller of dispatch.
 */
function gameReducer(state, action) {
  switch (action.type) {
    case "START": {
      const blocked = new Set([...initialSnake, ...action.obstacleSet]);
      return {
        ...state,
        snake: [...initialSnake],
        direction: "RIGHT",
        running: true,
        gameOver: false,
        score: 0,
        food: getRandomEmptyIndex(blocked),
      };
    }

    case "PAUSE":
      return { ...state, running: false };

    case "RESUME":
      return { ...state, running: true };

    case "SET_DIRECTION":
      return { ...state, direction: action.direction };

    case "SET_SPEED":
      return { ...state, speed: action.speed };

    case "STEP": {
      // If not running or already gameOver, nothing changes
      if (!state.running || state.gameOver) return state;

      const prevSnake = state.snake;
      // Safety guard: if the snake is missing or empty, skip movement to prevent runtime errors and keep state stable.
      if (!prevSnake || prevSnake.length === 0) return state;

      const head = prevSnake[prevSnake.length - 1];
      const row = Math.floor(head / COLS);
      const col = head % COLS;

      let nextRow = row;
      let nextCol = col;

      // Use action.direction (provided by caller) if available,
      // otherwise fall back to stored state.direction.
      const dir = action.direction || state.direction;

      switch (dir) {
        case "RIGHT":
          nextCol = (col + 1) % COLS;
          break;
        case "LEFT":
          nextCol = (col - 1 + COLS) % COLS;
          break;
        case "UP":
          nextRow = (row - 1 + ROWS) % ROWS;
          break;
        case "DOWN":
          nextRow = (row + 1) % ROWS;
          break;
        default:
          break;
      }

      const nextHead = nextRow * COLS + nextCol;

      // Collision detection (obstacle or self)
      if (action.obstacleSet.has(nextHead) || prevSnake.includes(nextHead)) {
        return { ...state, running: false, gameOver: true };
      }

      // Eating food -> grow
      if (nextHead === state.food) {
        const grown = [...prevSnake, nextHead];
        const blocked = new Set([...grown, ...action.obstacleSet]);
        return {
          ...state,
          snake: grown,
          food: getRandomEmptyIndex(blocked),
          score: state.score + Math.floor(state.speed / 10), // score per food increases according to speed
        };
      }

      // Normal move (remove tail, append new head)
      return {
        ...state,
        snake: [...prevSnake.slice(1), nextHead],
      };
    }

    default:
      return state;
  }
}

/**
 * ---------------------------
 * GameProvider
 * ---------------------------
 */
export const GameProvider = ({ children }) => {
  // useMemo is harmless but not strictly needed in this case
  const obstacleSet = useMemo(() => obstacleSetStatic, []);

  // useReducer with initial state factory
  const [state, dispatch] = useReducer(
    gameReducer, // reducer
    obstacleSet, // initialArg
    createInitialState, // initFunction
  ); // read (12 Third argument: Lazy initialization) of https://shorturl.at/UP9Tv

  /**
   * directionRef:
   * - allows immediate read/write of direction outside React render
   * - updated synchronously when player changes direction
   */
  const directionRef = useRef(state.direction);
  useEffect(() => {
    directionRef.current = state.direction;
  }, [state.direction]);

  /**
   * lastTurnRef:
   * - prevents more than ONE accepted turn between two move ticks
   * - set true when an input is accepted; reset false only after
   *   the next STEP dispatch occurs (see interval callback below)
   */
  const lastTurnRef = useRef(false);

  /**
   * Interval for game ticks
   * - creates a local interval id and returns cleanup that clears it
   * - the callback dispatches a single STEP action per tick
   * - we pass action.direction using directionRef.current so the reducer
   *   can use the most-recent turn requested by player immediately.
   *
   * Note: we purposely keep the interval id local to the effect and
   * rely on React to run the cleanup before re-running the effect.
   */
  useEffect(() => {
    if (!state.running) return;

    const tickMs = 660 - 6 * state.speed;
    const id = setInterval(() => {
      // dispatch one pure action per tick; reducer will compute the new state
      dispatch({ type: "STEP", direction: directionRef.current, obstacleSet });

      // allow a new turn to be accepted for the next tick using handleDirectionChange()
      lastTurnRef.current = false;
    }, tickMs);

    return () => clearInterval(id);
  }, [state.running, state.speed, obstacleSet]);

  /**
   * Control helpers (clean, small wrappers that dispatch)
   * Note: these are side-effecting functions (dispatch is allowed here).
   */
  const startGame = () => dispatch({ type: "START", obstacleSet }); // shorthand of {type: "START", obstacleSet: obstacleSet}
  const pauseGame = () => dispatch({ type: "PAUSE" });
  const resumeGame = () => dispatch({ type: "RESUME" });
  const toggleRunning = () => {
    if (state.gameOver) return;
    dispatch({ type: state.running ? "PAUSE" : "RESUME" });
  };
  const resetGame = () => {
    // We use START to reinitialize state immediately (no setTimeout needed)
    // Because reducer is pure and START fully resets state, this is safe.
    dispatch({ type: "START", obstacleSet });
    /* shorthand of {obstacleSet : obstacleSet} */

    // Also reset lastTurnRef defensively
    lastTurnRef.current = false;
    directionRef.current = "RIGHT";
  };

  /**
   * handleDirectionChange
   * - rejects inputs when paused or after gameOver
   * - rejects reversing direction directly
   * - prevents multi-turn between ticks using lastTurnRef
   * - updates directionRef immediately (so the interval uses it this tick if needed)
   * - dispatches SET_DIRECTION to keep React state consistent
   */
  const handleDirectionChange = (newDirection) => {
    if (!state.running || state.gameOver) return;

    // block more than one accepted turn between ticks
    if (lastTurnRef.current) return;

    const cur = directionRef.current;

    // prevent direct reverse
    if (
      (cur === "UP" && newDirection === "DOWN") ||
      (cur === "DOWN" && newDirection === "UP") ||
      (cur === "LEFT" && newDirection === "RIGHT") ||
      (cur === "RIGHT" && newDirection === "LEFT")
    ) {
      return;
    }

    // accept this turn: block further turns until next tick
    lastTurnRef.current = true;

    // update immediate-ref so the next STEP uses newest direction
    directionRef.current = newDirection;

    // update reducer state for UI and future logic
    dispatch({ type: "SET_DIRECTION", direction: newDirection });
  };

  /**
   * Keyboard controls
   * - space toggles pause/resume (unless gameOver)
   * - arrow keys / WASD call handleDirectionChange
   */
  useEffect(() => {
    const handler = (e) => {
      console.log("e", e);

      if (e.code === "Space") {
        e.preventDefault();
        if (state.gameOver) return; // don't toggle after game over
        toggleRunning();
        return;
      }

      if (!state.running || state.gameOver) return;

      // if an input was already accepted this tick, ignore
      if (lastTurnRef.current) {
        e.preventDefault();
        return;
      }

      const key = String(e.key || "").toLowerCase();
      let newDir = null;
      if (key === "arrowup" || key === "w") newDir = "UP";
      else if (key === "arrowdown" || key === "s") newDir = "DOWN";
      else if (key === "arrowleft" || key === "a") newDir = "LEFT";
      else if (key === "arrowright" || key === "d") newDir = "RIGHT";

      if (!newDir) return;

      // prevent reversing; use immediate directionRef
      const current = directionRef.current
        ? directionRef.current.toLowerCase()
        : "";
      if (
        { up: "down", down: "up", left: "right", right: "left" }[
          newDir.toLowerCase()
        ] === current
      ) {
        return;
      }

      // accept the turn immediately
      handleDirectionChange(newDir);
      e.preventDefault();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // Intentionally depend on state.running and state.gameOver via closure updates.
    // This is fine because handler checks the latest values each event via refs/state.
  }, [state.running, state.gameOver]);

  /**
   * Context value exposed to consumers
   */
  const value = {
    ROWS,
    COLS,
    TOTAL,
    snake: state.snake,
    head: state.snake[state.snake.length - 1],
    direction: state.direction,
    running: state.running,
    gameOver: state.gameOver,
    speed: state.speed,
    setSpeed: (s) => dispatch({ type: "SET_SPEED", speed: s }),
    score: state.score,
    food: state.food,
    obstacleSet,
    startGame,
    pauseGame,
    resumeGame,
    toggleRunning,
    resetGame,
    handleDirectionChange,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
