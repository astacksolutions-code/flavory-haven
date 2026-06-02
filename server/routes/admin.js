const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      success: true, 
      message: 'Login successful!',
      data: { token, admin: { id: admin._id, username: admin.username, email: admin.email, role: admin.role } }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create first admin (run once)
router.post('/setup', async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne({ email: 'admin@flavoryhaven.com' });
    if (existingAdmin) {
      return res.json({ success: false, message: 'Admin already exists!' });
    }
    
    const admin = new Admin({
      username: 'admin',
      email: 'admin@flavoryhaven.com',
      password: 'admin123',
      role: 'super-admin'
    });
    
    await admin.save();
    res.json({ success: true, message: 'Admin created! Email: admin@flavoryhaven.com, Password: admin123' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;