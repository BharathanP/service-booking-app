import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (service) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === service._id);
      if (existing) {
        return prev.map((item) =>
          item._id === service._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...service, quantity: 1 }];
      }
    });

    setShowCart(true);
  };

  const removeFromCart = (_id) => {
    setCart((prev) => prev.filter((item) => item._id !== _id));
  };

  const clearCart = () => {
    setCart([]); // ✅ IMPORTANT
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart, // ✅ MUST
        totalPrice,
        showCart,
        setShowCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};