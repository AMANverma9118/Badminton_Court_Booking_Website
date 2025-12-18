import React, { useState, useEffect } from 'react';
import { Award, LogOut, Calendar, Clock, Users, CheckCircle, XCircle, ShoppingCart, Timer } from 'lucide-react';
import { useResources, useBookings } from '../hooks/useApi';
import { TIME_SLOTS, calculatePrice, checkAvailability, getPriceBreakdown } from '../utils/helpers';
import axios from 'axios'; 

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
    const [waitlistLoading, setWaitlistLoading] = useState(false); 

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

    const handleJoinWaitlist = async () => {
        if (!form.courtId || !form.date || !form.time) {
            alert("Please select a court, date, and time first.");
            return;
        }

        setWaitlistLoading(true);
        try {
            const payload = {
                courtId: form.courtId,
                startTime: `${form.date}T${form.time}:00`,
            };

            const response = await axios.post('http://localhost:5000/api/waitlist/join', payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            alert(`🔔 ${response.data.message}`);
            setView('history');
        } catch (err) {
            alert(err.response?.data?.error || "Failed to join waitlist");
        } finally {
            setWaitlistLoading(false);
        }
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
            <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Award className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    ProCourt
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Welcome, {user.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setView('book')}
                                className={`px-3 py-2 sm:px-6 sm:py-2.5 rounded-lg font-medium transition-all text-xs sm:text-base ${view === 'book'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="hidden sm:inline">New Booking</span>
                                <span className="sm:hidden">Book</span>
                            </button>
                            <button
                                onClick={() => setView('history')}
                                className={`px-3 py-2 sm:px-6 sm:py-2.5 rounded-lg font-medium transition-all text-xs sm:text-base ${view === 'history'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="hidden sm:inline">My Bookings</span>
                                <span className="sm:hidden">History</span>
                            </button>
                            <button
                                onClick={onLogout}
                                className="px-3 py-2 sm:px-4 sm:py-2.5 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-all flex items-center space-x-1 sm:space-x-2 text-xs sm:text-base"
                            >
                                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                {view === 'book' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
                        <div className="lg:col-span-2 order-2 lg:order-1">
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-4 sm:px-8 py-4 sm:py-6">
                                    <h2 className="text-xl sm:text-2xl font-bold text-white">Create New Booking</h2>
                                    <p className="text-indigo-100 mt-1 text-xs sm:text-base">Fill in the details to reserve your slot</p>
                                </div>

                                <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-4 sm:space-y-6">
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
                                            onChange={e => setForm({ ...form, userName: e.target.value })}
                                            className="w-full px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm sm:text-base"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                                            <Award className="w-4 h-4" />
                                            <span>Select Court</span>
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {resources.courts.map(court => (
                                                <button
                                                    key={court._id}
                                                    type="button"
                                                    onClick={() => setForm({ ...form, courtId: court._id })}
                                                    className={`p-3 sm:p-4 border-2 rounded-xl text-left transition-all ${form.courtId === court._id
                                                        ? 'border-indigo-600 bg-indigo-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="font-semibold text-gray-900 text-sm sm:text-base">{court.name}</div>
                                                    <div className="text-xs sm:text-sm text-gray-600 mt-1">{court.type} • ₹{court.basePrice}/hr</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>Date</span>
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={form.date}
                                                onChange={e => setForm({ ...form, date: e.target.value })}
                                                className="w-full px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
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
                                                onChange={e => setForm({ ...form, time: e.target.value })}
                                                className="w-full px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
                                            >
                                                <option value="">Select time</option>
                                                {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {availability !== null && (
                                        <div className={`p-3 sm:p-4 rounded-xl border flex flex-col space-y-3 transition-all ${availability
                                            ? 'bg-green-50 border-green-200'
                                            : 'bg-amber-50 border-amber-200'
                                            }`}>
                                            <div className="flex items-center space-x-3">
                                                {availability ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" /> : <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />}
                                                <span className={`text-xs sm:text-sm font-bold ${availability ? 'text-green-800' : 'text-amber-800'}`}>
                                                    {availability ? "This slot is available!" : "Slot is currently full"}
                                                </span>
                                            </div>

                                            {!availability && (
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-2 border-t border-amber-200">
                                                    <p className="text-xs text-amber-700 font-medium italic">
                                                        Don't miss out! Join the waitlist to be notified immediately on a cancellation.
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={handleJoinWaitlist}
                                                        disabled={waitlistLoading}
                                                        className="w-full sm:w-auto bg-amber-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold hover:bg-amber-700 flex items-center justify-center space-x-2 whitespace-nowrap"
                                                    >
                                                        <Timer className="w-4 h-4" />
                                                        <span>{waitlistLoading ? 'Joining...' : 'Join Waitlist'}</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Add Equipment (Optional)</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {resources.equipment.map(item => (
                                                <label
                                                    key={item._id}
                                                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={form.equipment.some(e => e.itemId === item._id)}
                                                        onChange={(e) => handleEquipChange(item._id, e.target.checked)}
                                                        className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600"
                                                    />
                                                    <span className="text-xs sm:text-sm text-gray-700">{item.name} (+₹{item.hourlyRate})</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Add Coach (Optional)</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {resources.coaches.map(coach => (
                                                <button
                                                    key={coach._id}
                                                    type="button"
                                                    onClick={() => setForm({ ...form, coachId: coach._id })}
                                                    className={`p-3 sm:p-4 border-2 rounded-xl text-left transition-all ${form.coachId === coach._id
                                                        ? 'border-indigo-600 bg-indigo-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="font-semibold text-gray-900 text-sm sm:text-base">{coach.name}</div>
                                                    <div className="text-xs sm:text-sm text-gray-600 mt-1">+₹{coach.hourlyRate}/hr</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || availability === false}
                                        className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Processing..." : "Confirm Booking"}
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="lg:col-span-1 order-1 lg:order-2">
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:sticky lg:top-24">
                                <div className="flex items-center space-x-2 mb-4 sm:mb-6 text-indigo-600">
                                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900">Your Selection</h3>
                                </div>

                                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                                    {priceBreakdown.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`p-2 sm:p-3 rounded-lg border ${item.type === 'court' ? 'bg-gray-50 border-gray-100' :
                                                item.type === 'coach' ? 'bg-indigo-50 border-indigo-100' :
                                                    'bg-purple-50 border-purple-100'
                                                }`}
                                        >
                                            <div className="flex justify-between text-xs sm:text-sm">
                                                <span className={`font-medium ${item.type === 'coach' ? 'text-indigo-700' :
                                                    item.type === 'equipment' ? 'text-purple-700' :
                                                        'text-gray-600'
                                                    }`}>
                                                    {item.label}
                                                </span>
                                                <span className={`font-bold ${item.type === 'coach' ? 'text-indigo-700' :
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
                                                            className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold ${badge.color === 'blue' ? 'bg-blue-100 text-blue-700' :
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

                                <div className="border-t-2 border-dashed border-gray-200 pt-4 sm:pt-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px] sm:text-xs">Total Amount</span>
                                        <span className="text-3xl sm:text-4xl font-black bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            ₹{livePrice.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-8">
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">My Bookings</h2>
                        {bookings.length === 0 ? (
                            <p className="text-gray-500 text-center py-10 text-sm sm:text-base">No bookings found.</p>
                        ) : (
                            <div className="space-y-3 sm:space-y-4">
                                {bookings.map(b => (
                                    <div key={b._id} className="border border-gray-100 p-4 sm:p-6 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-gray-50 transition-all">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-base sm:text-lg text-gray-900">{b.courtId?.name || "Court Reservation"}</h4>
                                            <p className="text-indigo-600 font-medium text-xs sm:text-sm">{b.userName}</p>
                                            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{new Date(b.startTime).toLocaleString()}</p>
                                            {b.equipment?.length > 0 && (
                                                <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-2">
                                                    {b.equipment.map((eq, i) => (
                                                        <span key={i} className="text-[9px] sm:text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full border border-gray-200 font-bold">
                                                            {eq.itemId?.name || eq.name || "Item"}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <div className="text-xl sm:text-2xl font-bold text-gray-900">₹{b.totalPrice || 0}</div>
                                            <div className="text-green-600 font-bold text-[10px] sm:text-xs bg-green-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full mt-2 inline-block">Confirmed</div>
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