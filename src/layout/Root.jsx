import React, { useState } from "react";
// import Header from "../components/Header/Header";
// import { Outlet } from "react-router";
// import Calculator from "../components/Calculator/Calculator";
import SnakeXen from "../components/SnakeXenzia/SnakeXen";
import { GameProvider } from "../components/SnakeXenzia/GameContext";
import Form from "../components/Form/Form";

// const Root = () => {
//   return (
//     <>
//       {/* <Header />
//       <Outlet /> */}
//       {/* <Calculator /> */}
//       <GameProvider>
//         <div className="p-4">
//           <SnakeXen />
//         </div>
//       </GameProvider>
//     </>
//   );
// };

const Root = () => {
  const [show, setShow] = useState(true);

  return (
    <>
      <button
        onClick={() => setShow((s) => !s)}
        className="mb-4 px-3 py-1 bg-red-600 text-white"
      >
        Toggle Game Mount
      </button>

      {show && (
        <GameProvider>
          <SnakeXen />
        </GameProvider>
      )}

      <Form />
    </>
  );
};
export default Root;
