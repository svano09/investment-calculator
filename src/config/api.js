const API_URL = 'https://investment-calculator-2-vnxg.onrender.com/api';

const api = {
  // Auth endpoints
  register: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Registration failed');
    }
    return res.json();
  },

  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }
    return res.json();
  },

  logout: async () => {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    return res.json();
  },

  // Calculation endpoints
  calculate: async (type, inputs) => {
    const res = await fetch(`${API_URL}/calculate/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Calculation failed');
    return res.json();
  },

  getCalculations: async () => {
    const res = await fetch(`${API_URL}/calculations`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch calculations');
    return res.json();
  },

  deleteCalculation: async (id) => {
    const res = await fetch(`${API_URL}/calculations/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to delete calculation');
    return res.json();
  }
};

export default api;