import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SlotSelectionPage() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [unavailableServices, setUnavailableServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allAvailable, setAllAvailable] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const totalPrice =
    cart?.reduce((acc, s) => acc + (s.price || 0) * (s.quantity || 1), 0) || 0;

  const handleCheckAvailability = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) return alert("Select date and time");
    if (!cart?.length) return alert("Cart is empty");

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/bookings/check-availability",
        {
          services: cart.map((s) => s._id),
          date: selectedDate,
          time: selectedTime,
        },
      );

      const unavailable = res.data?.unavailable || [];
      setUnavailableServices(unavailable);
      setAllAvailable(unavailable.length === 0);
    } catch (err) {
      console.error(err);
      alert("Error checking availability");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!allAvailable) return alert("Check availability first");

    if (!customerName || !customerEmail || !customerPhone || !customerAddress) {
      return alert("Please fill all customer details");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/bookings/confirm",
        {
          services: cart.map((s) => s._id),
          date: selectedDate,
          time: selectedTime,
          totalPrice,
          customerName,
          customerEmail,
          customerPhone: String(customerPhone),
          customerAddress,
        },
      );

      if (res.status === 200 || res.status === 201) {
        alert("✅ Booking Confirmed!");
        clearCart();
        navigate("/");
      }
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log(err.response?.data);

      if (err.response?.data?.unavailable) {
        setUnavailableServices(err.response.data.unavailable);
        alert("⚠️ Some services just got booked. Try another slot.");
      } else {
        alert(err.response?.data?.error || "Error saving booking");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="container py-4">
    <h2 className="text-center mb-4">Book Your Slot</h2>

    <div className="row g-4">
      
      {/* LEFT SIDE */}
      <div className="col-lg-6 col-12">
        
        {/* Cart */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title">Selected Services</h5>

            {cart?.length ? (
              <>
                {cart.map((s) => (
                  <div key={s._id} className="d-flex justify-content-between">
                    <span>{s.name}</span>
                    <span>₹{s.price}</span>
                  </div>
                ))}
                <hr />
                <h6>Total: ₹{totalPrice}</h6>
              </>
            ) : (
              <p className="text-danger">Cart is empty</p>
            )}
          </div>
        </div>

        {/* Slot Selection */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h5>Select Slot</h5>

            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Time</label>
              <input
                type="time"
                className="form-control"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary w-100"
              onClick={handleCheckAvailability}
            >
              {loading ? "Checking..." : "Check Availability"}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="col-lg-6 col-12">

        {/* Customer Details */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5>Customer Details</h5>

            <input
              type="text"
              className="form-control mb-2"
              placeholder="Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <input
              type="email"
              className="form-control mb-2"
              placeholder="Email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />

            <input
              type="text"
              className="form-control mb-2"
              placeholder="Phone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />

            <input
              type="text-area"
              className="form-control mb-2"
              placeholder="Address"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
            />
          </div>
        </div>

        {/* Confirm Button */}
        {allAvailable && (
          <button
            className="btn btn-success w-100"
            onClick={handleConfirmBooking}
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        )}

        {/* Unavailable */}
        {unavailableServices.length > 0 && (
          <div className="alert alert-danger mt-3">
            <strong>Unavailable Services:</strong>
            <div>
              {unavailableServices.map((s, i) => (
                <span key={i} className="badge bg-danger me-2">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
}