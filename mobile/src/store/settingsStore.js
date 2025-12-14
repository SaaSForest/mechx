import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushNotifications } from '../services/notifications';
import * as authApi from '../api/auth';

const SETTINGS_KEY = '@mechx_settings';

const useSettingsStore = create((set, get) => ({
  pushNotificationsEnabled: true,
  isLoading: false,

  loadSettings: async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        set({ pushNotificationsEnabled: settings.pushNotificationsEnabled ?? true });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  },

  saveSettings: async () => {
    try {
      const { pushNotificationsEnabled } = get();
      await AsyncStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ pushNotificationsEnabled })
      );
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  togglePushNotifications: async (enabled) => {
    set({ pushNotificationsEnabled: enabled });

    if (enabled) {
      // Request permission and get token
      const token = await registerForPushNotifications();
      if (token) {
        try {
          await authApi.updatePushToken(token);
        } catch (error) {
          console.error('Failed to update push token:', error);
        }
      }
    } else {
      // Clear token from backend
      try {
        await authApi.updatePushToken('');
      } catch (error) {
        console.error('Failed to clear push token:', error);
      }
    }

    // Save to AsyncStorage
    await get().saveSettings();
  },

  resetSettings: async () => {
    await AsyncStorage.removeItem(SETTINGS_KEY);
    set({ pushNotificationsEnabled: true });
  },
}));

export default useSettingsStore;
