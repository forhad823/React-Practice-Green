export let obstacleIds = [
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

// --------------------------------------
let snake = [0, 1, 2]; // snake body (head = last element)
let gridSize = 13; // horizontal width of "board"

export function moveRight() {
  let oldSnake = [...snake];  
  for (let i = 0; i < oldSnake.length; i++) {
    document.getElementById("j" + snake[i]).innerText = ""; // to remove the whole snake from the old place so that it looks like moving.
  }
  let head = snake[snake.length - 1]; // last element
  let newHead = (head + 1) % gridSize; // wrap-around
  snake.push(newHead); // add new
  snake.shift(); // remove tail
  document.getElementById("j" + newHead).innerText = "o"; // set the newHead's element separately
  for (let i = 0; i < snake.length - 1; i++) {
    // without head, rest of elements will be set as tails.
    document.getElementById("j" + snake[i]).innerText = "+";
  }
  console.log("snake", snake);
}
