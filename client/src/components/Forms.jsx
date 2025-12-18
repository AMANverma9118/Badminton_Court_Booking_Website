// src/components/Forms.jsx

import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

export const CourtForm = ({ item, onSave, onCancel }) => {
  const [form, setForm] = useState(item || { 
    name: '', 
    type: 'indoor', 
    basePrice: 0, 
    isActive: true 
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-bold mb-4">{item ? 'Edit Court' : 'Add New Court'}</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Court Name</label>
          <input 
            type="text" 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
          <select 
            value={form.type} 
            onChange={e => setForm({...form, type: e.target.value})} 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Base Price ($/hr)</label>
          <input 
            type="number" 
            value={form.basePrice} 
            onChange={e => setForm({...form, basePrice: Number(e.target.value)})} 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <select 
            value={form.isActive} 
            onChange={e => setForm({...form, isActive: e.target.value === 'true'})} 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>
      <div className="flex space-x-3">
        <button 
          onClick={() => onSave(form)} 
          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
        <button 
          onClick={onCancel} 
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all flex items-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
};

export const CoachForm = ({ item, onSave, onCancel }) => {
  const [form, setForm] = useState(item || { 
    name: '', 
    hourlyRate: 0, 
    specialization: '', 
    isAvailable: true 
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-bold mb-4">{item ? 'Edit Coach' : 'Add New Coach'}</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Coach Name</label>
          <input 
            type="text" 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate ($)</label>
          <input 
            type="number" 
            value={form.hourlyRate} 
            onChange={e => setForm({...form, hourlyRate: Number(e.target.value)})} 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
          <input 
            type="text" 
            value={form.specialization} 
            onChange={e => setForm({...form, specialization: e.target.value})} 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" 
            placeholder="e.g., Advanced Training" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
          <select 
            value={form.isAvailable} 
            onChange={e => setForm({...form, isAvailable: e.target.value === 'true'})} 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
      </div>
      <div className="flex space-x-3">
        <button 
          onClick={() => onSave(form)} 
          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
        <button 
          onClick={onCancel} 
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all flex items-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
};

export const EquipmentForm = ({ item, onSave, onCancel }) => {
  const [form, setForm] = useState(item || { 
    name: '', 
    totalStock: 0, 
    hourlyRate: 0, 
    isAvailable: true 
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-bold mb-4">{item ? 'Edit Equipment' : 'Add New Equipment'}</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Equipment Name</label>
          <input 
            type="text" 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Total Stock</label>
          <input 
            type="number" 
            value={form.totalStock} 
            onChange={e => setForm({...form, totalStock: Number(e.target.value)})} 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate ($)</label>
          <input 
            type="number" 
            value={form.hourlyRate} 
            onChange={e => setForm({...form, hourlyRate: Number(e.target.value)})} 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
          <select 
            value={form.isAvailable} 
            onChange={e => setForm({...form, isAvailable: e.target.value === 'true'})} 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
      </div>
      <div className="flex space-x-3">
        <button 
          onClick={() => onSave(form)} 
          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
        <button 
          onClick={onCancel} 
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all flex items-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
};

export const PricingRuleForm = ({ item, onSave, onCancel }) => {
  const [form, setForm] = useState(item || { 
    name: '', 
    ruleType: 'peak', 
    multiplier: 1.0, 
    description: '', 
    isActive: true 
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-bold mb-4">{item ? 'Edit Pricing Rule' : 'Add New Pricing Rule'}</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Rule Name</label>
          <input 
            type="text" 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Rule Type</label>
          <select 
            value={form.ruleType} 
            onChange={e => setForm({...form, ruleType: e.target.value})} 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="peak">Peak Hours</option>
            <option value="weekend">Weekend</option>
            <option value="indoor_premium">Indoor Premium</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Multiplier</label>
          <input 
            type="number" 
            step="0.1" 
            value={form.multiplier} 
            onChange={e => setForm({...form, multiplier: Number(e.target.value)})} 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <select 
            value={form.isActive} 
            onChange={e => setForm({...form, isActive: e.target.value === 'true'})} 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea 
            value={form.description} 
            onChange={e => setForm({...form, description: e.target.value})} 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" 
            rows="2" 
            placeholder="Brief description of the rule"
          ></textarea>
        </div>
      </div>
      <div className="flex space-x-3">
        <button 
          onClick={() => onSave(form)} 
          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
        <button 
          onClick={onCancel} 
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all flex items-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
};