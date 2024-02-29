import { render } from "preact";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { store } from "./store";
import { Provider } from "react-redux";
import SinglePlayer from "./singleplayer.tsx";
import Multiplayer from "./multiplayer.tsx";
import HomePage from "./home.tsx";
import ErrorPage from "./error.tsx";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/singleplayer",
    element: <SinglePlayer />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/multiplayer",
    element: (
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Multiplayer />
      </ErrorBoundary>
    ),
  },
]);

render(
  <Provider store={store}>
    <RouterProvider router={router} />,
  </Provider>,
  document.getElementById("app")!
);
