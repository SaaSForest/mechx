import { create } from 'zustand';
import * as carsApi from '../api/cars';

const useCarStore = create((set, get) => ({
  cars: [],
  myCars: [],
  featuredCars: [],
  selectedCar: null,
  isLoading: false,
  error: null,

  fetchCars: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await carsApi.getCars(params);
      set({ cars: response.data || response, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch cars',
      });
    }
  },

  fetchFeaturedCars: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await carsApi.getCars({ featured: 1 });
      set({ featuredCars: response.data || response, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  fetchMyCars: async (status = null) => {
    set({ isLoading: true, error: null });
    try {
      const response = await carsApi.getMyCars(status);
      set({ myCars: response.data || response, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch cars',
      });
    }
  },

  createCar: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await carsApi.createCar(data);
      set({
        myCars: [response.car_listing, ...get().myCars],
        isLoading: false,
      });
      return { success: true, data: response.car_listing };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create listing',
      };
    }
  },

  getCar: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await carsApi.getCar(id);
      set({ selectedCar: response, isLoading: false });
      return { success: true, data: response };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get car',
      };
    }
  },

  updateCar: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await carsApi.updateCar(id, data);
      const updated = response.car_listing;
      set({
        myCars: get().myCars.map((c) => (c.id === id ? updated : c)),
        cars: get().cars.map((c) => (c.id === id ? updated : c)),
        selectedCar: updated,
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update car',
      };
    }
  },

  deleteCar: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await carsApi.deleteCar(id);
      set({
        myCars: get().myCars.filter((c) => c.id !== id),
        cars: get().cars.filter((c) => c.id !== id),
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete car',
      };
    }
  },

  // Alias for createCar (used by SellCarScreen)
  createListing: async (data) => {
    return get().createCar(data);
  },

  uploadCarPhoto: async (carId, photoUri, isPrimary = false) => {
    try {
      const formData = new FormData();
      formData.append('photo', {
        uri: photoUri,
        type: 'image/jpeg',
        name: `car_${carId}_${Date.now()}.jpg`,
      });
      await carsApi.uploadCarPhoto(carId, formData, isPrimary);
      return { success: true };
    } catch (error) {
      console.log('Photo upload failed:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to upload photo' };
    }
  },

  setSelectedCar: (car) => set({ selectedCar: car }),
  clearError: () => set({ error: null }),
}));

export default useCarStore;
