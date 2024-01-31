import { render } from "preact";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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

render(<RouterProvider router={router} />, document.getElementById("app")!);
