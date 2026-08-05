import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ContextProvider } from "./contextApi/ContextApi"; // <-- Adjust the path if needed

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </StrictMode>
);