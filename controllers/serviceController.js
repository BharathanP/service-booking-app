const Service = require("../models/Service");

// GET all services
exports.getServices = async (req, res) => {
  const services = await Service.find();
  res.json(services);
};

// ADD service
exports.createService = async (req, res) => {
  const newService = new Service(req.body);
  await newService.save();
  res.json(newService);
};