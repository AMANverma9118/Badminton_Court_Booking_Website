const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { router: authRouter, authMiddleware } = require('./routes/auth');
const adminRouter = require('./routes/admin');
const bookingService = require('./src/application/BookingService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Auth routes (public)
app.use('/api/auth', authRouter);

// Admin routes (protected)
app.use('/api/admin', adminRouter);

// User booking routes (protected)
app.get('/api/resources', authMiddleware, async (req, res) => {
  try {
    const resources = await bookingService.getActiveResources();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/book', authMiddleware, async (req, res) => {
  try {
    const booking = await bookingService.createBooking(req.body, req.userId);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/history', authMiddleware, async (req, res) => {
  try {
    const bookings = await bookingService.getUserBookings(req.userId);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;