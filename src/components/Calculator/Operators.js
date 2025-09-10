/* // Problem: How can i set the below's two variable in a way so that they doesn't execute before finishing the execution of all UI components and      i can access them in every below's function globally without rewriting them in every function ???
 */

let result; // declaring result variable.
let active = true; // {c4}
let operator = ""; // {c5}

function helper(display, InputBox) {
  if (!display || !InputBox) {
    console.error("Display or InputBox is missing!");
    return;
  }
  let inputNumber = Number(InputBox.value); //it is converting number from string value of InputBox. When the value of InputBox is empty ( didn't input any number but still pressed any of the operators), it returns 0 as the Number conversion of "" empty string is 0. this inputNumber variable is storing the converted number.

  console.log("test3 inputNumber", inputNumber);
  display.value += inputNumber; // updating display

  // "" now, updating result according to the last pressed operator"""
  if (operator === "") result = inputNumber;
  if (operator === "+") result += inputNumber;
  if (operator === "-") result -= inputNumber;
  if (operator === "*") result *= inputNumber;
  if (operator === "/") result /= inputNumber;

  InputBox.value = ""; // {clearing InputBox after pressing every operator}
  // return inputNumber;
}
export function handleAdd(display, InputBox) {
  if (!active) return;
  helper(display, InputBox);
  display.value += "+"; // updating display
  operator = "+"; // updating the value of operator.
}
export function handleMultiply(display, InputBox) {
  if (!active) return;

  helper(display, InputBox);
  display.value += "*";
  operator = "*";
}
export function handleResult(display, InputBox) {
  if (!active) return;

  active = false;
  helper(display, InputBox);
  display.value += "=" + result;
  operator = "";

  InputBox.setAttribute("disabled", true);
}

export function handleDevide(display, InputBox) {
  if (!active) return;

  helper(display, InputBox);
  display.value += "/";
  operator = "/";
}
export function handleSubtract(display, InputBox) {
  if (!active) return;

  helper(display, InputBox);
  display.value += "-";
  operator = "-";
}

export function handleClear(display, InputBox) {
  display.value = "";
  result = 0;
  active = true;

  InputBox.removeAttribute("disabled");
}

// ____________________Code comments__________________________
/*  'display'{c2}  is the very top box of the calculator where it will show all the calculation visually after entering digits in the
 'InputBox'{c3} and then pressing operators.

 {c5} i declared the mutable variable 'operator' using let as a temporary memory, so that it can remember what was the last operator has been pressed since any operator doesn't calculate any operation when we pressing any of the operator for the first time. so i set the initial value of operator as "" empty string and then changes time to time (when pressing every operator) so that all operators can recall which operator has been pressed before him.  
 Because it needs to keep updating result according to the last operation like a real calculator in a button-mobile where it keeps calculating and updating the result regardless of pressing any of the operator among +,*,-,/,= .
 
 */
