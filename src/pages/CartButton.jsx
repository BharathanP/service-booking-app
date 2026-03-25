import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function CartButton() {
  const { cart, setShowCart } = useContext(CartContext);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      onClick={() => setShowCart(true)}
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        cursor: "pointer",
        zIndex: 1100,
      }}
    >
      🛒

      {totalItems > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-8px",
            right: "-10px",
            background: "red",
            color: "#fff",
            borderRadius: "50%",
            padding: "3px 7px",
            fontSize: "12px",
          }}
        >
          {totalItems}
        </span>
      )}
    </div>
  );
}

export default CartButton;