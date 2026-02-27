import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Catalog } from "./pages/Catalog";
import { CarDetail } from "./pages/CarDetail";
import { Contact } from "./pages/Contact";
import { About } from "./pages/About";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "catalogo",
        Component: Catalog,
      },
      {
        path: "auto/:id",
        Component: CarDetail,
      },
      {
        path: "contatti",
        Component: Contact,
      },
      {
        path: "chi-siamo",
        Component: About,
      },
    ],
  },
]);
