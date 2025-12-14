import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as searchApi from '../api/search';

const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 10;

const useSearchStore = create((set, get) => ({
  results: {
    cars: [],
    parts: [],
    sellers: [],
  },
  recentSearches: [],
  isLoading: false,
  error: null,

  search: async (query, type = null) => {
    if (!query || query.length < 2) {
      set({ results: { cars: [], parts: [], sellers: [] } });
      return;
    }

    set({ isLoading: true, error: null });

    // Add to recent searches immediately when user searches
    await get().addRecentSearch(query);

    try {
      const response = await searchApi.search(query, type);
      set({
        results: {
          cars: response.cars || [],
          parts: response.parts || [],
          sellers: response.sellers || [],
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Search failed',
        results: { cars: [], parts: [], sellers: [] },
      });
    }
  },

  loadRecentSearches: async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        set({ recentSearches: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  },

  addRecentSearch: async (query) => {
    try {
      const { recentSearches } = get();
      // Remove if already exists, add to front
      const filtered = recentSearches.filter(
        (s) => s.toLowerCase() !== query.toLowerCase()
      );
      const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      set({ recentSearches: updated });
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  },

  removeRecentSearch: async (query) => {
    try {
      const { recentSearches } = get();
      const updated = recentSearches.filter(
        (s) => s.toLowerCase() !== query.toLowerCase()
      );
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      set({ recentSearches: updated });
    } catch (error) {
      console.error('Failed to remove recent search:', error);
    }
  },

  clearRecentSearches: async () => {
    try {
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
      set({ recentSearches: [] });
    } catch (error) {
      console.error('Failed to clear recent searches:', error);
    }
  },

  clearResults: () => set({ results: { cars: [], parts: [], sellers: [] } }),
  clearError: () => set({ error: null }),
}));

export default useSearchStore;
