import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./CartSidebar.css";

function CartSidebar() {
  const { cart, removeFromCart, showCart, setShowCart } =
    useContext(CartContext);

  const navigate = useNavigate();

  if (!showCart) return null;

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart-sidebar">
      <h3 className="cart-title">
        <i className="bi bi-cart"></i> Your Cart
      </h3>

      {/* Scrollable section */}
      <div className="cart-items">
        {cart.length === 0 && <p className="empty">No items</p>}

        {cart.map((item) => (
          <div key={item._id} className="cart-item">
            <div>
              <p className="item-name">{item.name}</p>
              <p className="item-details">
                ₹{item.price} • {item.duration} mins
              </p>
            </div>

            <button
              onClick={() => removeFromCart(item._id)}
              className="remove-btn"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Buttons in single row */}
      <div className="cart-actions">
        <button
          disabled={cart.length === 0}
          onClick={() => {
            setShowCart(false);
            navigate("/slot");
          }}
          className="proceed-btn"
        >
          Proceed →
        </button>

        <button onClick={() => setShowCart(false)} className="close-btn">
          Close
        </button>
      </div>
    </div>
  );
}

export default CartSidebar;
