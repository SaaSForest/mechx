import React, { useCallback, useEffect, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/config/theme';
import {
  registerForPushNotifications,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  removeNotificationSubscription,
} from './src/services/notifications';
import useAuthStore from './src/store/authStore';
import useSettingsStore from './src/store/settingsStore';
import * as authApi from './src/api/auth';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const isLoggedIn = useAuthStore((state) => !!state.token);
  const { pushNotificationsEnabled, loadSettings } = useSettingsStore();

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          'DMSans-Regular': require('./assets/fonts/DMSans-Regular.ttf'),
          'DMSans-Medium': require('./assets/fonts/DMSans-Medium.ttf'),
          'DMSans-SemiBold': require('./assets/fonts/DMSans-SemiBold.ttf'),
          'DMSans-Bold': require('./assets/fonts/DMSans-Bold.ttf'),
        });

        // Load settings
        await loadSettings();
      } catch (e) {
        console.warn('Error loading fonts:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Setup push notifications when logged in
  useEffect(() => {
    if (!isLoggedIn || !pushNotificationsEnabled) return;

    // Register for push notifications
    registerForPushNotifications().then(async (token) => {
      if (token) {
        try {
          await authApi.updatePushToken(token);
        } catch (error) {
          console.error('Failed to update push token:', error);
        }
      }
    });

    // Handle notification received while app is foregrounded
    notificationListener.current = addNotificationReceivedListener((notification) => {
      // Can refresh notification count or update UI here
      console.log('Notification received:', notification);
    });

    // Handle notification tap (when user clicks on notification)
    responseListener.current = addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      // Handle navigation based on notification type
      console.log('Notification tapped:', data);
      // Navigation can be handled via a navigation ref if needed
    });

    return () => {
      if (notificationListener.current) {
        removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        removeNotificationSubscription(responseListener.current);
      }
    };
  }, [isLoggedIn, pushNotificationsEnabled]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
