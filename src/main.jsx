import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { AuthProvider } from "@/context/AuthContext";
import "./index.css";
import { seedProducts } from "@/db/productSeed";
import { CartProvider } from "./context/CartContext";

seedProducts(); 


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
   <AuthProvider>
  <CartProvider>
    <App />
  </CartProvider>
</AuthProvider>

  </React.StrictMode>
);
