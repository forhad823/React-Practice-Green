# 🐍 SnakeXenzia

A classic Snake game built with **React**, **useReducer**, and **Context API** — designed as a learning project that demonstrates real-world state management patterns in a fun, playable game.

---

## 📁 Folder Structure

```
SnakeXenzia/
├── utils.js              # Constants, helpers, obstacle definitions
├── GameContext.jsx        # Core game logic (state, reducer, controls)
├── SnakeXen.jsx           # Root component (assembles the UI)
├── SnakeInterface.jsx     # Game board + touch controls + overlays
├── SquareBlocks.jsx       # Individual grid cell renderer
├── Sidebar.jsx            # Speed slider, high score, New Game button
└── DocumentationSnake.js  # Developer notes and learning references
```

---

## 🧠 Architecture Overview

```
SnakeXen (root)
├── GameProvider  ← wraps everything; holds all state & logic
│   ├── SnakeInterface  ← renders the board + controls
│   │   └── SquareBlocks (×TOTAL)  ← one cell per grid index
│   └── Sidebar  ← speed, score, new game
```

> **Key design decision:** All game state lives inside `GameContext`. Child components only _read_ state and _call_ actions — they never manage game logic themselves. This is the standard React pattern for shared state.

---

## 📄 File-by-File Breakdown

---

### `utils.js` — Constants and Helpers

This file is the foundation. It defines the numbers and rules that everything else depends on.

```js
export const ROWS = 16; // grid height
export const COLS = 13; // grid width
export const TOTAL = ROWS * COLS; // 208 cells total
```

**How the grid works:**

The game board is a flat array of 208 numbers (`0` to `207`), not a 2D array. Each number is a "cell index."

```
Index 0  = row 0, col 0  (top-left)
Index 12 = row 0, col 12 (top-right)
Index 13 = row 1, col 0  (second row, first column)
...
```

To convert between index and row/col:

```js
const row = Math.floor(index / COLS);
const col = index % COLS;
const index = row * COLS + col;
```

**Obstacles:**

Obstacles are defined using a letter+number ID system (e.g. `"a4"`, `"e7"`). The letter is the row (`a` = row 0, `b` = row 1, etc.) and the number is the column.

```js
export const obstacleIds = ["a4", "b4", "e7", "l0", ...];
```

The `idToIndex()` function converts these IDs to flat array indices. The result is stored in `obstacleSetStatic` — a `Set` of numeric indices that never changes during the game.

**`getRandomEmptyIndex(blockedSet)`:**

Finds a random empty cell — used to place food somewhere that isn't the snake, an obstacle, or another blocked cell.

**`initialSnake`:**

```js
export const initialSnake = [108, 109, 110];
```

Three cells near the middle of the board. The snake is stored as an ordered array where **the last element is always the head**.

---

### `GameContext.jsx` — The Brain

This is the most important file. It manages all game state using `useReducer`, runs the game loop with `setInterval`, and exposes everything to child components via React Context.

---

#### State Shape

```js
{
  snake: [108, 109, 110],   // array of cell indices, tail → head
  direction: "RIGHT",        // current movement direction
  running: false,            // is the game actively ticking?
  gameOver: false,           // did the snake die?
  score: 0,                  // current score
  food: 42,                  // cell index where food is placed
  speed: 30,                 // speed level (11–100)
}
```

---

#### The Reducer — `gameReducer`

A **pure function** that takes the current state + an action, and returns the next state. It never mutates state directly and has no side effects.

| Action Type     | What It Does                                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------------------------------- |
| `START`         | Resets everything: snake, direction, score, food. Receives `obstacleSet` to avoid placing food on obstacles.     |
| `PAUSE`         | Sets `running: false`. Game loop stops via `useEffect` cleanup.                                                  |
| `RESUME`        | Sets `running: true`. Game loop restarts.                                                                        |
| `SET_DIRECTION` | Updates the stored direction. UI stays consistent.                                                               |
| `SET_SPEED`     | Updates `speed`. The interval delay recalculates on next tick.                                                   |
| `STEP`          | The core movement tick. Calculates next head position, checks collisions, handles eating, or does a normal move. |

**How `STEP` works:**

```
1. Get current head index
2. Convert to row/col
3. Add direction offset (with wrapping at edges)
4. Convert back to index → nextHead
5. Check: is nextHead an obstacle or part of the snake? → GAME OVER
6. Check: is nextHead the food? → GROW snake, place new food, add score
7. Otherwise: remove tail, append new head (normal move)
```

**Score formula:**

```js
score: state.score + Math.floor(state.speed / 10);
```

Higher speed = more points per food eaten.

---

#### The Game Loop

