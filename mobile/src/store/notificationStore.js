import { create } from 'zustand';
import * as notificationsApi from '../api/notifications';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await notificationsApi.getNotifications(page);
      const data = response.data || response;
      set({
        notifications: page === 1 ? data : [...get().notifications, ...data],
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch notifications',
      });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await notificationsApi.getUnreadCount();
      set({ unreadCount: response.unread_count });
    } catch (error) {
      // Silently fail
    }
  },

  markAsRead: async (id) => {
    try {
      await notificationsApi.markAsRead(id);
      set({
        notifications: get().notifications.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        ),
        unreadCount: Math.max(0, get().unreadCount - 1),
      });
    } catch (error) {
      // Silently fail
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationsApi.markAllAsRead();
      set({
        notifications: get().notifications.map((n) => ({ ...n, is_read: true })),
        unreadCount: 0,
      });
    } catch (error) {
      // Silently fail
    }
  },

  deleteNotification: async (id) => {
    try {
      await notificationsApi.deleteNotification(id);
      const notification = get().notifications.find((n) => n.id === id);
      set({
        notifications: get().notifications.filter((n) => n.id !== id),
        unreadCount: notification && !notification.is_read
          ? Math.max(0, get().unreadCount - 1)
          : get().unreadCount,
      });
    } catch (error) {
      // Silently fail
    }
  },

  addNotification: (notification) => {
    set({
      notifications: [notification, ...get().notifications],
      unreadCount: get().unreadCount + 1,
    });
  },

  clearError: () => set({ error: null }),
}));

export default useNotificationStore;
