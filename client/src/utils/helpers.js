export const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
  '20:00', '21:00', '22:00'
];

export const calculatePrice = (form, resources) => {
  if (!form.courtId || !form.date || !form.time) {
    return 0;
  }

  const court = resources.courts.find(c => c._id === form.courtId);
  const coach = resources.coaches.find(c => c._id === form.coachId);
  const [hours] = form.time.split(':').map(Number);
  const selectedDate = new Date(form.date);
  
  let total = court ? court.basePrice : 0;

  if (court?.type?.toLowerCase() === 'indoor') {
    total *= 1.2;
  }

  if (hours >= 18 && hours < 21) {
    total *= 1.5;
  }

  if ([0, 6].includes(selectedDate.getDay())) {
    total *= 1.3;
  }

  if (coach) {
    total += coach.hourlyRate;
  }

  form.equipment.forEach(item => {
    const equipInfo = resources.equipment.find(e => e._id === item.itemId);
    if (equipInfo) {
      total += equipInfo.hourlyRate * item.quantity;
    }
  });

  return total;
};

export const checkAvailability = (form, bookings) => {
  if (!form.courtId || !form.date || !form.time) {
    return null;
  }

  try {
    const requestedDate = new Date(`${form.date}T${form.time}:00`);
    const isAlreadyBooked = bookings.some(b => {
      const bookingDate = new Date(b.startTime);
      const courtId = b.courtId?._id || b.courtId;
      return courtId === form.courtId && bookingDate.getTime() === requestedDate.getTime();
    });
    return !isAlreadyBooked;
  } catch (err) {
    return false;
  }
};

export const formatPrice = (amount) => {
  return `₹${amount.toFixed(2)}`;
};

export const getPriceBreakdown = (form, resources) => {
  const breakdown = [];
  
  if (form.courtId) {
    const court = resources.courts.find(c => c._id === form.courtId);
    if (court) {
      breakdown.push({
        type: 'court',
        label: `${court.name} (Base)`,
        price: court.basePrice,
        badges: []
      });

      if (court.type === 'indoor') {
        breakdown[0].badges.push({ label: 'INDOOR +20%', color: 'blue' });
      }

      if (form.time && parseInt(form.time) >= 18 && parseInt(form.time) < 21) {
        breakdown[0].badges.push({ label: 'PEAK +50%', color: 'orange' });
      }

      if (form.date && [0, 6].includes(new Date(form.date).getDay())) {
        breakdown[0].badges.push({ label: 'WEEKEND +30%', color: 'red' });
      }
    }
  }

  if (form.coachId) {
    const coach = resources.coaches.find(c => c._id === form.coachId);
    if (coach) {
      breakdown.push({
        type: 'coach',
        label: coach.name,
        price: coach.hourlyRate
      });
    }
  }

  form.equipment.forEach(item => {
    const equip = resources.equipment.find(e => e._id === item.itemId);
    if (equip) {
      breakdown.push({
        type: 'equipment',
        label: equip.name,
        price: equip.hourlyRate
      });
    }
  });

  return breakdown;
};