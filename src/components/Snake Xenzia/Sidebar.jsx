import React from "react";

const Sidebar = () => {
  return (
    <>
      <div>
        <ul>
          {/* possibly dropdown implementation needed for level(speed) and sounds (on off) */}
          <button>New Game</button>
          <li>level</li>
          {/*Local Storage implementation needed to keep high scores  */}
          <li>High Scores</li>
          <li>Sounds</li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
