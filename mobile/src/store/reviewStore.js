import { create } from 'zustand';
import * as reviewsApi from '../api/reviews';

const useReviewStore = create((set, get) => ({
  reviews: [],
  canReview: false,
  hasReviewed: false,
  isLoading: false,
  error: null,
  pagination: null,

  fetchUserReviews: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reviewsApi.getUserReviews(userId);
      set({
        reviews: response.data || response,
        pagination: response.meta || null,
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch reviews',
      });
      return { success: false };
    }
  },

  createReview: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reviewsApi.createReview(data);
      set({
        hasReviewed: true,
        canReview: false,
        isLoading: false,
      });
      return { success: true, data: response.review };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to submit review',
      };
    }
  },

  checkCanReview: async (offerId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reviewsApi.canReviewOffer(offerId);
      set({
        canReview: response.can_review,
        hasReviewed: response.has_reviewed,
        isLoading: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to check review status',
      };
    }
  },

  resetReviewState: () => set({ canReview: false, hasReviewed: false }),
  clearError: () => set({ error: null }),
}));

export default useReviewStore;
