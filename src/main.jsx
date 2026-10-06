import React from "react";
import { createRoot } from "react-dom/client";
import { depoKur } from "./storage.js";
import App from "./App.jsx";

depoKur();
createRoot(document.getElementById("root")).render(<App />);
