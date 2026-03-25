const Booking = require("../models/Booking");   // ✅ ADD THIS
const checkAvailability = require("../utils/slotChecker");

exports.createBooking = async (req, res) => {
  try {
    const { services, date, time } = req.body;

    const isAvailable = await checkAvailability(services, date, time);

    if (!isAvailable) {
      return res.status(400).json({
        message: "Selected slot not available ❌"
      });
    }

    const booking = new Booking(req.body);
    await booking.save();

    res.json({
      message: "Booking successful ✅",
      booking
    });

  } catch (error) {
    res.status(500).json({ error: "Booking failed ❌" });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("services");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings ❌" });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    await Booking.findByIdAndDelete(id);

    res.json({ message: "Booking cancelled ❌" });
  } catch (error) {
    res.status(500).json({ error: "Cancel failed ❌" });
  }
};

exports.getFilteredBookings = async (req, res) => {
  try {
    const { date, email } = req.query;

    let filter = {};

    if (date) filter.date = date;
    if (email) filter.email = email;

    const bookings = await Booking.find(filter).populate("services");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Filter failed ❌" });
  }
};