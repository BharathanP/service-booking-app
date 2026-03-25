import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import axios from "axios";

export default function BookingSummaryPage() {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { date, time, services } = location.state || {};

  const [loading, setLoading] = useState(false);

  // Calculate total price
  const totalPrice = services?.reduce((sum, s) => sum + Number(s.price || 0), 0) || 0;

  const handleConfirmBooking = async () => {
    if (!date || !time || !services || services.length === 0) {
      alert("Invalid booking details");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/bookings", {
        services: services.map((s) => s._id),
        date,
        time,
        totalPrice,
      });

      alert("Booking confirmed!");
      clearCart(); // clear cart after booking
      navigate("/"); // redirect to home or services page
    } catch (err) {
      console.error(err);
      alert("Failed to confirm booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Booking Summary</h2>

      {/* Selected Slot */}
      <div style={{ marginBottom: "20px" }}>
        <p>
          <strong>Date:</strong> {date}
        </p>
        <p>
          <strong>Time:</strong> {time}
        </p>
      </div>

      {/* Services List */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Selected Services:</h3>
        <ul>
          {services?.map((s) => (
            <li key={s._id}>
              {s.name} - ₹{s.price} | Duration: {s.duration}
            </li>
          ))}
        </ul>
      </div>

      {/* Total Price */}
      <div style={{ marginBottom: "20px", fontWeight: "bold", fontSize: "1.1rem" }}>
        Total Price: ₹{totalPrice}
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirmBooking}
        disabled={loading}
        style={{
          padding: "10px",
          width: "100%",
          background: loading ? "#888" : "#1f7a5c",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "bold",
        }}
      >
        {loading ? "Confirming..." : "Confirm Booking"}
      </button>
    </div>
  );
}