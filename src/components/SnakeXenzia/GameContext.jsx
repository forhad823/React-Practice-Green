// src/components/SnakeXenzia/GameContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  obstacleIds as obstacleStrings,
  ROWS,
  COLS,
  TOTAL,
  getRandomEmptyIndex,
  idToIndex,
  initialSnake,
} from "./utils";

const GameContext = createContext();
export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const obstacleSet = useMemo(() => {
    const s = new Set();
    obstacleStrings.forEach((id) => {
      const idx = idToIndex(id);
      if (idx >= 0 && idx < TOTAL) s.add(idx);
    });
    return s;
  }, [TOTAL]);

  const [snake, setSnake] = useState(initialSnake);
  const [direction, setDirection] = useState("RIGHT");
  const directionRef = useRef(direction);
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(150);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const [food, setFood] = useState(() => {
    const initialBlocked = new Set([...initialSnake, ...obstacleSet]);
    return getRandomEmptyIndex(initialBlocked);
  });
  const foodRef = useRef(food);
  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  // ______________________________________________
  const intervalRef = useRef(null);
  // manage moving interval (cleanly)
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!running) return;

    intervalRef.current = setInterval(() => {
      step();
    }, 460 - speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, speed]);

  // NEW: prevent more than one turn between movement ticks
  const lastTurnRef = useRef(false);

  // step: move one tick depending on directionRef.current
  const step = () => {
    setSnake((prevSnake) => {
      if (!prevSnake || prevSnake.length === 0) return prevSnake;
      const head = prevSnake[prevSnake.length - 1];
      const r = Math.floor(head / COLS);
      const c = head % COLS;

      let nr = r;
      let nc = c;

      const dir = directionRef.current;
      if (dir === "RIGHT") nc = (c + 1) % COLS;
      else if (dir === "LEFT") nc = (c - 1 + COLS) % COLS;
      else if (dir === "UP") nr = (r - 1 + ROWS) % ROWS;
      else if (dir === "DOWN") nr = (r + 1) % ROWS;

      const newHead = nr * COLS + nc;

      // collision detection
      if (obstacleSet.has(newHead) || prevSnake.includes(newHead)) {
        setRunning(false);
        setGameOver(true);
        return prevSnake;
      }

      // eating food
      if (newHead === foodRef.current) {
        // Has the snake head touched the food?
        setScore((s) => s + 1);
        const newSnake = [...prevSnake, newHead]; // grow
        const blocked = new Set([...newSnake, ...obstacleSet]);
        const nextFood = getRandomEmptyIndex(blocked);
        setFood(nextFood);
        // allow next turn after move
        lastTurnRef.current = false;
        return newSnake;
      }

      // normal move (push head, shift tail)
      const moved = [...prevSnake.slice(1), newHead];
      // allow next turn after move
      lastTurnRef.current = false;
      return moved;
    });
  };

  // start/pause/resume/reset
  const startGame = () => {
    setSnake([...initialSnake]);
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    lastTurnRef.current = false;
    setScore(0);
    setGameOver(false);
    const blocked = new Set([...initialSnake, ...obstacleSet]);
    setFood(getRandomEmptyIndex(blocked));
    setRunning(true);
  };
  const pauseGame = () => setRunning(false);
  const resumeGame = () => setRunning(true);
  const toggleRunning = () => {
    if (gameOver) return; // toggle shouldn't work after gameOver.
    setRunning((r) => !r);
  };
  const resetGame = () => {
    setRunning(false);
    setGameOver(false);
    setTimeout(() => startGame(), 50);
  };

  //------change direction using mouseClick and touch-button---------------
  const handleDirectionChange = (newDirection) => {
    // ignore inputs when paused / game over
    if (!running || gameOver) return;

    // prevent rapid multi-turns between ticks
    if (lastTurnRef.current) return;

    const cur = directionRef.current;
    // prevent reversing direction directly
    if (
      (cur === "UP" && newDirection === "DOWN") ||
      (cur === "DOWN" && newDirection === "UP") ||
      (cur === "LEFT" && newDirection === "RIGHT") ||
      (cur === "RIGHT" && newDirection === "LEFT")
    ) {
      return;
    }

    // accept this turn (block further until step runs)
    lastTurnRef.current = true;

    // update both ref and state immediately so step reads correct value
    directionRef.current = newDirection;
    setDirection(newDirection);
  };

  // keyboard controls: robust mapping and safe updates
  useEffect(() => {
    const opposites = { up: "down", down: "up", left: "right", right: "left" };

    const handler = (e) => {
      // space toggles pause/resume (always allowed)
      if (e.code === "Space") {
        e.preventDefault();
        if (gameOver) return;
        setRunning((r) => !r);
        return;
      }

      // direction keys should be ignored when paused or game over
      if (!running || gameOver) return;

      // prevent multiple changes between move ticks
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

      // prevent immediate reversal
      const current = directionRef.current
        ? directionRef.current.toLowerCase()
        : "";
      if (opposites[newDir.toLowerCase()] === current) {
        // ignore reverse command
        return;
      }

      lastTurnRef.current = true;
      setDirection(newDir);
      directionRef.current = newDir;
      e.preventDefault();
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      console.log("event listener removed");
    };
  }, [running, gameOver]);

  const value = {
    ROWS,
    COLS,
    TOTAL,
    snake,
    head: snake[snake.length - 1],
    direction,
    setDirection,
    handleDirectionChange,
    running,
    gameOver,
    speed,
    setSpeed,
    food,
    score,
    obstacleSet,
    startGame,
    pauseGame,
    resumeGame,
    toggleRunning,
    resetGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
