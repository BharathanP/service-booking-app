const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Service = require("../models/Service");

// 🔥 Helper to calculate end time
function calculateEndTime(date, time, duration) {
  const start = new Date(`${date}T${time}`);
  const end = new Date(start.getTime() + duration * 60000);
  return end.toTimeString().slice(0, 5);
}

// ===============================
// 1️⃣ CHECK AVAILABILITY
// ===============================
router.post("/check-availability", async (req, res) => {
  try {
    const { services, date, time } = req.body;

    if (!services?.length || !date || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const serviceDetails = await Service.find({ _id: { $in: services } });
    const bookings = await Booking.find({ date });

    const requestedStart = new Date(`${date}T${time}`);

    const unavailableServices = [];

    const dayName = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    // ✅ CHECK WORKING HOURS
    for (const service of serviceDetails) {
      const availability = service.availability;

      if (!availability) continue;

      const requestedEnd = new Date(
        requestedStart.getTime() + service.duration * 60000
      );

      const workStart = new Date(`${date}T${availability.startTime}`);
      const workEnd = new Date(`${date}T${availability.endTime}`);

      // ❌ Day check
      if (!availability.days?.includes(dayName)) {
        unavailableServices.push(service.name);
        continue;
      }

      // ❌ Time check (IMPORTANT FIX)
      if (requestedStart < workStart || requestedEnd > workEnd) {
        unavailableServices.push(service.name);
        continue;
      }
    }

    // ✅ CHECK BOOKING OVERLAP
    for (const b of bookings) {
      const bStart = new Date(`${b.date}T${b.time}`);
      const bEnd = new Date(bStart.getTime() + b.duration * 60000);

      for (const service of serviceDetails) {
        const requestedEnd = new Date(
          requestedStart.getTime() + service.duration * 60000
        );

        if (
          requestedStart < bEnd &&
          requestedEnd > bStart &&
          b.services.includes(service._id)
        ) {
          if (!unavailableServices.includes(service.name)) {
            unavailableServices.push(service.name);
          }
        }
      }
    }

    return res.status(200).json({
      unavailable: unavailableServices,
    });
  } catch (err) {
    console.error("Check availability error:", err);
    return res.status(500).json({ error: "Error checking availability" });
  }
});

// ===============================
// 2️⃣ CONFIRM BOOKING
// ===============================
router.post("/confirm", async (req, res) => {
  try {
    const {
      services,
      date,
      time,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
    } = req.body;

    if (!services?.length || !date || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const serviceDetails = await Service.find({ _id: { $in: services } });

    const totalDuration = serviceDetails.reduce(
      (sum, s) => sum + (Number(s.duration) || 0),
      0
    );

    const totalPrice = serviceDetails.reduce(
      (sum, s) => sum + (Number(s.price) || 0),
      0
    );

    const requestedStart = new Date(`${date}T${time}`);
    const requestedEnd = new Date(
      requestedStart.getTime() + totalDuration * 60000
    );

    const bookings = await Booking.find({ date });

    const dayName = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    // ✅ CHECK WORKING HOURS AGAIN (FINAL VALIDATION)
    for (const service of serviceDetails) {
      const availability = service.availability;

      if (!availability) continue;

      const workStart = new Date(`${date}T${availability.startTime}`);
      const workEnd = new Date(`${date}T${availability.endTime}`);

      if (!availability.days?.includes(dayName)) {
        return res.status(400).json({
          error: `${service.name} not available on this day`,
        });
      }

      if (requestedStart < workStart || requestedEnd > workEnd) {
        return res.status(400).json({
          error: `${service.name} shift time ended`,
        });
      }
    }

    // ✅ CHECK OVERLAP
    for (const b of bookings) {
      const bStart = new Date(`${b.date}T${b.time}`);
      const bEnd = new Date(bStart.getTime() + b.duration * 60000);

      if (requestedStart < bEnd && requestedEnd > bStart) {
        return res.status(400).json({
          error: "Slot already booked",
        });
      }
    }

    const endTime = calculateEndTime(date, time, totalDuration);

    const newBooking = new Booking({
      services,
      date,
      time,
      endTime,
      duration: totalDuration,
      totalPrice,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
    });

    await newBooking.save();

    return res.status(201).json({
      message: "Booking confirmed!",
      booking: newBooking,
    });
  } catch (err) {
    console.error("Booking error:", err);
    return res.status(500).json({ error: "Error confirming booking" });
  }
});

// ===============================
// 3️⃣ GET ALL BOOKINGS (ADMIN)
// ===============================
router.get("/all", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("services", "name price duration")
      .sort({ date: 1, time: 1 });

    return res.json(bookings);
  } catch (err) {
    console.error("Fetch bookings error:", err);
    return res.status(500).json({ error: "Error fetching bookings" });
  }
});

// ===============================
// 4️⃣ DELETE BOOKING
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    return res.json({ message: "Booking cancelled" });
  } catch (err) {
    return res.status(500).json({ error: "Error deleting booking" });
  }
});

module.exports = router;