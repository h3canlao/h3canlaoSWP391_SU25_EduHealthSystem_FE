import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import Router from "./Router";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <Router />
    </BrowserRouter>
);
