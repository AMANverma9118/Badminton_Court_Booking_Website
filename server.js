const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { router: authRouter, authMiddleware } = require('./routes/auth');
const adminRouter = require('./routes/admin');
const bookingService = require('./src/application/BookingService');
const { Waitlist } = require('./src/infrastructure/models/Schemas');

const app = express();

const corsOptions = {
  origin: [
    'https://badminton-court-booking-website.vercel.app', 
    'http://localhost:5173'                             
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRouter);

app.use('/api/admin', adminRouter);

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

app.post('/api/check-availability', authMiddleware, async (req, res) => {
  try {
    const { courtId, startTime } = req.body;
    const isAvailable = await bookingService.checkAvailability(courtId, startTime);
    
    let waitlistCount = 0;
    if (!isAvailable) {
      waitlistCount = await Waitlist.countDocuments({ courtId, startTime, status: 'waiting' });
    }
    
    res.json({ available: isAvailable, waitlistCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/waitlist/join', authMiddleware, async (req, res) => {
  try {
    const waitlistEntry = await bookingService.joinWaitlist(req.userId, req.body);
    res.status(201).json({ message: 'Added to waitlist!', waitlistEntry });
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

app.post('/api/check-availability', authMiddleware, async (req, res) => {
  try {
    const { courtId, startTime } = req.body;
    const isAvailable = await bookingService.checkAvailability(courtId, startTime);
    res.json({ available: isAvailable });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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