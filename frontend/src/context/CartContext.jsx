import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // {product, quantity, spice_level}

  const addItem = (product, quantity = 1, spice_level = 3) => {
    setItems((prev) => {
      const existing = prev.find(
        (it) => it.product.id === product.id && it.spice_level === spice_level
      );
      if (existing) {
        return prev.map((it) =>
          it.product.id === product.id && it.spice_level === spice_level
            ? { ...it, quantity: it.quantity + quantity }
            : it
        );
      }
      return [...prev, { product, quantity, spice_level }];
    });
  };

  const updateQuantity = (productId, spice_level, delta) => {
    setItems((prev) =>
      prev
        .map((it) =>
          it.product.id === productId && it.spice_level === spice_level
            ? { ...it, quantity: Math.max(1, it.quantity + delta) }
            : it
        )
    );
  };

  const removeItem = (productId, spice_level) => {
    setItems((prev) =>
      prev.filter((it) => !(it.product.id === productId && it.spice_level === spice_level))
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce(
    (sum, it) => sum + Number(it.product.price) * it.quantity,
    0
  );

  const totalItems = items.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, subtotal, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
