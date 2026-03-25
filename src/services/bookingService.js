import { useEffect, useState, useContext } from "react";
import { fetchServices } from "../services/api";
import { CartContext } from "../context/CartContext";

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const { addToCart } = useContext(CartContext);
  const { showCart } = useContext(CartContext);
  

  useEffect(() => {
    fetchServices()
      .then((data) => setServices(data || []))
      .catch((err) => {
        console.error(err);
        setServices([]);
      });
  }, []);

  const filteredServices = services.filter((service) => {
    const name = service?.name || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",

        backgroundImage: `
      linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
      url("https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0")
    `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
       <div
    style={{
      marginRight: showCart ? "320px" : "0px",
      transition: "margin-right 0.3s ease"
    }}
  > </div>
        
  
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

      {/* Search bar */}
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
              fontSize: "16px",
            }}
          />
          <button
            style={{
              background: "#ee5f27",
              border: "none",
              padding: "0 20px",
              borderRadius: "0 30px 30px 0",
              cursor: "pointer",
              color: "#fff",
              fontSize: "16px",
            }}
          >
            <i className="bi bi-search"></i>
          </button>
        </div>
      </div>

      {/* No Results */}
      {filteredServices.length === 0 && (
        <p style={{ textAlign: "center", color: "#777", fontSize: "16px" }}>
          No matching services found
        </p>
      )}

      {/* Services Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredServices.map((service) => (
          <div
            key={service._id}
            style={{
              border: "1px solid #eee",
              borderRadius: "12px",
              padding: "15px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              transition: "0.3s",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: "#fff",
              minHeight: "400px",
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
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              />
            ) : (
              <div
                style={{
                  borderRadius: "12px",
                  padding: "15px",
                  backdropFilter: "blur(8px)",
                  background: "rgba(255,255,255,0.95)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                  transition: "0.3s",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "400px",
                }}
              >
                No Image
              </div>
            )}

           
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                marginBottom: "6px",
                color: "#333",
              }}
            >
              {service.name || "No Name"}
            </h3>

            <p
              style={{ fontSize: "0.9rem", color: "#555", marginBottom: "6px" }}
            >
              {service.description || "No Description"}
            </p>

            <p
              style={{
                fontWeight: "bold",
                marginBottom: "10px",
                color: "#222",
              }}
            >
              ${service.price || "-"} | Duration: {service.duration || "-"} mins
            </p>

            {/* Add to Cart */}
            <button
              onClick={() => addToCart(service)}
              style={{
                padding: "10px",
                width: "100%",
                background: "#1f7a5c",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "0.3s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#15553f")}
              onMouseOut={(e) => (e.target.style.background = "#1f7a5c")}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServicesPage;
