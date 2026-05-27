const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = { isAvailable: true };
    if (category && category !== 'all') query.category = category;
    
    const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });
    res.json({ success: true, count: menuItems.length, data: menuItems });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single menu item
router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Item not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new menu item (admin)
router.post('/', async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json({ success: true, message: 'Menu item added!', data: menuItem });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update menu item
router.put('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, message: 'Menu item updated!', data: menuItem });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete menu item
router.delete('/:id', async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Menu item deleted' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;