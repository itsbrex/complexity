import { createHashRouter, redirect } from "react-router-dom";

export const createRouter = () =>
  createHashRouter([
    {
      path: "/",
      element: null,
      children: [],
    },
    {
      path: "*",
      element: null,
      loader: () => {
        return redirect("");
      },
    },
  ]);
