// src/App.jsx

import { Outlet, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "@/components/Header"; // Import Header component
import Homepage from "./pages/Homepage";
import Router from "./Router";

const App = () => {
  return (
    <div className="app-container">
      <Router />
    </div>
  );
};

export default App;
