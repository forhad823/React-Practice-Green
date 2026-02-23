const [food, setFood] = useState(() => {
  const initialBlocked = new Set([...initialSnake, ...obstacleSet]);
  return getRandomEmptyIndex(initialBlocked);
});
const foodRef = useRef(food);
useEffect(() => {
  foodRef.current = food;
}, [food]);

// step() - version-1
const step = () => {
  setSnake((prevSnake) => {
    //...................
    /* --------------------------------
               Food eating logic
              -------------------------------- */
      if (nextHeadIndex === foodRef.current) {
          setScore((prev) => prev + 1);

          // Grow snake (do NOT remove tail)
          const grownSnake = [...prevSnake, nextHeadIndex];

          // Generate new food position
          const blockedCells = new Set([...grownSnake, ...obstacleSet]);
          const newFoodIndex = getRandomEmptyIndex(blockedCells);
          setFood(newFoodIndex);

          // Allow direction change in next tick
          lastTurnRef.current = false;

          return grownSnake;
      +}
  });
};

// step() - version-2
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
          score: state.score + 1,
          food: getRandomEmptyIndex(blocked),
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

const [state, dispatch] = useReducer(gameReducer, initialGameState);

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

    const tickMs = 460 - state.speed;
    const id = setInterval(() => {
      // dispatch one pure action per tick; reducer will compute the new state
      dispatch({ type: "STEP", direction: directionRef.current, obstacleSet });

      // allow a new turn to be accepted for the next tick
      lastTurnRef.current = false;
    }, tickMs);

    return () => clearInterval(id);
  }, [state.running, state.speed, obstacleSet]);





//--------------------------------------------------

const startGame = () => {
    /* ........
    ........... */
    const blocked = new Set([...initialSnake, ...obstacleSet]);
    setFood(getRandomEmptyIndex(blocked));
    /* ............
    .............. */
}


// -----------same code in useState logic----------------
import { useState } from "react";

const Post = () => {
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState({});
  const [error, setError] = useState(false);
  
  const handleFetch = () => {
    setLoading(true);
    setError(false);

    fetch("https://jsonplaceholder.typicode.com/posts/1")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  };

  return (
    <div>
      <button onClick={handleFetch}>
        {loading ? "Wait..." : "Fetch the post"}
      </button>

      <p>{post?.title}</p>

      <span>{error && "Something went wrong!"}</span>
    </div>
  );
};

export default Post;















