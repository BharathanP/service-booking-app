const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  days: [{ type: String }], // ["Monday", "Tuesday", ...]
  startTime: { type: String }, // "09:00"
  endTime: { type: String },   // "18:00"
}, { timestamps: true });

module.exports = mongoose.model("Availability", availabilitySchema);