const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const bookingRoutes = require('./routes/bookings');
const contactRoutes = require('./routes/contacts');
const menuRoutes = require('./routes/menu');
const discountRoutes = require('./routes/discounts');
const adminRoutes = require('./routes/admin');

// Use Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '🍽️ Flavory Haven API is running!',
    timestamp: new Date().toISOString()
  });
});

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas Connected Successfully!');
    console.log('📦 Database: flavory_haven');
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('💡 Please check your MongoDB connection string and password');
  });
const PORT = 5001;  // Direct 5001 pe set kiya
app.listen(PORT, () => {
  console.log(`🚀 Flavory Haven Server running on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}/api/health`);
  console.log(`🍽️ Restaurant API is ready!`);
});