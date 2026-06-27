import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { RestaurantProvider } from "./context/RestaurantContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RestaurantProvider>
      <App />
    </RestaurantProvider>
  </React.StrictMode>
);
