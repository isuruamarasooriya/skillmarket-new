const express = require('express');
const router = express.Router();

const { 
  createService, 
  getAllServices, 
  getMyServices, 
  getServiceById,
  updateService, 
  deleteService 
} = require('../controllers/serviceController');

const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllServices);
router.post('/', protect, createService);
router.get('/my-services', protect, getMyServices);
router.get('/:id', getServiceById); 
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;