import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchService, setSearchService] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchName, searchDate, searchService, bookings]);

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/bookings/all"
      );
      setBookings(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Apply filters
  const applyFilters = () => {
    let data = [...bookings];

    if (searchName) {
      data = data.filter((b) =>
        b.customerName.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchDate) {
      data = data.filter((b) => b.date === searchDate);
    }

    if (searchService) {
      data = data.filter((b) =>
        b.services.some((s) =>
          s.name.toLowerCase().includes(searchService.toLowerCase())
        )
      );
    }

    setFiltered(data);
  };

  // Cancel booking
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure to cancel booking?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      alert("Booking cancelled");

      // refresh list
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Error cancelling booking");
    }
  };

  const formatDuration = (m) => {
    const hrs = Math.floor(m / 60);
    const mins = m % 60;

    if (hrs && mins) return `${hrs} hr ${mins} min`;
    if (hrs) return `${hrs} hr`;
    return `${mins} min`;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Booking Management</h2>

      {/* 🔍 Filters */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <input
          placeholder="Search by customer"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={inputStyle}
        />

        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Search by service"
          value={searchService}
          onChange={(e) => setSearchService(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* 📱 Cards for mobile + Table for desktop */}
      <div className="booking-container">
        {filtered.length === 0 ? (
          <p>No bookings found</p>
        ) : (
          filtered.map((b) => (
            <div key={b._id} style={cardStyle}>
              <h4>{b.customerName}</h4>

              <p>
                📧 {b.customerEmail} <br />
                📞 {b.customerPhone}
                
              </p>
              <p><strong>Address:</strong> {b.customerAddress}</p>

              <p>
                📅 {b.date} | ⏰ {b.time}
              </p>

              <p>
                ⏳ {formatDuration(b.duration)} | 💰 ₹{b.totalPrice}
              </p>

              <div>
                <strong>Services:</strong>
                {b.services.map((s) => (
                  <div key={s._id}>• {s.name}</div>
                ))}
              </div>

              <button
                onClick={() => handleCancel(b._id)}
                style={cancelBtn}
              >
                Cancel Booking
              </button>
            </div>
          ))
        )}
      </div>

      {/* 🔥 Simple CSS */}
      <style>{`
        .booking-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 15px;
        }
      `}</style>
    </div>
  );
}

// 🎨 Styles
const inputStyle = {
  padding: "8px",
  flex: "1",
  minWidth: "150px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "15px",
  background: "#f9f9f9",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

const cancelBtn = {
  marginTop: "10px",
  padding: "8px",
  width: "100%",
  background: "#e53935",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};