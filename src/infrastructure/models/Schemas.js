const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const CourtSchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ['indoor', 'outdoor'] },
  basePrice: Number,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const CoachSchema = new mongoose.Schema({
  name: String,
  hourlyRate: Number,
  isAvailable: { type: Boolean, default: true },
  specialization: String,
  createdAt: { type: Date, default: Date.now }
});

const EquipmentSchema = new mongoose.Schema({
  name: String,
  totalStock: Number,
  hourlyRate: Number,
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const PricingRuleSchema = new mongoose.Schema({
  name: String,
  ruleType: { type: String, enum: ['peak', 'weekend', 'indoor_premium', 'custom'] },
  multiplier: Number,
  isActive: { type: Boolean, default: true },
  description: String,
  createdAt: { type: Date, default: Date.now }
});

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courtId: { type: mongoose.Schema.Types.ObjectId, ref: 'Court' },
  coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach', default: null },
  equipment: [{ 
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }, 
    quantity: Number 
  }],
  startTime: Date,
  totalPrice: Number,
  userName: String,
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  Court: mongoose.model('Court', CourtSchema),
  Coach: mongoose.model('Coach', CoachSchema),
  Equipment: mongoose.model('Equipment', EquipmentSchema),
  PricingRule: mongoose.model('PricingRule', PricingRuleSchema),
  Booking: mongoose.model('Booking', BookingSchema)
};