import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChatCircleDots,
  Bell,
  MagnifyingGlass,
  Tag,
  Money,
  TrendUp,
  Lightning,
  Package,
  CaretRight,
  Clock,
} from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';
import { Card, Badge, Avatar } from '../../components/ui';
import { EmptyState } from '../../components/shared';
import useAuthStore from '../../store/authStore';
import { formatRelativeTime } from '../../utils/date';
import useOfferStore from '../../store/offerStore';
import useRequestStore from '../../store/requestStore';
import useNotificationStore from '../../store/notificationStore';
import useChatStore from '../../store/chatStore';
import useDashboardStore from '../../store/dashboardStore';

const SellerHomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { myOffers, fetchMyOffers } = useOfferStore();
  const { browseRequests, fetchBrowseRequests } = useRequestStore();
  const { unreadCount: unreadNotifications, fetchUnreadCount } = useNotificationStore();
  const { conversations } = useChatStore();
  const { sellerStats, sellerRevenue, fetchSellerDashboard } = useDashboardStore();

  useEffect(() => {
    fetchMyOffers();
    fetchBrowseRequests();
    fetchUnreadCount();
    fetchSellerDashboard();
  }, []);

  // Real stats from dashboard API
  const stats = {
    totalOffers: sellerStats?.sent_offers || 0,
    pendingOffers: sellerStats?.pending_offers || 0,
    acceptedOffers: sellerStats?.accepted_offers || 0,
    revenue: sellerRevenue || 0,
    newRequests: sellerStats?.new_requests || 0,
  };

  // Calculate unread messages from conversations
  const unreadMessages = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);

  // Use real browse requests (limit to 3 for display)
  const newRequests = browseRequests.slice(0, 3).map(req => ({
    id: req.id,
    part_name: req.part_name,
    car: `${req.car_make} ${req.car_model} ${req.car_year}`,
    budget: req.budget_range || `L${req.budget_min || 0}-L${req.budget_max || 0}`,
    urgency: req.urgency || 'Standard',
    time: req.created_at,
  }));

  // Use real offers (limit to 3 for display)
  const recentOffers = myOffers.slice(0, 3).map(offer => ({
    id: offer.id,
    part_name: offer.part_name || offer.part_request?.part_name,
    buyer: offer.buyer_name || offer.part_request?.user?.full_name,
    price: offer.price,
    status: offer.status,
  }));

  const renderRequestItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('SubmitOffer', { request: item })}
      style={styles.requestCard}
    >
      <Card padding={16}>
        <View style={styles.requestHeader}>
          <View style={styles.requestInfo}>
            <Text style={styles.requestTitle} numberOfLines={1}>
              {item.part_name}
            </Text>
            <Text style={styles.requestSubtitle}>{item.car}</Text>
          </View>
          <Badge
            text={item.urgency}
            status={item.urgency === 'Urgent' ? 'pending' : 'active'}
            size="small"
          />
        </View>
        <View style={styles.requestFooter}>
          <Text style={styles.budgetText}>{item.budget}</Text>
          <View style={styles.timeContainer}>
            <Clock size={14} color={colors.gray[400]} />
            <Text style={styles.timeText}>{formatRelativeTime(item.time)}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderOfferItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('MyOffers')}
      style={styles.offerItem}
    >
      <View style={styles.offerInfo}>
        <Text style={styles.offerTitle}>{item.part_name}</Text>
        <Text style={styles.offerSubtitle}>to {item.buyer}</Text>
      </View>
      <View style={styles.offerMeta}>
        <Text style={styles.offerPrice}>L {item.price}</Text>
        <Badge text={item.status} status={item.status === 'accepted' ? 'completed' : item.status === 'rejected' ? 'cancelled' : 'pending'} size="small" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[colors.dark[800], colors.dark[900]]}
          style={[styles.header, { paddingTop: insets.top + 16 }]}
        >
          <View style={styles.decorative} />

          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.userName} numberOfLines={1}>{user?.full_name || 'Auto Parts Pro'}</Text>
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
              Search requests, parts...
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <Card padding={16} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: colors.brand[50] }]}>
                <Tag size={22} weight="fill" color={colors.brand[500]} />
              </View>
              <Text style={styles.statValue}>{stats.totalOffers}</Text>
              <Text style={styles.statLabel}>Total Offers</Text>
            </Card>
            <Card padding={16} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: colors.success + '15' }]}>
                <Money size={22} weight="fill" color={colors.success} />
              </View>
              <Text style={styles.statValue}>L {stats.revenue >= 1000 ? (stats.revenue / 1000).toFixed(1) + 'k' : stats.revenue}</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </Card>
            <Card padding={16} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#EFF6FF' }]}>
                <TrendUp size={22} weight="fill" color="#2563EB" />
              </View>
              <Text style={[styles.statValue, { color: colors.success }]}>{stats.acceptedOffers}</Text>
              <Text style={styles.statLabel}>Accepted</Text>
            </Card>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Browse')}
            style={styles.quickActionPrimary}
          >
            <LinearGradient
              colors={[colors.brand[500], colors.brand[600]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quickActionGradient}
            >
              <View style={styles.quickActionIcon}>
                <Lightning size={24} weight="fill" color={colors.white} />
              </View>
              <Text style={styles.quickActionTitle}>Browse Requests</Text>
              <Text style={styles.quickActionSubtitle}>Find opportunities</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('MyOffers')}
            style={styles.quickActionSecondary}
          >
            <LinearGradient
              colors={[colors.dark[700], colors.dark[800]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quickActionGradient}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                <Package size={24} weight="fill" color={colors.white} />
              </View>
              <Text style={styles.quickActionTitle}>My Offers</Text>
              <Text style={[styles.quickActionSubtitle, { color: 'rgba(255,255,255,0.6)' }]}>
                Track your offers
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* New Requests Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Requests</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Browse')}
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <CaretRight size={16} color={colors.brand[500]} />
            </TouchableOpacity>
          </View>
          {newRequests.length > 0 ? (
            <FlatList
              data={newRequests}
              renderItem={renderRequestItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.requestsListContent}
            />
          ) : (
            <View style={styles.emptySection}>
              <Text style={styles.emptySectionText}>No new requests available</Text>
            </View>
          )}
        </View>

        {/* Recent Offers Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Offers</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('MyOffers')}
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <CaretRight size={16} color={colors.brand[500]} />
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContent}>
            {recentOffers.length > 0 ? (
              <Card padding={0}>
                <FlatList
                  data={recentOffers}
                  renderItem={renderOfferItem}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
              </Card>
            ) : (
              <Card padding={16}>
                <Text style={styles.emptySectionText}>No offers yet. Browse requests to submit your first offer!</Text>
              </Card>
            )}
          </View>
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
  welcomeContainer: {
    flex: 1,
    marginRight: 12,
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
    alignItems: 'center',
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
    flex: 1,
    padding: 20,
    borderRadius: 16,
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
  sectionContent: {
    paddingHorizontal: 24,
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
  requestsListContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  requestCard: {
    width: 280,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  requestInfo: {
    flex: 1,
    marginRight: 12,
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
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.brand[500],
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.gray[400],
  },
  offerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  offerInfo: {
    flex: 1,
  },
  offerTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 15,
    color: colors.gray[900],
  },
  offerSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.gray[500],
    marginTop: 2,
  },
  offerMeta: {
    alignItems: 'flex-end',
    gap: 6,
  },
  offerPrice: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.gray[900],
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray[100],
    marginHorizontal: 16,
  },
  emptySection: {
    marginHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptySectionText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
  },
});

export default SellerHomeScreen;
