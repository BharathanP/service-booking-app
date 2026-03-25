const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  image: { type: String }, // optional
  
   availability: {
    days: [String], // ["Monday", "Tuesday"]
    startTime: String, // "09:00"
    endTime: String,   // "18:00"
  },
}, { timestamps: true });



module.exports = mongoose.model("Service", serviceSchema);