const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true, min: 1, max: 20 },
  specialRequests: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);