import React, { useState } from "react";
import Navbar from "./Navbar";
import AddService from "./AddService";
import BookingManagement from "./BookingManagement";
import AvailabilitySettings from "./AvailabilitySettings";

export default function Dashboard() {
  const [page, setPage] = useState("addService");

  const renderPage = () => {
    switch (page) {
      case "addService":
        return <AddService />;
      case "bookingManagement":
        return <BookingManagement />;
      case "availabilitySettings":
        return <AvailabilitySettings />;
      default:
        return <AddService />;
    }
  };

  return (
    <div>
      <Navbar setPage={setPage} currentPage={page} />
      <div className="dashboard-background min-vh-100 p-4">{renderPage()}</div>
    </div>
  );
}
