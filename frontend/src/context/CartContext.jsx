import { createContext, useContext, useState } from "react";

const CartCtx = createContext(null);

export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const add = (product, qty = 1) => {
    setItems(prev => {
      const ex = prev.find(i => i._id === product._id);

      if (ex) {
        return prev.map(i =>
          i._id === product._id
            ? { ...i, qty: i.qty + qty }
            : i
        );
      }

      return [...prev, { ...product, qty }];
    });
  };

  const remove = id => {
    setItems(prev => prev.filter(i => i._id !== id));
  };

  const update = (id, qty) => {
    if (qty < 1) return remove(id);

    setItems(prev =>
      prev.map(i => (i._id === id ? { ...i, qty } : i))
    );
  };

  const clear = () => setItems([]);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartCtx.Provider value={{ items, add, remove, update, clear, total, count }}>
      {children}
    </CartCtx.Provider>
  );
}