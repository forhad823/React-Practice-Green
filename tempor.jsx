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
const initialGameState = {
  snake: initialSnake,
  direction: "RIGHT",
  running: false,
  gameOver: false,
  score: 0,
  food: null,
};

function gameReducer(state, action) {
  switch (action.type) {
    case "START": {
      const blocked = new Set([...initialSnake, ...action.obstacleSet]);
      return {
        ...initialGameState,
        running: true,
        food: getRandomEmptyIndex(blocked),
      };
    }

    case "STEP": {
      if (!state.running || state.gameOver) return state;

      const prevSnake = state.snake;
      const head = prevSnake[prevSnake.length - 1];

      const row = Math.floor(head / COLS);
      const col = head % COLS;

      let nextRow = row;
      let nextCol = col;

      switch (action.direction) {
        case "RIGHT": nextCol = (col + 1) % COLS; break;
        case "LEFT":  nextCol = (col - 1 + COLS) % COLS; break;
        case "UP":    nextRow = (row - 1 + ROWS) % ROWS; break;
        case "DOWN":  nextRow = (row + 1) % ROWS; break;
      }

      const nextHead = nextRow * COLS + nextCol;

      // collision
      if (
        action.obstacleSet.has(nextHead) ||
        prevSnake.includes(nextHead)
      ) {
        return { ...state, running: false, gameOver: true };
      }

      // eat food
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

      // normal move
      return {
        ...state,
        snake: [...prevSnake.slice(1), nextHead],
      };
    }

    case "SET_DIRECTION":
      return { ...state, direction: action.direction };

    case "PAUSE":
      return { ...state, running: false };

    case "RESUME":
      return { ...state, running: true };

    default:
      return state;
  }
}

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















