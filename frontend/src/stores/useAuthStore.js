import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  user: null,

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ token, isAuthenticated: true, user });
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isAuthenticated: false, user: null });
  },

  checkAuth: async () => {
    try {
      const response = await api.get('/auth/me');
      set({ isAuthenticated: true, user: response.data.user });
    } catch (error) {
      localStorage.removeItem('token');
      set({ token: null, isAuthenticated: false, user: null });
    }
  }
}));
