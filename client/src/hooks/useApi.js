import { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

export const useResources = () => {
  const [resources, setResources] = useState({ courts: [], coaches: [], equipment: [] });
  const [loading, setLoading] = useState(false);

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/resources');
      setResources({
        courts: data.courts || [],
        coaches: data.coaches || [],
        equipment: data.equipment || []
      });
    } catch (err) {
      console.error("Resources fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadResources();
  }, []);

  return { resources, loading, reload: loadResources };
};

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/history');
      setBookings(data);
    } catch (err) {
      console.error("Bookings fetch error:", err);
    }
    setLoading(false);
  };

  const createBooking = async (bookingData) => {
    return await apiRequest('/book', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return { bookings, loading, reload: loadBookings, createBooking };
};

export const useAdminStats = () => {
  const [stats, setStats] = useState({ 
    totalBookings: 0, 
    totalRevenue: 0, 
    activeCourts: 0, 
    activeCoaches: 0 
  });
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/admin/stats');
      setStats(data);
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
    setLoading(false);
  };

  return { stats, loading, reload: loadStats };
};

export const useAdminData = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await apiRequest(`/admin/${endpoint}`);
      setData(result);
    } catch (err) {
      console.error(`${endpoint} fetch error:`, err);
    }
    setLoading(false);
  };

  const create = async (item) => {
    await apiRequest(`/admin/${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(item)
    });
    await loadData();
  };

  const update = async (id, item) => {
    await apiRequest(`/admin/${endpoint}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item)
    });
    await loadData();
  };

  const remove = async (id) => {
    await apiRequest(`/admin/${endpoint}/${id}`, {
      method: 'DELETE'
    });
    await loadData();
  };

  useEffect(() => {
    loadData();
  }, [endpoint]);

  return { data, loading, create, update, remove, reload: loadData };
};