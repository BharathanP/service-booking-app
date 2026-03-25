import React from "react";

export default function Navbar({ setPage, currentPage }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <span className="navbar-brand">
          <i className="bi bi-speedometer2"></i> Admin
        </span>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button
                className={`btn nav-link text-white ${currentPage === "addService" ? "active" : ""}`}
                onClick={() => setPage("addService")}
              >
                <i className="bi bi-plus-circle me-1"></i> Add Service
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`btn nav-link text-white ${currentPage === "bookingManagement" ? "active" : ""}`}
                onClick={() => setPage("bookingManagement")}
              >
                <i className="bi bi-calendar-check me-1"></i> Bookings
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`btn nav-link text-white ${currentPage === "availabilitySettings" ? "active" : ""}`}
                onClick={() => setPage("availabilitySettings")}
              >
                <i className="bi bi-clock me-1"></i> Availability
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}