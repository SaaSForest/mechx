import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChatCircleDots,
  Bell,
  MagnifyingGlass,
  ClipboardText,
  Tag,
  CheckCircle,
  Wrench,
  Car,
  GearSix,
  CaretRight,
  Star,
} from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';
import { Card, Badge, Avatar } from '../../components/ui';
import useAuthStore from '../../store/authStore';
import useRequestStore from '../../store/requestStore';
import useCarStore from '../../store/carStore';
import useNotificationStore from '../../store/notificationStore';
import useChatStore from '../../store/chatStore';

const BuyerHomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { requests, fetchMyRequests } = useRequestStore();
  const { cars, fetchCars } = useCarStore();
  const { unreadCount: unreadNotifications, fetchUnreadCount } = useNotificationStore();
  const { conversations } = useChatStore();

  useEffect(() => {
    fetchMyRequests();
    fetchCars();
    fetchUnreadCount();
  }, []);

  // Stats from real data
  const stats = {
    requests: requests.length,
    offers: requests.reduce((acc, r) => acc + (r.offers_count || 0), 0),
    completed: requests.filter(r => r.status === 'completed').length,
  };

  // Calculate unread messages from conversations
  const unreadMessages = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);

  const renderRequestItem = (request) => (
    <TouchableOpacity
      key={request.id}
      onPress={() => navigation.navigate('RequestDetail', { request })}
      style={styles.requestCard}
    >
      <Card padding={16}>
        <View style={styles.requestContent}>
          <View style={styles.requestIcon}>
            <GearSix size={24} weight="fill" color={colors.gray[400]} />
          </View>
          <View style={styles.requestInfo}>
            <Text style={styles.requestTitle} numberOfLines={1}>
              {request.part_name}
            </Text>
            <Text style={styles.requestSubtitle}>
              {request.car_make} {request.car_model} {request.car_year}
            </Text>
          </View>
          <View style={styles.requestMeta}>
            <Badge
              text={request.status}
              status={request.status}
              size="small"
            />
            <Text style={styles.offersCount}>
              {request.offers_count || 0} offers
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderCarItem = ({ item: car }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('CarDetail', { car })}
      style={styles.carCard}
    >
      <View style={styles.carImageContainer}>
        {car.photos?.[0]?.url ? (
          <Image
            source={{ uri: car.photos[0].url }}
            style={styles.carImage}
          />
        ) : (
          <View style={[styles.carImage, styles.carImagePlaceholder]}>
            <Car size={32} color={colors.gray[400]} />
          </View>
        )}
        {car.is_featured && (
          <View style={styles.featuredBadge}>
            <Star size={12} weight="fill" color={colors.white} />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
      </View>
      <View style={styles.carInfo}>
        <Text style={styles.carTitle} numberOfLines={1}>
          {car.make} {car.model}
        </Text>
        <View style={styles.carMeta}>
          <Text style={styles.carMetaText}>{car.year}</Text>
          <Text style={styles.carMetaDot}>•</Text>
          <Text style={styles.carMetaText}>{car.mileage}</Text>
        </View>
        <Text style={styles.carPrice}>
          L{(car.price || 0).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Use real data from store
  const recentRequests = requests.slice(0, 3);
  const featuredCars = cars.slice(0, 5);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[colors.dark[800], colors.dark[900]]}
          style={[styles.header, { paddingTop: insets.top + 16 }]}
        >
          <View style={styles.decorative} />
          <View style={styles.decorativeBottom} />

          {/* Top Bar */}
          <View style={styles.topBar}>
            <View>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.userName}>{user?.full_name}</Text>
            </View>
            <View style={styles.topBarActions}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Messages')}
                style={styles.iconButton}
              >
                <ChatCircleDots size={22} color={colors.white} />
                {unreadMessages > 0 && (
                  <View style={[styles.badge, styles.badgeGreen]}>
                    <Text style={styles.badgeText}>{unreadMessages}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Notifications')}
                style={styles.iconButton}
              >
                <Bell size={22} color={colors.white} />
                {unreadNotifications > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadNotifications}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
                style={styles.profileButton}
              >
                <Avatar
                  source={user?.profile_photo}
                  name={user?.full_name}
                  size={44}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Search')}
            style={styles.searchBar}
          >
            <MagnifyingGlass size={20} color={colors.gray[400]} />
            <Text style={styles.searchPlaceholder}>
              Search parts, cars, sellers...
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: colors.brand[50] }]}>
                <ClipboardText size={22} weight="fill" color={colors.brand[500]} />
              </View>
              <Text style={styles.statValue}>{stats.requests}</Text>
              <Text style={styles.statLabel}>Requests</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: colors.success + '15' }]}>
                <Tag size={22} weight="fill" color={colors.success} />
              </View>
              <Text style={styles.statValue}>{stats.offers}</Text>
              <Text style={styles.statLabel}>Offers</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#EFF6FF' }]}>
                <CheckCircle size={22} weight="fill" color="#2563EB" />
              </View>
              <Text style={styles.statValue}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Create')}
            style={styles.quickActionPrimary}
          >
            <LinearGradient
              colors={[colors.brand[500], colors.brand[600]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quickActionGradient}
            >
              <View style={styles.quickActionIcon}>
                <Wrench size={24} weight="fill" color={colors.white} />
              </View>
              <Text style={styles.quickActionTitle}>Request Part</Text>
              <Text style={styles.quickActionSubtitle}>Find the part you need</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('SellCar')}
            style={styles.quickActionSecondary}
          >
            <LinearGradient
              colors={[colors.dark[700], colors.dark[800]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quickActionGradient}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                <Car size={24} weight="fill" color={colors.white} />
              </View>
              <Text style={styles.quickActionTitle}>Sell Car</Text>
              <Text style={[styles.quickActionSubtitle, { color: 'rgba(255,255,255,0.6)' }]}>
                List your vehicle
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* My Requests Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Requests</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('MyRequests')}
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <CaretRight size={16} color={colors.brand[500]} />
            </TouchableOpacity>
          </View>
          <View style={styles.requestsList}>
            {recentRequests.length > 0 ? (
              recentRequests.map(renderRequestItem)
            ) : (
              <Card padding={20}>
                <Text style={styles.emptyText}>No requests yet. Create your first request!</Text>
              </Card>
            )}
          </View>
        </View>

        {/* Cars for Sale Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cars for Sale</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('CarList')}
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <CaretRight size={16} color={colors.brand[500]} />
            </TouchableOpacity>
          </View>
          {featuredCars.length > 0 ? (
            <FlatList
              data={featuredCars}
              renderItem={renderCarItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carsListContent}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No cars listed yet</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 128,
    position: 'relative',
    overflow: 'hidden',
  },
  decorative: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 224,
    height: 224,
    borderRadius: 999,
    backgroundColor: colors.brand[500],
    opacity: 0.15,
    transform: [{ translateX: 60 }, { translateY: -60 }],
  },
  decorativeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 128,
    height: 128,
    borderRadius: 999,
    backgroundColor: colors.brand[500],
    opacity: 0.1,
    transform: [{ translateX: -40 }, { translateY: 40 }],
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  welcomeText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[400],
  },
  userName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 24,
    color: colors.white,
    marginTop: 2,
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.brand[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeGreen: {
    backgroundColor: colors.success,
  },
  badgeText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 11,
    color: colors.white,
  },
  profileButton: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  searchPlaceholder: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.gray[400],
    marginLeft: 12,
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginTop: -80,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.brand[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 24,
    color: colors.gray[900],
  },
  statLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.gray[500],
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 24,
    gap: 12,
  },
  quickActionPrimary: {
    flex: 1,
  },
  quickActionSecondary: {
    flex: 1,
  },
  quickActionGradient: {
    padding: 20,
    borderRadius: 16,
    minHeight: 160,
    shadowColor: colors.brand[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 18,
    color: colors.white,
  },
  quickActionSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    color: colors.gray[900],
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.brand[500],
    marginRight: 4,
  },
  requestsList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  requestCard: {
    marginBottom: 0,
  },
  requestContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  requestInfo: {
    flex: 1,
  },
  requestTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.gray[900],
  },
  requestSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 2,
  },
  requestMeta: {
    alignItems: 'flex-end',
  },
  offersCount: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.gray[400],
    marginTop: 6,
  },
  carsListContent: {
    paddingHorizontal: 24,
    gap: 16,
  },
  carCard: {
    width: 240,
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.dark[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  carImageContainer: {
    height: 144,
    backgroundColor: colors.gray[100],
    position: 'relative',
  },
  carImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brand[500],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: colors.dark[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  featuredText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.white,
    marginLeft: 4,
  },
  carInfo: {
    padding: 16,
  },
  carTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.gray[900],
  },
  carMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  carMetaText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[500],
  },
  carMetaDot: {
    color: colors.gray[400],
    marginHorizontal: 8,
  },
  carPrice: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    color: colors.brand[500],
    marginTop: 8,
  },
  carImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray[100],
  },
  emptyContainer: {
    paddingHorizontal: 24,
  },
  emptyText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
  },
});

export default BuyerHomeScreen;
