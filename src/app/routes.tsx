import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Layout } from "./components/Layout";
import { Teams } from "./components/Teams";
import { FirstRoundSubmissions } from "./components/FirstRoundSubmissions";
import { SecondRoundSubmissions } from "./components/SecondRoundSubmissions";
import { Login } from "./components/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, Component: Teams },
          { path: "first-round", Component: FirstRoundSubmissions },
          { path: "second-round", Component: SecondRoundSubmissions },
        ],
      },
    ],
  },
]);