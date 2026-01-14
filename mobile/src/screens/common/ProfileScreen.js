import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { StatusBar as RNStatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  User,
  Gear,
  ClipboardText,
  Tag,
  Car,
  Heart,
  Bell,
  Shield,
  Question,
  SignOut,
  CaretRight,
  PencilSimple,
  SealCheck,
  Star,
} from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';
import { Avatar, Card } from '../../components/ui';
import useAuthStore from '../../store/authStore';
import useOfferStore from '../../store/offerStore';
import useCarStore from '../../store/carStore';
import useRequestStore from '../../store/requestStore';
import useSavedItemsStore from '../../store/savedItemsStore';

const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const { myOffers, fetchMyOffers } = useOfferStore();
  const { cars, fetchCars } = useCarStore();
  const { myRequests, fetchMyRequests } = useRequestStore();
  const { savedCars, savedRequests, fetchSavedItems } = useSavedItemsStore();
  const isSeller = user?.user_type === 'seller';

  // Fetch data on mount
  useEffect(() => {
    if (isSeller) {
      fetchMyOffers();
      fetchCars();
    } else {
      fetchMyRequests();
    }
    fetchSavedItems();
  }, [isSeller]);

  useFocusEffect(
    React.useCallback(() => {
      RNStatusBar.setBarStyle('dark-content', true);
      if (Platform.OS === 'android') {
        RNStatusBar.setBackgroundColor(colors.white, true);
      }
    }, [])
  );
  // Calculate dynamic counts (with safe defaults)
  const myListingsCount = (cars || []).filter(car => car.user_id === user?.id).length;
  const myOffersCount = (myOffers || []).length;
  const myRequestsCount = (myRequests || []).length;
  const savedItemsCount = (savedCars || []).length + (savedRequests || []).length;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const menuItems = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Edit Profile', onPress: () => { } },
        { icon: Gear, label: 'Settings', onPress: () => navigation.navigate('Settings') },
      ],
    },
    {
      title: 'Activity',
      items: isSeller
        ? [
          { icon: Tag, label: 'My Offers', badge: myOffersCount > 0 ? String(myOffersCount) : null, onPress: () => navigation.navigate('MyOffers') },
          { icon: Car, label: 'My Listings', badge: myListingsCount > 0 ? String(myListingsCount) : null, onPress: () => navigation.navigate('CarList', { myListingsOnly: true }) },
          { icon: Star, label: 'My Reviews', onPress: () => navigation.navigate('SellerReviews', { seller: user }) },
          { icon: Heart, label: 'Saved Items', badge: savedItemsCount > 0 ? String(savedItemsCount) : null, onPress: () => navigation.navigate('SavedItems') },
        ]
        : [
          { icon: ClipboardText, label: 'My Requests', badge: myRequestsCount > 0 ? String(myRequestsCount) : null, onPress: () => navigation.navigate('MyRequests') },
          { icon: Heart, label: 'Saved Items', badge: savedItemsCount > 0 ? String(savedItemsCount) : null, onPress: () => navigation.navigate('SavedItems') },
        ],
    },
    {
      title: 'Support',
      items: [
        { icon: Question, label: 'Help Center', onPress: () => { } },
        { icon: Shield, label: 'Privacy Policy', onPress: () => { } },
      ],
    },
  ];

  const renderMenuItem = (item, index) => (
    <TouchableOpacity
      key={index}
      onPress={item.onPress}
      style={styles.menuItem}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuItemIcon}>
          <item.icon size={22} color={colors.gray[600]} />
        </View>
        <Text style={styles.menuItemLabel}>{item.label}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
        <CaretRight size={20} color={colors.gray[400]} />
      </View>
    </TouchableOpacity>
  );

  // Use real user data from store
  const stats = isSeller
    ? { offers: user?.offers_count || myOffersCount, sales: user?.sales_count || 0, rating: user?.rating || 0 }
    : { requests: user?.requests_count || myRequestsCount, saved: savedItemsCount, completed: user?.completed_count || 0 };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[colors.dark[800], colors.dark[900]]}
          style={styles.header}
        >
          <View style={styles.decorative} />

          {/* Profile Info */}
          <View style={styles.profileContainer}>
            <View style={styles.avatarContainer}>
              <Avatar
                source={user.profile_photo}
                name={user.full_name}
                size={88}
              />
              <TouchableOpacity style={styles.editAvatarButton}>
                <PencilSimple size={16} color={colors.white} weight="bold" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{user.full_name}</Text>
                {isSeller && (
                  <SealCheck size={22} weight="fill" color={colors.success} />
                )}
              </View>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={styles.typeTag}>
                <Text style={styles.typeTagText}>
                  {isSeller ? 'Seller Account' : 'Buyer Account'}
                </Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            {isSeller ? (
              <>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.offers}</Text>
                  <Text style={styles.statLabel}>Offers</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.sales}</Text>
                  <Text style={styles.statLabel}>Sales</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <View style={styles.ratingValue}>
                    <Star size={18} weight="fill" color="#F59E0B" />
                    <Text style={styles.statValue}>{stats.rating}</Text>
                  </View>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.requests}</Text>
                  <Text style={styles.statLabel}>Requests</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.saved}</Text>
                  <Text style={styles.statLabel}>Saved</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.completed}</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
              </>
            )}
          </View>
        </LinearGradient>

        {/* Menu Sections */}
        <View style={styles.menuContainer}>
          {menuItems.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.menuSection}>
              <Text style={styles.menuSectionTitle}>{section.title}</Text>
              <Card padding={0}>
                {section.items.map(renderMenuItem)}
              </Card>
            </View>
          ))}

          {/* Logout Button */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <SignOut size={22} color={colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* App Version */}
          <Text style={styles.versionText}>mechX v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  decorative: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: colors.brand[500],
    opacity: 0.1,
    transform: [{ translateX: 60 }, { translateY: -60 }],
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.brand[500],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.dark[800],
  },
  profileInfo: {
    flex: 1,
    marginLeft: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 22,
    color: colors.white,
  },
  userEmail: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[400],
    marginTop: 4,
  },
  typeTag: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  typeTagText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.gray[300],
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 22,
    color: colors.white,
  },
  ratingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.gray[400],
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  menuContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuSectionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[50],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuItemLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 16,
    color: colors.gray[900],
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: colors.brand[500],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 12,
    color: colors.white,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 8,
    gap: 8,
  },
  logoutText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.error,
  },
  versionText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.gray[400],
    textAlign: 'center',
    marginTop: 16,
  },
});

export default ProfileScreen;
