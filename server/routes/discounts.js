const express = require('express');
const router = express.Router();
const Discount = require('../models/Discount');

// Get all discounts (admin)
router.get('/', async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    res.json({ success: true, data: discounts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get active discounts (public)
router.get('/active', async (req, res) => {
  try {
    const now = new Date();
    const discounts = await Discount.find({
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now }
    });
    res.json({ success: true, data: discounts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Validate discount code
router.post('/validate', async (req, res) => {
  try {
    const { code, orderValue } = req.body;
    const discount = await Discount.findOne({ 
      code: code.toUpperCase(), 
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    });
    
    if (!discount) {
      return res.json({ success: false, message: 'Invalid or expired code' });
    }
    
    if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
      return res.json({ success: false, message: 'Code usage limit reached' });
    }
    
    if (orderValue < discount.minOrderValue) {
      return res.json({ success: false, message: `Minimum order should be ${discount.minOrderValue}` });
    }
    
    let discountAmount = 0;
    if (discount.discountType === 'percentage') {
      discountAmount = (orderValue * discount.discountValue) / 100;
    } else {
      discountAmount = discount.discountValue;
    }
    
    res.json({ 
      success: true, 
      data: { discountAmount, finalAmount: orderValue - discountAmount, discount }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create discount (admin)
router.post('/', async (req, res) => {
  try {
    const discount = new Discount(req.body);
    await discount.save();
    res.status(201).json({ success: true, message: 'Discount created!', data: discount });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update discount
router.put('/:id', async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Discount updated!', data: discount });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete discount
router.delete('/:id', async (req, res) => {
  try {
    await Discount.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Discount deleted' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;