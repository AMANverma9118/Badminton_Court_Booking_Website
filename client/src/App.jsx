import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Award, DollarSign, CheckCircle, XCircle, ShoppingCart, Settings, LogOut, BarChart3, Package, UserCircle, Shield, Eye, EyeOff, Edit, Trash2, Plus, Save, X } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState('signin');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const endpoint = authView === 'signin' ? '/auth/signin' : '/auth/signup';
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
      setAuthForm({ name: '', email: '', password: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Award className="w-10 h-10" />
              <h1 className="text-3xl font-bold">ProCourt</h1>
            </div>
            <p className="text-center text-indigo-100">Premium Badminton Facility</p>
          </div>

          <div className="p-8">
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button onClick={() => setAuthView('signin')} className={`flex-1 py-2 rounded-md font-medium transition-all ${authView === 'signin' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600'}`}>Sign In</button>
              <button onClick={() => setAuthView('signup')} className={`flex-1 py-2 rounded-md font-medium transition-all ${authView === 'signup' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600'}`}>Sign Up</button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {authView === 'signup' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input type="text" required placeholder="Enter your name" value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all" />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input type="email" required placeholder="Enter your email" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} required placeholder="Enter your password" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all">
                {authView === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return user?.role === 'admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> : <UserDashboard user={user} onLogout={handleLogout} />;
}

function UserDashboard({ user, onLogout }) {
  const [view, setView] = useState('book');
  const [resources, setResources] = useState({ courts: [], coaches: [], equipment: [] });
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    userName: user.name,
    courtId: '',
    coachId: '',
    equipment: [],
    date: '',
    time: ''
  });
  const [livePrice, setLivePrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState(null);

  useEffect(() => {
    loadResources();
    loadBookings();
  }, []);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  const loadResources = async () => {
    try {
      const res = await fetch(`${API_URL}/resources`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setResources({
        courts: data.courts || [],
        coaches: data.coaches || [],
        equipment: data.equipment || []
      });
    } catch (err) {
      console.error("Resources fetch error:", err);
    }
  };

  const loadBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/history`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Bookings fetch error:", err);
    }
  };

  useEffect(() => {
    if (form.courtId && form.date && form.time) {
      checkAvailability();
    } else {
      setAvailability(null);
    }
  }, [form.courtId, form.date, form.time]);

  const checkAvailability = async () => {
    try {
      const requestedDate = new Date(`${form.date}T${form.time}:00`);
      const isAlreadyBooked = bookings.some(b => {
        const bookingDate = new Date(b.startTime);
        const courtId = b.courtId?._id || b.courtId;
        return courtId === form.courtId && bookingDate.getTime() === requestedDate.getTime();
      });
      setAvailability(!isAlreadyBooked);
    } catch (err) {
      setAvailability(false);
    }
  };

  useEffect(() => {
    if (!form.courtId || !form.date || !form.time) {
      setLivePrice(0);
      return;
    }

    const court = resources.courts.find(c => c._id === form.courtId);
    const coach = resources.coaches.find(c => c._id === form.coachId);
    const [hours] = form.time.split(':').map(Number);
    const selectedDate = new Date(form.date);
    
    let total = court ? court.basePrice : 0;

    if (court?.type?.toLowerCase() === 'indoor') total *= 1.2;
    if (hours >= 18 && hours < 21) total *= 1.5;
    if ([0, 6].includes(selectedDate.getDay())) total *= 1.3;

    if (coach) total += coach.hourlyRate;
    form.equipment.forEach(item => {
      const equipInfo = resources.equipment.find(e => e._id === item.itemId);
      if (equipInfo) total += equipInfo.hourlyRate * item.quantity;
    });

    setLivePrice(total);
  }, [form, resources]);

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
      const res = await fetch(`${API_URL}/book`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Booking failed');
      
      alert("✨ Booking Confirmed Successfully!");
      setForm({ userName: user.name, courtId: '', coachId: '', equipment: [], date: '', time: '' });
      setAvailability(null);
      loadBookings();
      setView('history');
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  const timeSlots = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ProCourt Scheduler</h1>
                <p className="text-sm text-gray-600">Welcome, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setView('book')} className={`px-6 py-2.5 rounded-lg font-medium transition-all ${view === 'book' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-600 hover:bg-gray-100'}`}>New Booking</button>
              <button onClick={() => setView('history')} className={`px-6 py-2.5 rounded-lg font-medium transition-all ${view === 'history' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-600 hover:bg-gray-100'}`}>My Bookings</button>
              <button onClick={onLogout} className="ml-4 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-all flex items-center space-x-2">
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
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                  <h2 className="text-2xl font-bold text-white">Create New Booking</h2>
                  <p className="text-indigo-100 mt-1">Fill in the details to reserve your slot</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                      <Users className="w-4 h-4" />
                      <span>Player Name</span>
                    </label>
                    <input type="text" required placeholder="Enter name" value={form.userName} onChange={e => setForm({...form, userName: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                      <Award className="w-4 h-4" />
                      <span>Select Court</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {resources.courts.map(court => (
                        <button key={court._id} type="button" onClick={() => setForm({...form, courtId: court._id})} className={`p-4 border-2 rounded-xl text-left transition-all ${form.courtId === court._id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className="font-semibold text-gray-900">{court.name}</div>
                          <div className="text-sm text-gray-600 mt-1">{court.type} • ${court.basePrice}/hr</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2"><Calendar className="w-4 h-4" /><span>Date</span></label>
                      <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                    </div>
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2"><Clock className="w-4 h-4" /><span>Time Slot</span></label>
                      <select required value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl">
                        <option value="">Select time</option>
                        {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                      </select>
                    </div>
                  </div>

                  {availability !== null && (
                    <div className={`flex items-center space-x-3 p-4 rounded-xl border ${availability ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                      {availability ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                      <span className="text-sm font-medium">{availability ? "This slot is available!" : "This slot is already booked."}</span>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Add Equipment (Optional)</label>
                    <div className="grid grid-cols-2 gap-3">
                      {resources.equipment.map(item => (
                        <label key={item._id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                          <input type="checkbox" checked={form.equipment.some(e => e.itemId === item._id)} onChange={(e) => handleEquipChange(item._id, e.target.checked)} className="w-5 h-5 text-indigo-600" />
                          <span className="text-sm text-gray-700">{item.name} (+${item.hourlyRate})</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Add Coach (Optional)</label>
                    <div className="grid grid-cols-2 gap-3">
                      {resources.coaches.map(coach => (
                        <button key={coach._id} type="button" onClick={() => setForm({...form, coachId: coach._id})} className={`p-4 border-2 rounded-xl text-left transition-all ${form.coachId === coach._id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className="font-semibold text-gray-900">{coach.name}</div>
                          <div className="text-sm text-gray-600 mt-1">+${coach.hourlyRate}/hr</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button type="submit" disabled={loading || availability === false} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
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
                  {form.courtId ? (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">{resources.courts.find(c => c._id === form.courtId)?.name} (Base)</span>
                        <span className="font-bold">${resources.courts.find(c => c._id === form.courtId)?.basePrice}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {resources.courts.find(c => c._id === form.courtId)?.type === 'indoor' && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">INDOOR +20%</span>}
                        {form.time && parseInt(form.time) >= 18 && parseInt(form.time) < 21 && <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">PEAK +50%</span>}
                        {form.date && [0, 6].includes(new Date(form.date).getDay()) && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">WEEKEND +30%</span>}
                      </div>
                    </div>
                  ) : <p className="text-xs text-gray-400 italic">No court selected</p>}

                  {form.coachId && (
                    <div className="flex justify-between text-sm p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                      <span className="text-indigo-700 font-medium">{resources.coaches.find(c => c._id === form.coachId)?.name}</span>
                      <span className="font-bold text-indigo-700">+${resources.coaches.find(c => c._id === form.coachId)?.hourlyRate}</span>
                    </div>
                  )}

                  {form.equipment.map(item => {
                    const equip = resources.equipment.find(e => e._id === item.itemId);
                    return (
                      <div key={item.itemId} className="flex justify-between text-sm p-3 bg-purple-50 rounded-lg border border-purple-100">
                        <span className="text-purple-700 font-medium">{equip?.name}</span>
                        <span className="font-bold text-purple-700">+${equip?.hourlyRate}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t-2 border-dashed border-gray-200 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Total Amount</span>
                    <span className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      ${livePrice.toFixed(2)}
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
                       <div className="text-2xl font-bold text-gray-900">${b.totalPrice || 0}</div>
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
}

function AdminDashboard({ user, onLogout }) {
  const [view, setView] = useState('stats');
  const [stats, setStats] = useState({ totalBookings: 0, totalRevenue: 0, activeCourts: 0, activeCoaches: 0 });
  const [courts, setCourts] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [pricingRules, setPricingRules] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, [view]);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  const loadAdminData = async () => {
    try {
      if (view === 'stats') {
        const res = await fetch(`${API_URL}/admin/stats`, { headers: getAuthHeaders() });
        const data = await res.json();
        setStats(data);
        
        const bookingsRes = await fetch(`${API_URL}/admin/bookings`, { headers: getAuthHeaders() });
        setBookings(await bookingsRes.json());
      } else if (view === 'courts') {
        const res = await fetch(`${API_URL}/admin/courts`, { headers: getAuthHeaders() });
        setCourts(await res.json());
      } else if (view === 'coaches') {
        const res = await fetch(`${API_URL}/admin/coaches`, { headers: getAuthHeaders() });
        setCoaches(await res.json());
      } else if (view === 'equipment') {
        const res = await fetch(`${API_URL}/admin/equipment`, { headers: getAuthHeaders() });
        setEquipment(await res.json());
      } else if (view === 'pricing') {
        const res = await fetch(`${API_URL}/admin/pricing-rules`, { headers: getAuthHeaders() });
        setPricingRules(await res.json());
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    }
  };

  const handleSave = async (type, data) => {
    try {
      const endpoint = `${API_URL}/admin/${type}${editItem ? `/${editItem._id}` : ''}`;
      const method = editItem ? 'PUT' : 'POST';
      
      const res = await fetch(endpoint, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error('Operation failed');
      
      alert('Saved successfully!');
      setEditItem(null);
      setShowForm(false);
      loadAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await fetch(`${API_URL}/admin/${type}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      alert('Deleted successfully!');
      loadAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome, {user.name}</p>
              </div>
            </div>
            <button onClick={onLogout} className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-all flex items-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white min-h-screen border-r border-gray-200">
          <nav className="p-4 space-y-2">
            <button onClick={() => { setView('stats'); setShowForm(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${view === 'stats' ? 'bg-purple-50 text-purple-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button onClick={() => { setView('courts'); setShowForm(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${view === 'courts' ? 'bg-purple-50 text-purple-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Award className="w-5 h-5" />
              <span>Courts</span>
            </button>
            <button onClick={() => { setView('coaches'); setShowForm(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${view === 'coaches' ? 'bg-purple-50 text-purple-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Users className="w-5 h-5" />
              <span>Coaches</span>
            </button>
            <button onClick={() => { setView('equipment'); setShowForm(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${view === 'equipment' ? 'bg-purple-50 text-purple-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Package className="w-5 h-5" />
              <span>Equipment</span>
            </button>
            <button onClick={() => { setView('pricing'); setShowForm(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${view === 'pricing' ? 'bg-purple-50 text-purple-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
              <DollarSign className="w-5 h-5" />
              <span>Pricing Rules</span>
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {view === 'stats' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Bookings</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBookings}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">${stats.totalRevenue.toFixed(0)}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Active Courts</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeCourts}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Active Coaches</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeCoaches}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold mb-4">Recent Bookings</h3>
                <div className="space-y-3">
                  {bookings.slice(0, 10).map(b => (
                    <div key={b._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">{b.courtId?.name}</p>
                        <p className="text-sm text-gray-600">{b.userId?.name} • {new Date(b.startTime).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${b.totalPrice}</p>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{b.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === 'courts' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Courts Management</h2>
                <button onClick={() => { setEditItem(null); setShowForm(true); }} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Court</span>
                </button>
              </div>

              {showForm && <CourtForm item={editItem} onSave={(data) => handleSave('courts', data)} onCancel={() => { setShowForm(false); setEditItem(null); }} />}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courts.map(court => (
                  <div key={court._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{court.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{court.type} Court</p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => { setEditItem(court); setShowForm(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete('courts', court._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-purple-600">${court.basePrice}/hr</span>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${court.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {court.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'coaches' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Coaches Management</h2>
                <button onClick={() => { setEditItem(null); setShowForm(true); }} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Coach</span>
                </button>
              </div>

              {showForm && <CoachForm item={editItem} onSave={(data) => handleSave('coaches', data)} onCancel={() => { setShowForm(false); setEditItem(null); }} />}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {coaches.map(coach => (
                  <div key={coach._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{coach.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{coach.specialization || 'General Coach'}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => { setEditItem(coach); setShowForm(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete('coaches', coach._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-purple-600">${coach.hourlyRate}/hr</span>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${coach.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {coach.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'equipment' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Equipment Management</h2>
                <button onClick={() => { setEditItem(null); setShowForm(true); }} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Equipment</span>
                </button>
              </div>

              {showForm && <EquipmentForm item={editItem} onSave={(data) => handleSave('equipment', data)} onCancel={() => { setShowForm(false); setEditItem(null); }} />}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {equipment.map(item => (
                  <div key={item._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">Stock: {item.totalStock} units</p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => { setEditItem(item); setShowForm(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete('equipment', item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-purple-600">${item.hourlyRate}/hr</span>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'pricing' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Pricing Rules</h2>
                <button onClick={() => { setEditItem(null); setShowForm(true); }} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Rule</span>
                </button>
              </div>

              {showForm && <PricingRuleForm item={editItem} onSave={(data) => handleSave('pricing-rules', data)} onCancel={() => { setShowForm(false); setEditItem(null); }} />}

              <div className="space-y-4">
                {pricingRules.map(rule => (
                  <div key={rule._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-bold text-lg text-gray-900">{rule.name}</h3>
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${rule.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">Type: <span className="font-semibold text-gray-900">{rule.ruleType}</span></span>
                          <span className="text-sm text-gray-600">Multiplier: <span className="font-semibold text-purple-600">{rule.multiplier}x</span></span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => { setEditItem(rule); setShowForm(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete('pricing-rules', rule._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function CourtForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(item || { name: '', type: 'indoor', basePrice: 0, isActive: true });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-bold mb-4">{item ? 'Edit Court' : 'Add New Court'}</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Court Name</label>
          <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500">
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Base Price ($/hr)</label>
          <input type="number" value={form.basePrice} onChange={e => setForm({...form, basePrice: Number(e.target.value)})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <select value={form.isActive} onChange={e => setForm({...form, isActive: e.target.value === 'true'})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500">
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>
      <div className="flex space-x-3">
        <button onClick={() => onSave(form)} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
        <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all flex items-center space-x-2">
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
}

function CoachForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(item || { name: '', hourlyRate: 0, specialization: '', isAvailable: true });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-bold mb-4">{item ? 'Edit Coach' : 'Add New Coach'}</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Coach Name</label>
          <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate ($)</label>
          <input type="number" value={form.hourlyRate} onChange={e => setForm({...form, hourlyRate: Number(e.target.value)})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
          <input type="text" value={form.specialization} onChange={e => setForm({...form, specialization: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="e.g., Advanced Training" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
          <select value={form.isAvailable} onChange={e => setForm({...form, isAvailable: e.target.value === 'true'})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500">
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
      </div>
      <div className="flex space-x-3">
        <button onClick={() => onSave(form)} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
        <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all flex items-center space-x-2">
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
}

function EquipmentForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(item || { name: '', totalStock: 0, hourlyRate: 0, isAvailable: true });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-bold mb-4">{item ? 'Edit Equipment' : 'Add New Equipment'}</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Equipment Name</label>
          <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Total Stock</label>
          <input type="number" value={form.totalStock} onChange={e => setForm({...form, totalStock: Number(e.target.value)})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate ($)</label>
          <input type="number" value={form.hourlyRate} onChange={e => setForm({...form, hourlyRate: Number(e.target.value)})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
          <select value={form.isAvailable} onChange={e => setForm({...form, isAvailable: e.target.value === 'true'})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500">
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
      </div>
      <div className="flex space-x-3">
        <button onClick={() => onSave(form)} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
        <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all flex items-center space-x-2">
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
}

function PricingRuleForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(item || { name: '', ruleType: 'peak', multiplier: 1.0, description: '', isActive: true });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-bold mb-4">{item ? 'Edit Pricing Rule' : 'Add New Pricing Rule'}</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Rule Name</label>
          <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Rule Type</label>
          <select value={form.ruleType} onChange={e => setForm({...form, ruleType: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500">
            <option value="peak">Peak Hours</option>
            <option value="weekend">Weekend</option>
            <option value="indoor_premium">Indoor Premium</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Multiplier</label>
          <input type="number" step="0.1" value={form.multiplier} onChange={e => setForm({...form, multiplier: Number(e.target.value)})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="e.g., 1.5" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <select value={form.isActive} onChange={e => setForm({...form, isActive: e.target.value === 'true'})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500">
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500" rows="2" placeholder="Describe when this rule applies"></textarea>
        </div>
      </div>
      <div className="flex space-x-3">
        <button onClick={() => onSave(form)} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
        <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all flex items-center space-x-2">
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
}

export default App;