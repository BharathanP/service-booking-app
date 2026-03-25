import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/adminpanel.png"; // Offline image
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "admin123";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.username === ADMIN_USERNAME && form.password === ADMIN_PASSWORD) {
      navigate("/admin/dashboard", { replace: true });
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Optional overlay for readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 1,
        }}
      ></div>

      <div
        className="card p-4 shadow"
        style={{ width: "350px", borderRadius: "12px", zIndex: 2 }}
      >
        <h3 className="text-center mb-3 text-primary">
          <i className="bi bi-shield-lock-fill me-2"></i> Admin Login
        </h3>

        {error && (
          <div className="alert alert-danger p-2" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            <i className="bi bi-box-arrow-in-right me-1"></i> Login
          </button>
        </form>
      </div>
    </div>
  );
}