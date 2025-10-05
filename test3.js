// ____________OOP practice________________________

function little(a, b) {
  return a + b;
}
const lName = "Uddin";

class Truck {
  constructor(star = little, lastname = lName) {
    this.driver = "forhad";
    this.lastname = lastname;
    this.frontWheel = 2;
    this.rearWheel = 4;
    this.star = star; //(this.frontWheel, this.rearWheel);
  }
}

const truck2 = new Truck();
// console.log(truck2);

// console.log(null + 0);

// _______________________________________________

let snake = [0, 1, 2]; // snake body (head = last element)
let gridSize = 13; // horizontal width of "board"

// function to move snake right (with wrap-around)
function moveRight() {
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

setInterval(moveRight, 500);
// let id = setInterval(moveRight, 500);
// setTimeout(() => clearInterval(id), 10000);

/**
 * please set any normal defendecies in the useEffect using setTimeout or something so i can literally see the change of defeendecy that make the return statement to be executed.
 */
