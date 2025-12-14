import { create } from 'zustand';
import * as offersApi from '../api/offers';

const useOfferStore = create((set, get) => ({
  offers: [],
  myOffers: [],
  selectedOffer: null,
  isLoading: false,
  error: null,

  fetchOffers: async (status = null) => {
    set({ isLoading: true, error: null });
    try {
      const response = await offersApi.getOffers(status);
      set({ offers: response.data || response, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch offers',
      });
    }
  },

  fetchMyOffers: async (status = null) => {
    set({ isLoading: true, error: null });
    try {
      const response = await offersApi.getMyOffers(status);
      set({ myOffers: response.data || response, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch offers',
      });
    }
  },

  createOffer: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await offersApi.createOffer(data);
      set({
        myOffers: [response.offer, ...get().myOffers],
        isLoading: false,
      });
      return { success: true, data: response.offer };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create offer',
      };
    }
  },

  acceptOffer: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await offersApi.acceptOffer(id);
      set({
        offers: get().offers.map((o) =>
          o.id === id ? { ...o, status: 'accepted' } : { ...o, status: o.status === 'pending' ? 'rejected' : o.status }
        ),
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to accept offer',
      };
    }
  },

  rejectOffer: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await offersApi.rejectOffer(id);
      set({
        offers: get().offers.map((o) =>
          o.id === id ? { ...o, status: 'rejected' } : o
        ),
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to reject offer',
      };
    }
  },

  withdrawOffer: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await offersApi.withdrawOffer(id);
      set({
        myOffers: get().myOffers.map((o) =>
          o.id === id ? { ...o, status: 'withdrawn' } : o
        ),
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to withdraw offer',
      };
    }
  },

  uploadOfferPhoto: async (offerId, photoUri) => {
    try {
      const formData = new FormData();
      formData.append('photo', {
        uri: photoUri,
        type: 'image/jpeg',
        name: `offer_${offerId}_${Date.now()}.jpg`,
      });
      await offersApi.uploadOfferPhoto(offerId, formData);
      return { success: true };
    } catch (error) {
      console.log('Photo upload failed:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to upload photo' };
    }
  },

  setSelectedOffer: (offer) => set({ selectedOffer: offer }),
  clearError: () => set({ error: null }),
}));

export default useOfferStore;
