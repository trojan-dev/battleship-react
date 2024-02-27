import { render } from "preact";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from "./store";
import { Provider } from "react-redux";
import SinglePlayer from "./singleplayer.tsx";
import Multiplayer from "./multiplayer.tsx";
import HomePage from "./home.tsx";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/singleplayer",
    element: <SinglePlayer />,
  },
  {
    path: "/multiplayer",
    element: <Multiplayer />,
  },
]);

render(
  <Provider store={store}>
    <RouterProvider router={router} />,
  </Provider>,
  document.getElementById("app")!
);
