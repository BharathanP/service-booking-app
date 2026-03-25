import { useEffect, useState, useContext } from "react";
import { fetchServices } from "../services/api";
import { CartContext } from "../context/CartContext";

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");

  const { addToCart, showCart } = useContext(CartContext);

  useEffect(() => {
    fetchServices()
      .then((data) => setServices(data || []))
      .catch((err) => {
        console.error(err);
        setServices([]);
      });
  }, []);

  const filteredServices = services.filter((service) =>
    (service?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
          url("https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* ✅ MAIN CONTENT WRAPPER */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          marginRight: showCart ? "320px" : "0px",
          transition: "all 0.3s ease",
        }}
      >
        {/* Heading */}
        <h1
          style={{
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "700",
            marginBottom: "20px",
            color: "#fff",
          }}
        >
          Book Trusted Help for Home Tasks
        </h1>

        {/* Search */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          <div style={{ display: "flex", width: "100%", maxWidth: "500px" }}>
            <input
              type="text"
              placeholder="What do you need help with?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                padding: "15px 20px",
                borderRadius: "30px 0 0 30px",
                border: "1px solid #ccc",
                outline: "none",
              }}
            />
            <button
              style={{
                background: "#ee5f27",
                border: "none",
                padding: "0 20px",
                borderRadius: "0 30px 30px 0",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>

        {/* No Results */}
        {filteredServices.length === 0 && (
          <p style={{ textAlign: "center", color: "#fff" }}>
            No matching services found
          </p>
        )}

        {/* ✅ GRID FIX */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: showCart
              ? "repeat(auto-fit, minmax(220px, 1fr))"
              : "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredServices.map((service) => (
            <div
              key={service._id}
              style={{
                borderRadius: "12px",
                padding: "15px",
                background: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                minHeight: "380px",
                transition: "0.3s",
              }}
            >
              {/* Image */}
              {service.image ? (
                <img
                  src={
                    service.image.startsWith("http")
                      ? service.image
                      : `http://localhost:5000${service.image}`
                  }
                  alt={service.name}
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              ) : (
                <div
                  style={{
                    height: "160px",
                    background: "#eee",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  No Image
                </div>
              )}

              {/* Content */}
              <h3 style={{ marginTop: "10px" }}>
                {service.name || "No Name"}
              </h3>

              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                {service.description || "No Description"}
              </p>

              <p style={{ fontWeight: "bold" }}>
                ₹{service.price || "-"} | {service.duration || "-"} mins
              </p>

              {/* Button */}
              <button
                onClick={() => addToCart(service)}
                style={{
                  marginTop: "auto",
                  padding: "10px",
                  background: "#1f7a5c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ServicesPage;