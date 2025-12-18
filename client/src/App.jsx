// src/App.jsx

import React from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthForm } from './components/AuthForm';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';

function App() {
  const { isAuthenticated, user, loading, signin, signup, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm onSignin={signin} onSignup={signup} />;
  }

  return user?.role === 'admin' 
    ? <AdminDashboard user={user} onLogout={logout} />
    : <UserDashboard user={user} onLogout={logout} />;
}

export default App;