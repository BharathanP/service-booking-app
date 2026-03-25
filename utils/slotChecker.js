const Booking = require("../models/Booking");

const checkAvailability = async (services, date, time) => {
  const existingBookings = await Booking.find({ date, time });

  if (existingBookings.length > 0) {
    return false; // slot already booked
  }

  return true;
};

module.exports = checkAvailability;