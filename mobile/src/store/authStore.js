import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authApi from '../api/auth';

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  isInitialized: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login(email, password);
      const { user, token } = response;
      await AsyncStorage.setItem('authToken', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  },

  register: async (userData) => {
    set({ isLoading: true });
    try {
      const response = await authApi.register(userData);
      const { user, token } = response;
      await AsyncStorage.setItem('authToken', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors,
      };
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Continue even if API call fails
    }
    await AsyncStorage.removeItem('authToken');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (userData) => {
    set({ user: { ...get().user, ...userData } });
  },

  loadStoredAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        set({ token });
        const user = await authApi.getUser();
        set({ user, isAuthenticated: true, isInitialized: true });
      } else {
        set({ isInitialized: true });
      }
    } catch (error) {
      await AsyncStorage.removeItem('authToken');
      set({ isInitialized: true });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true });
    try {
      const response = await authApi.updateProfile(data);
      set({ user: response.user, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Update failed',
      };
    }
  },
}));

export default useAuthStore;