```js
useEffect(() => {
  if (!state.running) return;

  const tickMs = 660 - 6 * state.speed; // faster speed = shorter interval
  const id = setInterval(() => {
    dispatch({ type: "STEP", direction: directionRef.current, obstacleSet });
    lastTurnRef.current = false; // allow next direction input
  }, tickMs);

  return () => clearInterval(id); // cleanup when paused, speed changes, or unmount
}, [state.running, state.speed, obstacleSet]);
```

> **Why `directionRef`?** React state updates are asynchronous. If we read `state.direction` inside `setInterval`, we'd get a stale value. A `ref` updates _immediately_ and can be read synchronously inside the interval callback.

---

#### Refs Explained

| Ref            | Purpose                                                                                              |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| `directionRef` | Stores the _latest_ direction so the interval always uses the most recent input                      |
| `lastTurnRef`  | Prevents the player from buffering multiple turns between two ticks (anti-cheat for smooth movement) |

---

#### Direction Change Logic

`handleDirectionChange(newDirection)` runs when:

- An arrow key / WASD key is pressed
- A touch control button is tapped

It checks four things before accepting a turn:

1. Is the game running? If not, ignore.
2. Has a turn already been accepted this tick? If yes, ignore (prevents "double-turning").
3. Is the new direction the _exact opposite_ of current? (e.g. going RIGHT, pressing LEFT) — illegal move, ignore.
4. Otherwise: update `directionRef` immediately + dispatch `SET_DIRECTION` to keep state consistent.

---

#### Keyboard Controls

Registered with `window.addEventListener("keydown", handler)` inside a `useEffect`. The listener is re-registered when `state.running` or `state.gameOver` changes (so it always has fresh values via closure).

| Key                  | Action         |
| -------------------- | -------------- |
| `Space`              | Pause / Resume |
| `Arrow Up` or `W`    | Move UP        |
| `Arrow Down` or `S`  | Move DOWN      |
| `Arrow Left` or `A`  | Move LEFT      |
| `Arrow Right` or `D` | Move RIGHT     |

---

#### Context Value (what child components receive)

```js
{
  // Grid info
  ROWS, COLS, TOTAL,

  // Game state
  snake, head, direction, running, gameOver, speed, score, food, obstacleSet,

  // Actions
  startGame, pauseGame, resumeGame, toggleRunning, resetGame,
  setSpeed, handleDirectionChange,
}
```

---

### `SnakeXen.jsx` — Root Component

