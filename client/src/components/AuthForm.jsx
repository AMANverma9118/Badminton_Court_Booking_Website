// src/components/AuthForm.jsx

import React, { useState } from 'react';
import { Award, Eye, EyeOff } from 'lucide-react';

export const AuthForm = ({ onSignin, onSignup }) => {
  const [authView, setAuthView] = useState('signin');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (authView === 'signin') {
        await onSignin(form.email, form.password);
      } else {
        await onSignup(form.name, form.email, form.password);
      }
      setForm({ name: '', email: '', password: '' });
    } catch (err) {
      alert(err.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <Award className="w-10 h-10" />
            <h1 className="text-3xl font-bold">ProCourt</h1>
          </div>
          <p className="text-center text-indigo-100">Premium Badminton Facility</p>
        </div>

        <div className="p-8">
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setAuthView('signin')} 
              className={`flex-1 py-2 rounded-md font-medium transition-all ${
                authView === 'signin' 
                  ? 'bg-white shadow-sm text-indigo-600' 
                  : 'text-gray-600'
              }`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setAuthView('signup')} 
              className={`flex-1 py-2 rounded-md font-medium transition-all ${
                authView === 'signup' 
                  ? 'bg-white shadow-sm text-indigo-600' 
                  : 'text-gray-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authView === 'signup' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="Enter your name" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" 
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input 
                type="email" 
                required 
                placeholder="Enter your email" 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  placeholder="Enter your password" 
                  value={form.password} 
                  onChange={e => setForm({...form, password: e.target.value})} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : (authView === 'signin' ? 'Sign In' : 'Create Account')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};