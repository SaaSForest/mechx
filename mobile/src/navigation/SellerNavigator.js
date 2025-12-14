import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { House, MagnifyingGlass, ListPlus, ChatCircleDots, User } from 'phosphor-react-native';

import { colors, typography } from '../config/theme';

// Screens
import SellerHomeScreen from '../screens/seller/SellerHomeScreen';
import BrowseRequestsScreen from '../screens/seller/BrowseRequestsScreen';
import SubmitOfferScreen from '../screens/seller/SubmitOfferScreen';
import MyOffersScreen from '../screens/seller/MyOffersScreen';
import SearchScreen from '../screens/common/SearchScreen';
import ConversationsScreen from '../screens/messaging/ConversationsScreen';
import ChatScreen from '../screens/messaging/ChatScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import NotificationsScreen from '../screens/common/NotificationsScreen';
import SettingsScreen from '../screens/common/SettingsScreen';
import SavedItemsScreen from '../screens/common/SavedItemsScreen';
import CarListScreen from '../screens/cars/CarListScreen';
import CarDetailScreen from '../screens/cars/CarDetailScreen';
import SellCarScreen from '../screens/cars/SellCarScreen';
import RequestDetailScreen from '../screens/buyer/RequestDetailScreen';
import SellerReviewsScreen from '../screens/common/SellerReviewsScreen';

import useChatStore from '../store/chatStore';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Stack navigators for each tab
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SellerHome" component={SellerHomeScreen} />
    <Stack.Screen name="MyOffers" component={MyOffersScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="CarList" component={CarListScreen} />
    <Stack.Screen name="CarDetail" component={CarDetailScreen} />
    <Stack.Screen name="SellCar" component={SellCarScreen} />
    <Stack.Screen name="RequestDetail" component={RequestDetailScreen} />
    <Stack.Screen name="SellerReviews" component={SellerReviewsScreen} />
  </Stack.Navigator>
);

const SearchStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SearchMain" component={SearchScreen} />
    <Stack.Screen name="CarDetail" component={CarDetailScreen} />
    <Stack.Screen name="RequestDetail" component={RequestDetailScreen} />
  </Stack.Navigator>
);

const BrowseStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BrowseRequests" component={BrowseRequestsScreen} />
    <Stack.Screen name="SubmitOffer" component={SubmitOfferScreen} />
    <Stack.Screen name="RequestDetail" component={RequestDetailScreen} />
  </Stack.Navigator>
);

const ChatStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Conversations" component={ConversationsScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen name="MyOffers" component={MyOffersScreen} />
    <Stack.Screen name="SellCar" component={SellCarScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="SavedItems" component={SavedItemsScreen} />
    <Stack.Screen name="CarList" component={CarListScreen} />
    <Stack.Screen name="CarDetail" component={CarDetailScreen} />
    <Stack.Screen name="RequestDetail" component={RequestDetailScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

const TabBarIcon = ({ focused, IconComponent }) => (
  <IconComponent
    size={24}
    weight={focused ? 'fill' : 'regular'}
    color={focused ? colors.brand[500] : colors.gray[400]}
  />
);

const SellerNavigator = () => {
  const unreadCount = useChatStore((state) => state.unreadCount);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: colors.brand[500],
        tabBarInactiveTintColor: colors.gray[400],
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} IconComponent={House} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} IconComponent={MagnifyingGlass} />
          ),
        }}
      />
      <Tab.Screen
        name="Browse"
        component={BrowseStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.browseButton}>
              <ListPlus size={24} weight="bold" color={colors.white} />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={ChatStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <TabBarIcon focused={focused} IconComponent={ChatCircleDots} />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} IconComponent={User} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    height: 80,
    paddingTop: 8,
    paddingBottom: 24,
  },
  tabBarLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 11,
    marginTop: 4,
  },
  browseButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.brand[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    shadowColor: colors.brand[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.brand[500],
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
  },
});

export default SellerNavigator;
