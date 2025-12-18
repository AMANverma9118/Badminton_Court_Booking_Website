import React, { useState, useEffect } from 'react';
import { Award, LogOut, Calendar, Clock, Users, CheckCircle, XCircle, ShoppingCart } from 'lucide-react';
import { useResources, useBookings } from '../hooks/useApi';
import { TIME_SLOTS, calculatePrice, checkAvailability, getPriceBreakdown } from '../utils/helpers';

export const UserDashboard = ({ user, onLogout }) => {
  const [view, setView] = useState('book');
  const { resources } = useResources();
  const { bookings, reload: reloadBookings, createBooking } = useBookings();
  const [form, setForm] = useState({
    userName: user.name,
    courtId: '',
    coachId: '',
    equipment: [],
    date: '',
    time: ''
  });
  const [loading, setLoading] = useState(false);

  const livePrice = calculatePrice(form, resources);
  const availability = checkAvailability(form, bookings);
  const priceBreakdown = getPriceBreakdown(form, resources);

  const handleEquipChange = (itemId, checked) => {
    let updatedEquip = [...form.equipment];
    if (checked) {
      updatedEquip.push({ itemId, quantity: 1 });
    } else {
      updatedEquip = updatedEquip.filter(i => i.itemId !== itemId);
    }
    setForm({ ...form, equipment: updatedEquip });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        userName: form.userName,
        courtId: form.courtId,
        coachId: form.coachId || null,
        equipment: form.equipment,
        startTime: `${form.date}T${form.time}:00`,
        totalPrice: livePrice
      };
      
      await createBooking(payload);
      
      alert("✨ Booking Confirmed Successfully!");
      setForm({ userName: user.name, courtId: '', coachId: '', equipment: [], date: '', time: '' });
      reloadBookings();
      setView('history');
    } catch (err) {
      alert(err.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ProCourt Scheduler
                </h1>
                <p className="text-sm text-gray-600">Welcome, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setView('book')} 
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  view === 'book' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                New Booking
              </button>
              <button 
                onClick={() => setView('history')} 
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  view === 'history' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                My Bookings
              </button>
              <button 
                onClick={onLogout} 
                className="ml-4 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-all flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'book' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-8 py-6">
                  <h2 className="text-2xl font-bold text-white">Create New Booking</h2>
                  <p className="text-indigo-100 mt-1">Fill in the details to reserve your slot</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                      <Users className="w-4 h-4" />
                      <span>Player Name</span>
                    </label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Enter name" 
                      value={form.userName} 
                      onChange={e => setForm({...form, userName: e.target.value})} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" 
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                      <Award className="w-4 h-4" />
                      <span>Select Court</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {resources.courts.map(court => (
                        <button 
                          key={court._id} 
                          type="button" 
                          onClick={() => setForm({...form, courtId: court._id})} 
                          className={`p-4 border-2 rounded-xl text-left transition-all ${
                            form.courtId === court._id 
                              ? 'border-indigo-600 bg-indigo-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-semibold text-gray-900">{court.name}</div>
                          <div className="text-sm text-gray-600 mt-1">{court.type} • ₹{court.basePrice}/hr</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>Date</span>
                      </label>
                      <input 
                        type="date" 
                        required 
                        value={form.date} 
                        onChange={e => setForm({...form, date: e.target.value})} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                        <Clock className="w-4 h-4" />
                        <span>Time Slot</span>
                      </label>
                      <select 
                        required 
                        value={form.time} 
                        onChange={e => setForm({...form, time: e.target.value})} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="">Select time</option>
                        {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                      </select>
                    </div>
                  </div>

                  {availability !== null && (
                    <div className={`flex items-center space-x-3 p-4 rounded-xl border ${
                      availability 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      {availability ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                      <span className="text-sm font-medium">
                        {availability ? "This slot is available!" : "This slot is already booked."}
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Add Equipment (Optional)</label>
                    <div className="grid grid-cols-2 gap-3">
                      {resources.equipment.map(item => (
                        <label 
                          key={item._id} 
                          className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50"
                        >
                          <input 
                            type="checkbox" 
                            checked={form.equipment.some(e => e.itemId === item._id)} 
                            onChange={(e) => handleEquipChange(item._id, e.target.checked)} 
                            className="w-5 h-5 text-indigo-600" 
                          />
                          <span className="text-sm text-gray-700">{item.name} (+₹{item.hourlyRate})</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Add Coach (Optional)</label>
                    <div className="grid grid-cols-2 gap-3">
                      {resources.coaches.map(coach => (
                        <button 
                          key={coach._id} 
                          type="button" 
                          onClick={() => setForm({...form, coachId: coach._id})} 
                          className={`p-4 border-2 rounded-xl text-left transition-all ${
                            form.coachId === coach._id 
                              ? 'border-indigo-600 bg-indigo-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-semibold text-gray-900">{coach.name}</div>
                          <div className="text-sm text-gray-600 mt-1">+₹{coach.hourlyRate}/hr</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading || availability === false} 
                    className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Processing..." : "Confirm Booking"}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-8">
                <div className="flex items-center space-x-2 mb-6 text-indigo-600">
                  <ShoppingCart className="w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-900">Your Selection</h3>
                </div>
                
                <div className="space-y-3 mb-6">
                  {priceBreakdown.map((item, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg border ${
                        item.type === 'court' ? 'bg-gray-50 border-gray-100' :
                        item.type === 'coach' ? 'bg-indigo-50 border-indigo-100' :
                        'bg-purple-50 border-purple-100'
                      }`}
                    >
                      <div className="flex justify-between text-sm">
                        <span className={`font-medium ${
                          item.type === 'coach' ? 'text-indigo-700' :
                          item.type === 'equipment' ? 'text-purple-700' :
                          'text-gray-600'
                        }`}>
                          {item.label}
                        </span>
                        <span className={`font-bold ${
                          item.type === 'coach' ? 'text-indigo-700' :
                          item.type === 'equipment' ? 'text-purple-700' :
                          'text-gray-900'
                        }`}>
                          +₹{item.price}
                        </span>
                      </div>
                      {item.badges && item.badges.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.badges.map((badge, i) => (
                            <span 
                              key={i} 
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                badge.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                                badge.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'
                              }`}
                            >
                              {badge.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {priceBreakdown.length === 0 && (
                    <p className="text-xs text-gray-400 italic">No items selected</p>
                  )}
                </div>

                <div className="border-t-2 border-dashed border-gray-200 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Total Amount</span>
                    <span className="text-4xl font-black bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{livePrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
            {bookings.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No bookings found.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map(b => (
                  <div key={b._id} className="border border-gray-100 p-6 rounded-xl flex justify-between items-center hover:bg-gray-50 transition-all">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{b.courtId?.name || "Court Reservation"}</h4>
                      <p className="text-indigo-600 font-medium text-sm">{b.userName}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(b.startTime).toLocaleString()}</p>
                      {b.equipment?.length > 0 && (
                        <div className="mt-3 flex gap-2">
                          {b.equipment.map((eq, i) => (
                            <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full border border-gray-200 font-bold">
                              {eq.itemId?.name || eq.name || "Item"}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">₹{b.totalPrice || 0}</div>
                      <div className="text-green-600 font-bold text-xs bg-green-50 px-3 py-1.5 rounded-full mt-2 inline-block">Confirmed</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};