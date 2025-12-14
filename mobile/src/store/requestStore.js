import { create } from 'zustand';
import * as requestsApi from '../api/requests';

const useRequestStore = create((set, get) => ({
  requests: [],
  browseRequests: [],
  selectedRequest: null,
  isLoading: false,
  error: null,
  pagination: null,

  fetchMyRequests: async (status = null) => {
    set({ isLoading: true, error: null });
    try {
      const response = await requestsApi.getMyRequests(status);
      set({
        requests: response.data || response,
        pagination: response.meta || null,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch requests',
      });
    }
  },

  fetchBrowseRequests: async (search = '') => {
    set({ isLoading: true, error: null });
    try {
      const response = await requestsApi.browseRequests(search);
      set({
        browseRequests: response.data || response,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch requests',
      });
    }
  },

  createRequest: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await requestsApi.createRequest(data);
      set({
        requests: [response.part_request, ...get().requests],
        isLoading: false,
      });
      return { success: true, data: response.part_request };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create request',
      };
    }
  },

  getRequest: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await requestsApi.getRequest(id);
      set({ selectedRequest: response, isLoading: false });
      return { success: true, data: response };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get request',
      };
    }
  },

  updateRequest: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await requestsApi.updateRequest(id, data);
      const updated = response.part_request;
      set({
        requests: get().requests.map((r) => (r.id === id ? updated : r)),
        selectedRequest: updated,
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update request',
      };
    }
  },

  deleteRequest: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await requestsApi.deleteRequest(id);
      set({
        requests: get().requests.filter((r) => r.id !== id),
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete request',
      };
    }
  },

  markComplete: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await requestsApi.markRequestComplete(id);
      const updated = response.part_request;
      set({
        requests: get().requests.map((r) => (r.id === id ? updated : r)),
        selectedRequest: updated,
        isLoading: false,
      });
      return { success: true, data: updated };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to mark as complete',
      };
    }
  },

  uploadRequestPhoto: async (requestId, photoUri) => {
    try {
      const formData = new FormData();
      formData.append('photo', {
        uri: photoUri,
        type: 'image/jpeg',
        name: `request_${requestId}_${Date.now()}.jpg`,
      });
      await requestsApi.uploadRequestPhoto(requestId, formData);
      return { success: true };
    } catch (error) {
      console.log('Photo upload failed:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to upload photo' };
    }
  },

  setSelectedRequest: (request) => set({ selectedRequest: request }),
  clearError: () => set({ error: null }),
}));

export default useRequestStore;
