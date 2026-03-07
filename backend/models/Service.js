const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true
  },
  shortDescription: { 
    type: String, 
    required: true,
    maxLength: 500
  },
  fullDescription: { 
    type: String, 
    required: true,
    maxLength: 5000
  },
  price: { 
    type: Number, 
    required: true, 
    default: 0
  },
  category: { 
    type: String, 
    required: true
  },
  seller: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  }
}, { 
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);