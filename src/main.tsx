import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initMotion } from "./lib/motion";
import "./index.css";

initMotion();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
