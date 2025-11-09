import { create } from 'zustand';
import { User } from '../types';
import { authAPI, usersAPI } from '../lib/api';
import { socketService } from '../lib/socket';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
      socketService.connect(data.token);
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true });
    try {
      const { data } = await authAPI.register(userData);
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
      socketService.connect(data.token);
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    socketService.disconnect();
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    set({ isLoading: true });
    try {
      const { data } = await usersAPI.getMe();
      set({ user: data, isAuthenticated: true, isLoading: false });
      socketService.connect(token);
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateProfile: async (userData) => {
    try {
      const { data } = await usersAPI.updateProfile(userData);
      set({ user: data });
    } catch (error) {
      throw error;
    }
  },
}));
