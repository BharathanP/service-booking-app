import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ setPage, currentPage }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin"); // example
    navigate("/admin",{ replace: true }); // redirect to admin login
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        {/* Brand */}
        <span className="navbar-brand fs-4 fw-bold">
          <i className="bi bi-speedometer2 me-2"></i> Admin Panel
        </span>

        {/* Navbar collapse for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbar"
          aria-controls="adminNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="adminNavbar">
          {/* Left Nav (pages) */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item mx-1">
              <button
                className={`btn nav-link px-3 ${
                  currentPage === "addService" ? "active text-white" : "text-light"
                }`}
                onClick={() => setPage("addService")}
              >
                <i className="bi bi-plus-circle me-1"></i> Add Service
              </button>
            </li>

            <li className="nav-item mx-1">
              <button
                className={`btn nav-link px-3 ${
                  currentPage === "bookingManagement" ? "active text-white" : "text-light"
                }`}
                onClick={() => setPage("bookingManagement")}
              >
                <i className="bi bi-calendar-check me-1"></i> Bookings
              </button>
            </li>

            <li className="nav-item mx-1">
              <button
                className={`btn nav-link px-3 ${
                  currentPage === "availabilitySettings" ? "active text-white" : "text-light"
                }`}
                onClick={() => setPage("availabilitySettings")}
              >
                <i className="bi bi-clock me-1"></i> Availability
              </button>
            </li>
          </ul>

          {/* Right Nav (Logout) */}
          <div className="d-flex ms-auto">
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}