import React, { useState } from "react";

const Introduction = () => {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <br />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
};

function MyButton({ count, onClick }) {
  return (
    <button className="bg-amber-200 rounded-lg border m-4" onClick={onClick}>
      Clicked {count} times
    </button>
  );
}

export default Introduction;
