import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { RestaurantProvider } from "./context/RestaurantContext";
import { ModalProvider } from "./context/ModalContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RestaurantProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </RestaurantProvider>
  </React.StrictMode>
);
