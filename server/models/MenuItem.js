const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['appetizers', 'main-course', 'desserts', 'beverages', 'special'],
    required: true 
  },
  image: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
  isVegetarian: { type: Boolean, default: false },
  isSpicy: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);