import React from "react";
// import Header from "../components/Header/Header";
// import { Outlet } from "react-router";
// import Calculator from "../components/Calculator/Calculator";
import SnakeXen from "../components/SnakeXenzia/SnakeXen";
import { GameProvider } from "../components/SnakeXenzia/GameContext";

const Root = () => {
  return (
    <>
      {/* <Header />
      <Outlet /> */}
      {/* <Calculator /> */}
      <GameProvider>
        <div className="p-4">
          <SnakeXen />
        </div>
      </GameProvider>
    </>
  );
};

export default Root;
