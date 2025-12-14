import { create } from 'zustand';
import * as savedItemsApi from '../api/savedItems';

const useSavedItemsStore = create((set, get) => ({
  savedCars: [],
  savedParts: [],
  isLoading: false,
  error: null,

  fetchSavedItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await savedItemsApi.getSavedItems();
      set({
        savedCars: response.cars || [],
        savedParts: response.parts || [],
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch saved items',
      });
    }
  },

  saveItem: async (type, id) => {
    try {
      await savedItemsApi.saveItem(type, id);
      // Refresh the list
      await get().fetchSavedItems();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to save item',
      };
    }
  },

  unsaveItem: async (type, id) => {
    try {
      await savedItemsApi.unsaveItem(type, id);

      // Optimistically update the UI
      if (type === 'car') {
        set({
          savedCars: get().savedCars.filter((car) => car.id !== id),
        });
      } else {
        set({
          savedParts: get().savedParts.filter((part) => part.id !== id),
        });
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to remove item',
      };
    }
  },

  checkIfSaved: async (type, id) => {
    try {
      const response = await savedItemsApi.checkIfSaved(type, id);
      return response.is_saved;
    } catch (error) {
      return false;
    }
  },

  isCarSaved: (carId) => {
    return get().savedCars.some((car) => car.id === carId);
  },

  isPartSaved: (partId) => {
    return get().savedParts.some((part) => part.id === partId);
  },

  clearSavedItems: () => {
    set({ savedCars: [], savedParts: [], error: null });
  },
}));

export default useSavedItemsStore;
