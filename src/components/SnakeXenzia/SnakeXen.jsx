import React from "react";
import SnakeInterface from "./SnakeInterface";
import Sidebar from "./Sidebar";

const SnakeXen = () => {
  return (
    <>
      <div className="flex gap-2">
        {/*.... interface...... */}
        <SnakeInterface />
        {/*...... side bar... */}
        <Sidebar />
      </div>
    </>
  );
};


export default SnakeXen;

