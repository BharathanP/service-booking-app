const express = require("express");
const multer = require("multer");
const path = require("path");
const Service = require("../models/Service");

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Get all services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add service
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;
    if (!name || !price || !duration) {
      return res.status(400).json({ message: "Name, price, and duration are required" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const service = new Service({ name, description, price, duration, image });
    await service.save();

    res.status(201).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/services/:id - update a service
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;

    // Build update object
    const updateData = { name, description, price, duration };

    // If a new image is uploaded, add it
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } // return the updated document
    );

    res.json(updatedService);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete service
router.delete("/:id", async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update availability for a service
router.put("/:id/availability", async (req, res) => {
  try {
    const { days, startTime, endTime } = req.body;

    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      {
        availability: { days, startTime, endTime },
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating availability" });
  }
});

module.exports = router;