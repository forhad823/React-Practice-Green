let list = Array(9).fill("x");
console.log(list);

// ---------Promt for Chatgpt for the game-------
/* Now please summarize the documentation in a concise way and point out the main facts and don't remember to explain behind the reason of every step and also explain what would happen if we don't put that next step ?  keep all code same while explaining and highlight important keyword and sections from the documentation */

/* https://react.dev/learn/tutorial-tic-tac-toe#:~:text=and%20their%20siblings.-,Implementing%20time%20travel,-In%20the%20tic */

function cookFood() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("🍲 Chef finishes cooking, waiter brings your food.");
    }, 3000); // 3 seconds to cook
  });
}

async function orderFoodAsync() {
  console.log("👨‍🍳 You order food and go sit at your table...");

  // Pause here, but only this function waits. Others can still run.
  const food = await cookFood();

  console.log(food);
  console.log("✅ Now you can eat.");
}

orderFoodAsync();
console.log("📱 Meanwhile, you check your phone.");

fetch("https://jsonplaceholder.typicode.com/users")
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.log(err));

// ++o   o+++++++ the snake.

/**
 * initial Gemini prompt for Snake Xenzia.
 * 
 * 
 * Please read the file structure inside the src directory. From now on, we will be working on recreating the classic Snake Xenzia game similar to the old Nokia mobile version. Carefully review the files and folders including main.jsx, app.css, the layout folder and its files, and all files inside the Snake Xenzia folder. Keep in mind that we may use the React Context API if necessary  

 * 
 */

{
  Array.from({ length: gridSize }).map((_, i) => (
    <div key={i} className="w-6 h-6 border text-center">
      {snake.includes(i) ? (i === snake[snake.length - 1] ? "o" : "+") : ""}
    </div>
  ));
}
