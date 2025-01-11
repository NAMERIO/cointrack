import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import CoinDetails from "./components/CoinDetails";
import ThemedApp from "./ThemedApp";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <ThemedApp>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/coin/:id" element={<CoinDetails />} />
        </Routes>
      </ThemedApp>
    </Router>
  </React.StrictMode>
);
