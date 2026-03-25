// models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true }], // array
  date: { type: String, required: true },
  time: { type: String, required: true },
  endTime: String,
  totalPrice: Number,
  duration: Number,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  customerAddress: {
  type: String,
  required: true,
},
});

module.exports = mongoose.model("Booking", bookingSchema);