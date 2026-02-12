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

