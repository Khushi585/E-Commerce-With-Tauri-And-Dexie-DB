import { createContext, useContext, useEffect, useState } from "react";
import { getCart } from "../db/cardService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  async function refreshCart() {
    if (!user) {
      setCount(0);
      return;
    }
    const items = await getCart(user.id);
    setCount(items.reduce((sum, i) => sum + i.qty, 0));
  }

  useEffect(() => {
    refreshCart();
  }, [user]);

  return (
    <CartContext.Provider value={{ count, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
