// src/components/SnakeXenzia/SnakeXen.jsx
import React from "react";
import SnakeInterface from "./SnakeInterface";
import Sidebar from "./Sidebar";

const SnakeXen = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start">
      <SnakeInterface />
      <Sidebar />
    </div>
  );
};

export default SnakeXen;
