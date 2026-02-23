/* Full syntax of useReducer Hook */
import { useReducer } from "react";
// official syntax
// const [state, dispatch] = useReducer(reducer, initialArg, init ?)
/* Full Structure Overview
      ----- main parts: ---------
      Initial state
      Reducer function
      useReducer call
      Dispatching actions 
*/

import { useReducer } from "react";

const initialState = { count: 0 };


function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };

    case "DECREMENT":
      return { count: state.count - 1 };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState); // memorize this syntax

  return (
    <>
      <p>{state.count}</p>

      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>

      <button onClick={() => dispatch({ type: "DECREMENT" })}>-</button>

      <button onClick={() => dispatch({ type: "RESET" })}>Reset</button>
    </>
  );
}

/* Third Argument (Lazy Initialization)
Advanced syntax: */
const [state, dispatch] = useReducer(reducer, initialArg, initFunction);
//example
/* 
function init(initialValue) {
  return { count: initialValue };
}
const [state, dispatch] = useReducer(reducer, 10, init); 
*/


// -----------same code in useReducer logic----------------

import { useReducer } from "react";

/* 1. Initial state */
const initialState = {
  loading: false,
  post: {},
  error: false,
};

/* 2. Reducer function */
const postReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        loading: true,
        error: false,
      };

    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        post: action.payload,
      };

    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        error: true,
      };

    default:
      return state;
  }
};

const Post = () => {
  /* 3. useReducer hook */
  const [state, dispatch] = useReducer(postReducer, initialState);

  /* 4. Fetch handler */
  const handleFetch = () => {
    dispatch({ type: "FETCH_START" });

    fetch("https://jsonplaceholder.typicode.com/posts/1")
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      })
      .catch(() => {
        dispatch({ type: "FETCH_ERROR" });
      });
  };

  return (
    <div>
      <button onClick={handleFetch}>
        {state.loading ? "Wait..." : "Fetch the post"}
      </button>

      <p>{state.post?.title}</p>

      <span>{state.error && "Something went wrong!"}</span>
    </div>
  );
};

export default Post;
