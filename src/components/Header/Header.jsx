import React from "react";
import { NavLink } from "react-router";
// ----------Promise.all-----------------
// const moneyRequest = new Promise((resolve, reject) => {
//   setTimeout(() => resolve("Request submitted!"), 1000);
// });

// const transferMoney = new Promise((resolve, reject) => {
//   setTimeout(() => resolve("Money transferred!"), 2000);
// });

// const payFee = new Promise((resolve, reject) => {
//   setTimeout(() => resolve("Fee paid!"), 1500);
// });

// Promise.all([moneyRequest, transferMoney, payFee])
//   .then((results) => {
//     console.log(results);
//   })
//   .catch((error) => {
//     console.log("Error: ", error);
//   });

// Output: ["Request submitted!", "Money transferred!", "Fee paid!"];

// ----------------------------------------

const payAmount = (amount) =>
  new Promise((resolve, reject) => {
    if (amount > 0) {
      setTimeout(() => resolve("payment succeed"), 1000);
    } else {
      setTimeout(() => reject("payment failed"), 2000);
    }
  })
    .then((msg) => {
      console.log(msg); // handle success
      return msg; // still return the value if needed
    })
    .catch((err) => {
      console.error(err); // handle error
      return err; // return error so it doesn’t crash
    });

payAmount(0);
payAmount(-1);
payAmount(2);

fetch("https://jsonplaceholder.typicode.com/users")
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.log(err));

const loadData = fetch("https://jsonplaceholder.typicode.com/todos/1")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
loadData();

const Header = () => {
  return (
    <>
      <NavLink to="/">Home</NavLink>
    </>
  );
};

export default Header;