The top-level component. It imports `SnakeInterface` and `Sidebar` and lays them out side by side (column on mobile, row on desktop via Tailwind's `md:flex-row`).

```jsx
<div className="flex flex-col md:flex-row gap-4 items-start">
  <SnakeInterface />
  <Sidebar />
</div>
```

> **Note:** `GameProvider` must wrap `SnakeXen` somewhere in the app tree (e.g. in the parent route or `App.jsx`) for the context to be available.

---

### `SnakeInterface.jsx` — Game Board + Controls

Renders three things:

**1. Header bar** — Score display + Pause/Resume + New Game buttons.

**2. Game board** — A CSS Grid of `TOTAL` (208) cells, each rendered by `<SquareBlocks index={idx} />`.

```jsx
<div
  style={{
    display: "grid",
    gridTemplateColumns: `repeat(${COLS}, 20px)`,
    gridAutoRows: "20px",
  }}
>
  {cells.map((idx) => (
    <SquareBlocks key={idx} index={idx} />
  ))}
</div>
```

Each cell is 20×20px. The grid is 13 columns × 16 rows = 260×320px.

**3. Touch controls** — D-pad style buttons (⬆️ ⬅️ ➡️ ⬇️) plus a Pause/Resume button in the center. Calls `handleDirectionChange()` on tap.

**4. Game Over overlay** — Shown when `gameOver === true`. Replaces the board with a dark overlay showing the final score and a Restart button.

---

### `SquareBlocks.jsx` — Individual Cell

The smallest unit of the game board. Renders **one div** per cell index.

It reads from context and decides what to display:

```js
const isHead = head === index;
const isBody = snake.includes(index) && !isHead;
const isFood = food === index;
const isObstacle = obstacleSet.has(index);
```

| State    | Background Color | Character |
| -------- | ---------------- | --------- |
| Head     | `bg-green-700`   | `o`       |
| Body     | `bg-green-500`   | `+`       |
| Food     | `bg-yellow-300`  | `●`       |
| Obstacle | `bg-red-500`     | _(none)_  |
| Empty    | `bg-blue-200`    | _(none)_  |

> **Performance note:** `snake.includes(index)` is O(n) — fine for a small snake. For very long snakes, consider converting `snake` to a `Set` for O(1) lookup.

---

### `Sidebar.jsx` — Settings Panel

A simple panel on the right side with:

**Speed Slider:**

```jsx
<input
  type="range"
  min="11"
  max="100"
  value={speed}
  onChange={(e) => setSpeed(Number(e.target.value))}
/>
```

Dispatches `SET_SPEED` which recalculates the interval delay.

**High Score (localStorage):**

```js
const [high, setHigh] = useState(() =>
  Number(localStorage.getItem("snakeHigh") || 0),
);

useEffect(() => {
  if (score > high) {
    setHigh(score);
    localStorage.setItem("snakeHigh", String(score));
  }
}, [score]);
```

The high score persists across browser sessions using `localStorage`. It's initialized lazily (function form of `useState`) so it only reads from storage once on mount.

---

### `DocumentationSnake.js` — Developer Notes

Not runtime code — a reference file with four detailed notes:

| Note      | Topic                                                                 |
| --------- | --------------------------------------------------------------------- |
| `note-a1` | Difference between "patch" and "dispatch"                             |
| `note-1`  | How `useEffect` + `setInterval` + cleanup works                       |
| `note-2`  | What the `STEP` function does                                         |
| `note-3`  | Why `resetGame` used `setTimeout` (now replaced with direct dispatch) |
| `note-4`  | Why `START` dispatch sends `obstacleSet` but `PAUSE` doesn't          |

---

## 🔄 Data Flow Summary

```
Player presses key / taps button
        ↓
handleDirectionChange(newDir)
        ↓
directionRef.current = newDir   ← immediate (no re-render)
dispatch({ type: "SET_DIRECTION", direction: newDir })  ← async React state update
        ↓
setInterval fires every tickMs
        ↓
dispatch({ type: "STEP", direction: directionRef.current, obstacleSet })
        ↓
gameReducer computes new state (pure)
        ↓
React re-renders affected components
        ↓
SquareBlocks re-render with new snake/food positions
```

---

## 🚀 How to Run

**1. Install dependencies** (if not already done):

```bash
npm install
```

**2. Make sure Tailwind CSS is configured** in your project. The components use Tailwind utility classes extensively.

**3. Wrap the component with `GameProvider`** somewhere in your app:

```jsx
// App.jsx or a route component
import { GameProvider } from "./SnakeXenzia/GameContext";
import SnakeXen from "./SnakeXenzia/SnakeXen";

function App() {
  return (
    <GameProvider>
      <SnakeXen />
    </GameProvider>
  );
}
```

**4. Start the dev server:**

```bash
npm run dev
```

---

## 🎮 How to Play

| Input                     | Action                    |
| ------------------------- | ------------------------- |
| `Arrow Keys` or `W A S D` | Change direction          |
| `Space`                   | Pause / Resume            |
| On-screen D-pad           | Change direction (mobile) |
| On-screen Pause button    | Pause / Resume (mobile)   |

- Eat the yellow `●` food to grow and score points
- Avoid red obstacle blocks and your own body
- Increase speed in the sidebar for higher scores per food
- High score is saved in your browser automatically

---

## 🧩 Key Concepts Used

| Concept                        | Where                            | Why                                                                 |
| ------------------------------ | -------------------------------- | ------------------------------------------------------------------- |
| `useReducer`                   | `GameContext.jsx`                | Centralised, predictable state transitions                          |
| `createContext` / `useContext` | `GameContext.jsx`, all consumers | Share state without prop drilling                                   |
| `useRef`                       | `GameContext.jsx`                | Synchronous, render-free value storage for direction and tick guard |
| `setInterval` + cleanup        | `GameContext.jsx`                | Drives the game loop; cleanup prevents stacked timers               |
| `useMemo`                      | `GameContext.jsx`                | Stabilises `obstacleSet` reference across renders                   |
| Lazy `useState` init           | `Sidebar.jsx`                    | Reads `localStorage` only once on mount                             |
| CSS Grid                       | `SnakeInterface.jsx`             | Efficiently lays out all 208 cells                                  |
| Flat array as 2D grid          | `utils.js`, `GameContext.jsx`    | Simpler index math than nested arrays                               |

---

## 🛠️ Suggested Improvements

These are noted in `SnakeXen.jsx` and are great next steps for practice:

- **Eating sound** — play a short audio clip when food is consumed
- **Collision sound** — play on game over
- **Background music** — start when game starts, pause when game is paused (not on game over), stop on game over
- **Animated transitions** — smooth the snake movement with CSS transitions
- **Difficulty levels** — preset speed configs (Easy / Medium / Hard)
- **Mobile swipe gestures** — detect `touchstart`/`touchend` for swipe-based controls
- **Performance** — replace `snake.includes(index)` with a `Set` for O(1) body collision checks

---

## 📚 Further Reading

- [React `useReducer` docs](https://react.dev/reference/react/useReducer)
- [React Context docs](https://react.dev/reference/react/createContext)
- [React `useEffect` + `setInterval` pattern](https://overreacted.io/making-setinterval-declarative-with-react-hooks/)
- [Lazy initialization with `useReducer`](https://shorturl.at/UP9Tv)

---

_Built as a hands-on React learning project. All game logic is intentionally commented and documented for educational clarity._
