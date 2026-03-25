const express = require("express");
const Booking = require("../models/Booking");
const Availability = require("../models/Availability");
const Service = require("../models/Service");
const router = express.Router();

router.post("/slots", async (req, res) => {
  try {
    const { services: cartServices, date } = req.body;
    if (!cartServices || !cartServices.length)
      return res.status(400).json({ message: "Cart empty" });

    // 1. Fetch durations of services
    const servicesData = await Service.find({ _id: { $in: cartServices } });
    const totalDuration = servicesData.reduce((sum, s) => sum + s.duration, 0); // minutes

    // 2. Get bookings for these services on this date
    const bookings = await Booking.find({ service: { $in: cartServices }, date });

    // 3. Get working hours from first service availability
    const availability = await Availability.findOne({ service: cartServices[0] });
    if (!availability)
      return res.status(404).json({ message: "Availability not set" });

    const slots = [];
    let slotTime = new Date(`${date}T${availability.startTime}:00`);
    const endTime = new Date(`${date}T${availability.endTime}:00`);

    while (slotTime.getTime() + totalDuration * 60000 <= endTime.getTime()) {
      const slotEnd = new Date(slotTime.getTime() + totalDuration * 60000);

      // ✅ 1-hour block for each existing booking
      const overlaps = bookings.some((b) => {
        const bookingStart = new Date(`${b.date}T${b.time}`);
        const bookingEnd = new Date(bookingStart.getTime() + 60 * 60000); // 1-hour block
        return slotTime < bookingEnd && slotEnd > bookingStart; // check overlap
      });

      if (!overlaps) slots.push(slotTime.toTimeString().slice(0, 5));

      slotTime = new Date(slotTime.getTime() + 1 * 60000); // 1-minute interval
    }

    res.json({ slots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;