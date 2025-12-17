const express = require('express');
const { Court, Coach, Equipment, PricingRule, Booking } = require('../src/infrastructure/models/Schemas');
const { authMiddleware, adminMiddleware } = require('./auth');

const router = express.Router();

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// ============ COURTS MANAGEMENT ============
router.get('/courts', async (req, res) => {
  try {
    const courts = await Court.find().sort({ createdAt: -1 });
    res.json(courts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/courts', async (req, res) => {
  try {
    const court = new Court(req.body);
    await court.save();
    res.status(201).json(court);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/courts/:id', async (req, res) => {
  try {
    const court = await Court.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(court);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/courts/:id', async (req, res) => {
  try {
    await Court.findByIdAndDelete(req.params.id);
    res.json({ message: 'Court deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ COACHES MANAGEMENT ============
router.get('/coaches', async (req, res) => {
  try {
    const coaches = await Coach.find().sort({ createdAt: -1 });
    res.json(coaches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/coaches', async (req, res) => {
  try {
    const coach = new Coach(req.body);
    await coach.save();
    res.status(201).json(coach);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/coaches/:id', async (req, res) => {
  try {
    const coach = await Coach.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(coach);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/coaches/:id', async (req, res) => {
  try {
    await Coach.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coach deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ EQUIPMENT MANAGEMENT ============
router.get('/equipment', async (req, res) => {
  try {
    const equipment = await Equipment.find().sort({ createdAt: -1 });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/equipment', async (req, res) => {
  try {
    const equipment = new Equipment(req.body);
    await equipment.save();
    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/equipment/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/equipment/:id', async (req, res) => {
  try {
    await Equipment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ PRICING RULES MANAGEMENT ============
router.get('/pricing-rules', async (req, res) => {
  try {
    const rules = await PricingRule.find().sort({ createdAt: -1 });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/pricing-rules', async (req, res) => {
  try {
    const rule = new PricingRule(req.body);
    await rule.save();
    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/pricing-rules/:id', async (req, res) => {
  try {
    const rule = await PricingRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(rule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/pricing-rules/:id', async (req, res) => {
  try {
    await PricingRule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pricing rule deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ DASHBOARD STATS ============
router.get('/stats', async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const activeCourts = await Court.countDocuments({ isActive: true });
    const activeCoaches = await Coach.countDocuments({ isAvailable: true });

    res.json({
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      activeCourts,
      activeCoaches
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ ALL BOOKINGS (ADMIN VIEW) ============
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('courtId')
      .populate('coachId')
      .populate('equipment.itemId')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;