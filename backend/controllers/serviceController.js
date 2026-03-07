const Service = require('../models/Service');

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('seller', 'name university email'); // email එකත් එකතු කළා
    if (!service) return res.status(404).json({ message: "Service not found." });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving data.", error: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const { title, shortDescription, fullDescription, price, category } = req.body;

    const newService = await Service.create({
      title, 
      shortDescription, 
      fullDescription, 
      price, 
      category,
      seller: req.user._id
    });
    
    res.status(201).json({ message: "Service added successfully!", service: newService });
  } catch (error) {
    console.error("Create Service Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate('seller', 'name university email');
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ seller: req.user._id });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Data retrieval error.", error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found." });

    if (service.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Access denied." });
    }

    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true
    });
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: "Update error.", error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found." });

    if (service.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Access denied." });
    }

    await service.deleteOne();
    res.status(200).json({ message: "Service deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Deletion error.", error: error.message });
  }
};

module.exports = { createService, getAllServices, getMyServices, getServiceById, updateService, deleteService };