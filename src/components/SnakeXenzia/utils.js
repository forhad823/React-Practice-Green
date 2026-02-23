// src/components/SnakeXenzia/utils.js
export const obstacleIds = [
  "a4",
  "b4",
  "c4",
  "d4",
  "e4",
  "e5",
  "e6",
  "e7",
  "e8",
  "e9",
  "e10",
  "e11",
  "e12",
  "l0",
  "l1",
  "l2",
  "l3",
  "l4",
  "l5",
  "l6",
  "l7",
  "m7",
  "n7",
  "o7",
  "p7",
];

export const ROWS = 16;
export const COLS = 13;
export const TOTAL = ROWS * COLS;

const idToIndex = (id) => {
  console.log("idToIndex runned");
  if (!id || id.length < 2) return -1;
  const rowChar = id[0];
  const col = parseInt(id.slice(1), 10);
  if (Number.isNaN(col)) return -1;
  const rowIndex = rowChar.charCodeAt(0) - 97;
  return rowIndex * COLS + col;
};

/**
 * ---------------------------
 * Helper: build obstacle set
 * ---------------------------
 */
const makeObstacleSet = () => {
  const s = new Set();
  obstacleIds.forEach((id) => {
    const idx = idToIndex(id);
    if (idx >= 0 && idx < TOTAL) s.add(idx);
  });
  return s;
};
export const obstacleSetStatic = makeObstacleSet(); // stable across provider mounts

export const getRandomEmptyIndex = (blockedSet) => {
  const empties = [];
  for (let i = 0; i < TOTAL; i++) {
    if (!blockedSet.has(i)) empties.push(i);
  }
  return empties.length
    ? empties[Math.floor(Math.random() * empties.length)]
    : null;
};

export const initialSnake = [108, 109, 110];
