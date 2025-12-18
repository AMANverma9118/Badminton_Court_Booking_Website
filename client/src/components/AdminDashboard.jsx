import React, { useState, useEffect } from 'react';
import { Shield, LogOut, BarChart3, Award, Users, Package, DollarSign, Calendar, Edit, Trash2, Plus } from 'lucide-react';
import { useAdminStats, useAdminData } from '../hooks/useApi';
import { CourtForm, CoachForm, EquipmentForm, PricingRuleForm } from './Forms';

export const AdminDashboard = ({ user, onLogout }) => {
  const [view, setView] = useState('stats');
  const [editItem, setEditItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const { stats, reload: reloadStats } = useAdminStats();
  const { data: courts, create: createCourt, update: updateCourt, remove: removeCourt } = useAdminData('courts');
  const { data: coaches, create: createCoach, update: updateCoach, remove: removeCoach } = useAdminData('coaches');
  const { data: equipment, create: createEquipment, update: updateEquipment, remove: removeEquipment } = useAdminData('equipment');
  const { data: pricingRules, create: createRule, update: updateRule, remove: removeRule } = useAdminData('pricing-rules');
  const { data: bookings } = useAdminData('bookings');

  useEffect(() => {
    if (view === 'stats') {
      reloadStats();
    }
  }, [view]);

  const handleSave = async (type, data) => {
    try {
      if (editItem) {
        if (type === 'courts') await updateCourt(editItem._id, data);
        else if (type === 'coaches') await updateCoach(editItem._id, data);
        else if (type === 'equipment') await updateEquipment(editItem._id, data);
        else if (type === 'pricing-rules') await updateRule(editItem._id, data);
      } else {
        if (type === 'courts') await createCourt(data);
        else if (type === 'coaches') await createCoach(data);
        else if (type === 'equipment') await createEquipment(data);
        else if (type === 'pricing-rules') await createRule(data);
      }
      
      alert('Saved successfully!');
      setEditItem(null);
      setShowForm(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      if (type === 'courts') await removeCourt(id);
      else if (type === 'coaches') await removeCoach(id);
      else if (type === 'equipment') await removeEquipment(id);
      else if (type === 'pricing-rules') await removeRule(id);
      
      alert('Deleted successfully!');
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
              <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">Welcome, {user.name}</p>
              </div>
            </div>
            <button 
              onClick={onLogout} 
              className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-all flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white min-h-screen border-r border-gray-200">
          <nav className="p-4 space-y-2">
            <button 
              onClick={() => { setView('stats'); setShowForm(false); }} 
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                view === 'stats' ? 'bg-purple-50 text-purple-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => { setView('courts'); setShowForm(false); }} 
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                view === 'courts' ? 'bg-purple-50 text-purple-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Award className="w-5 h-5" />
              <span>Courts</span>
            </button>
            <button 
              onClick={() => { setView('coaches'); setShowForm(false); }} 
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                view === 'coaches' ? 'bg-purple-50 text-purple-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Coaches</span>
            </button>
            <button 
              onClick={() => { setView('equipment'); setShowForm(false); }} 
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                view === 'equipment' ? 'bg-purple-50 text-purple-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Equipment</span>
            </button>
            <button 
              onClick={() => { setView('pricing'); setShowForm(false); }} 
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                view === 'pricing' ? 'bg-purple-50 text-purple-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
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
                      <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.totalRevenue.toFixed(0)}</p>
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
                        <p className="font-bold text-gray-900">₹{b.totalPrice}</p>
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
                <button 
                  onClick={() => { setEditItem(null); setShowForm(true); }} 
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center space-x-2"
                >
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
                        <button 
                          onClick={() => { setEditItem(court); setShowForm(true); }} 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete('courts', court._id)} 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-purple-600">₹{court.basePrice}/hr</span>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        court.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
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
                <button 
                  onClick={() => { setEditItem(null); setShowForm(true); }} 
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center space-x-2"
                >
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
                        <button 
                          onClick={() => { setEditItem(coach); setShowForm(true); }} 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete('coaches', coach._id)} 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-purple-600">₹{coach.hourlyRate}/hr</span>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        coach.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
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
                <button 
                  onClick={() => { setEditItem(null); setShowForm(true); }} 
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center space-x-2"
                >
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
                        <button 
                          onClick={() => { setEditItem(item); setShowForm(true); }} 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete('equipment', item._id)} 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-purple-600">₹{item.hourlyRate}/hr</span>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
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
                <button 
                  onClick={() => { setEditItem(null); setShowForm(true); }} 
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center space-x-2"
                >
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
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            rule.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
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
                        <button 
                          onClick={() => { setEditItem(rule); setShowForm(true); }} 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete('pricing-rules', rule._id)} 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
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
};