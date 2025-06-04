import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import Router from "./Router";
import { GoogleOAuthProvider } from "@react-oauth/google";
const CLIENT_ID =
  "159726483935-h77l3r61av1umb0lg04o1u3pd4bnu5n3.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={CLIENT_ID}>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </GoogleOAuthProvider>
);
