const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Create new booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ success: true, message: 'Booking created successfully!', data: booking });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get all bookings (for admin)
router.get('/', async (req, res) => {
  try {
    const { date, status } = req.query;
    let query = {};
    if (date) query.date = date;
    if (status) query.status = status;
    
    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update booking status
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, message: 'Booking updated!', data: booking });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;