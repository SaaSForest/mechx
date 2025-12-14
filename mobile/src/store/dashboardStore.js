import { create } from 'zustand';
import * as dashboardApi from '../api/dashboard';

const useDashboardStore = create((set) => ({
  // Seller dashboard data
  sellerStats: null,
  sellerRevenue: 0,

  // Buyer dashboard data
  buyerStats: null,
  featuredCars: [],

  isLoading: false,
  error: null,

  fetchSellerDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await dashboardApi.getSellerDashboard();
      set({
        sellerStats: response.stats,
        sellerRevenue: response.revenue || 0,
        isLoading: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch dashboard',
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  fetchBuyerDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await dashboardApi.getBuyerDashboard();
      set({
        buyerStats: response.stats,
        featuredCars: response.featured_cars || [],
        isLoading: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch dashboard',
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  clearDashboard: () => set({
    sellerStats: null,
    sellerRevenue: 0,
    buyerStats: null,
    featuredCars: [],
    error: null,
  }),
}));

export default useDashboardStore;
