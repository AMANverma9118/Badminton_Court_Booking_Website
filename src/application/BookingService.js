const mongoose = require('mongoose');
const { Booking, Court, Equipment, Coach, PricingRule,Waitlist } = require('../infrastructure/models/Schemas');
const PricingEngine = require('../domain/PricingEngine');

class BookingService {
  async createBooking(payload, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { courtId, coachId, equipment, startTime } = payload;
      const start = new Date(startTime);

      const conflict = await Booking.findOne({ 
        courtId, 
        startTime: start,
        status: 'confirmed'
      }).session(session);
      
      if (conflict) throw new Error("This court is already booked for the selected time.");

      const court = await Court.findById(courtId).session(session);
      if (!court || !court.isActive) {
        throw new Error("Selected court is not available.");
      }

      let coachRate = 0;
      if (coachId) {
        const coach = await Coach.findById(coachId).session(session);
        if (!coach || !coach.isAvailable) {
          throw new Error("Selected coach is not available.");
        }
        coachRate = coach.hourlyRate;
      }

      let equipFees = 0;
      if (equipment && equipment.length > 0) {
        for (const item of equipment) {
          const equip = await Equipment.findById(item.itemId).session(session);
          if (!equip || !equip.isAvailable) {
            throw new Error(`Equipment ${equip?.name || 'item'} is not available.`);
          }
          equipFees += (equip.hourlyRate * item.quantity);
        }
      }

      const activeRules = await PricingRule.find({ isActive: true }).session(session);
      const totalPrice = PricingEngine.calculate(
        court.basePrice, 
        start, 
        court.type, 
        activeRules, 
        coachRate, 
        equipFees
      );

      const booking = new Booking({ 
        ...payload, 
        userId,
        totalPrice,
        status: 'confirmed'
      });
      await booking.save({ session });

      await session.commitTransaction();
      
      await booking.populate('courtId coachId equipment.itemId');
      return booking;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async joinWaitlist(userId, bookingData) {
    const existing = await Waitlist.findOne({ 
      userId, 
      courtId: bookingData.courtId, 
      startTime: bookingData.startTime 
    });
    
    if (existing) throw new Error('You are already on the waitlist for this slot.');
    
    return await Waitlist.create({
      userId,
      courtId: bookingData.courtId,
      startTime: bookingData.startTime
    });
  }

  async cancelBooking(bookingId) {
    const booking = await Booking.findByIdAndDelete(bookingId);
    if (!booking) return;

    const nextInLine = await Waitlist.findOne({
      courtId: booking.courtId,
      startTime: booking.startTime,
      status: 'waiting'
    }).sort({ createdAt: 1 });

    if (nextInLine) {
      nextInLine.status = 'notified';
      await nextInLine.save();
      
      console.log(`Notification sent to User ${nextInLine.userId}: Slot is now available!`);
    }
    
    return booking;
  }

  async getUserBookings(userId) {
    return await Booking.find({ userId })
      .populate('courtId')
      .populate('coachId')
      .populate('equipment.itemId')
      .sort({ createdAt: -1 });
  }

  async getActiveResources() {
    const courts = await Court.find({ isActive: true });
    const coaches = await Coach.find({ isAvailable: true });
    const equipment = await Equipment.find({ isAvailable: true });
    return { courts, coaches, equipment };
  }

  async getActivePricingRules() {
    return await PricingRule.find({ isActive: true });
  }

  async checkAvailability(courtId, startTime) {
    const start = new Date(startTime);
    const conflict = await Booking.findOne({ 
      courtId, 
      startTime: start,
      status: 'confirmed'
    });
    return !conflict;
  }
}

module.exports = new BookingService();