import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  
  const [items, setItems] = useState(() => {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!user) setItems([]); // Clear cart on logout
  }, [user]);

  const add = (book) => {
    setItems((prev) => {
      const existing = prev.find((b) => b._id === book._id);
      if (existing) {
        return prev.map((b) => b._id === book._id ? { ...b, quantity: b.quantity + 1 } : b);
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  };
  
  const remove = (id) => setItems((p) => p.filter((b) => b._id !== id));

  const decrement = (id) => {
    setItems((prev) => {
      const existing = prev.find((b) => b._id === id);
      if (existing && existing.quantity > 1) {
        return prev.map((b) => b._id === id ? { ...b, quantity: b.quantity - 1 } : b);
      }
      return prev.filter((b) => b._id !== id); // Remove if quantity is 1
    });
  };
  
  const clear = () => setItems([]);
  
  const total = items.reduce((s, b) => s + ((b.price || 0) * b.quantity), 0);

  return (
    <CartContext.Provider value={{ items, add, remove, decrement, clear, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);