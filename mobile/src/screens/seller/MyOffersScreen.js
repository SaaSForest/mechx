import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  // ArrowLeft,
  CaretLeft,
  Clock,
  CaretRight,
  Package,
} from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';
import { Card, Badge, Avatar } from '../../components/ui';
import { EmptyState } from '../../components/shared';
import useOfferStore from '../../store/offerStore';
import { formatRelativeTime } from '../../utils/date';

const FILTERS = ['all', 'pending', 'accepted', 'rejected'];

const MyOffersScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { myOffers, fetchMyOffers, isLoading } = useOfferStore();
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMyOffers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMyOffers();
    setRefreshing(false);
  };

  // Use real data from store
  const filteredOffers =
    filter === 'all'
      ? myOffers
      : myOffers.filter((o) => o.status === filter);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted':
        return 'completed';
      case 'rejected':
        return 'cancelled';
      case 'pending':
      default:
        return 'pending';
    }
  };

  const renderFilterButton = (filterKey) => (
    <TouchableOpacity
      key={filterKey}
      onPress={() => setFilter(filterKey)}
      style={[
        styles.filterButton,
        filter === filterKey && styles.filterButtonActive,
      ]}
    >
      <Text
        style={[
          styles.filterButtonText,
          filter === filterKey && styles.filterButtonTextActive,
        ]}
      >
        {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
        {filterKey === 'all' && ` (${myOffers.length})`}
      </Text>
    </TouchableOpacity>
  );

  const renderOfferItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('RequestDetail', { request: item.part_request })}
      style={styles.offerCard}
    >
      <Card padding={20}>
        <View style={styles.offerHeader}>
          <View style={styles.buyerInfo}>
            <Avatar
              source={item.part_request?.user?.profile_photo_url}
              name={item.part_request?.user?.full_name || 'Unknown'}
              size={48}
            />
            <View style={styles.buyerDetails}>
              <Text style={styles.buyerName}>{item.part_request?.user?.full_name || 'Unknown Buyer'}</Text>
              <Text style={styles.partName}>{item.part_request?.part_name || 'Part Request'}</Text>
            </View>
          </View>
          <View style={styles.offerMeta}>
            <Text style={styles.offerPrice}>L {item.price}</Text>
            <Badge
              text={item.status}
              status={getStatusStyle(item.status)}
              size="small"
            />
          </View>
        </View>

        <View style={styles.offerFooter}>
          <View style={styles.offerDetails}>
            <Text style={styles.carInfo}>{item.part_request ? `${item.part_request.car_year} ${item.part_request.car_make} ${item.part_request.car_model}` : ''}</Text>
            <View style={styles.timeRow}>
              <Clock size={14} color={colors.gray[400]} />
              <Text style={styles.timeText}>{formatRelativeTime(item.created_at)}</Text>
            </View>
          </View>
          <CaretRight size={20} color={colors.gray[400]} />
        </View>
      </Card>
    </TouchableOpacity>
  );

  // Stats summary
  const stats = {
    pending: myOffers.filter((o) => o.status === 'pending').length,
    accepted: myOffers.filter((o) => o.status === 'accepted').length,
    rejected: myOffers.filter((o) => o.status === 'rejected').length,
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          {/* <ArrowLeft size={24} color={colors.gray[600]} /> */}
           <CaretLeft size={24} weight="bold" color={colors.gray[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Offers</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.success }]}>
            {stats.accepted}
          </Text>
          <Text style={styles.statLabel}>Accepted</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.error }]}>
            {stats.rejected}
          </Text>
          <Text style={styles.statLabel}>Rejected</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={FILTERS}
          renderItem={({ item }) => renderFilterButton(item)}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Offers List */}
      <FlatList
        data={filteredOffers}
        renderItem={renderOfferItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.brand[500]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon={<Package size={40} color={colors.gray[400]} />}
            title="No offers found"
            description="Start browsing requests to submit your first offer"
            actionTitle="Browse Requests"
            onAction={() => navigation.navigate('Browse')}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    color: colors.gray[900],
  },
  headerSpacer: {
    width: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 24,
    color: colors.gray[900],
  },
  statLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.gray[500],
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.gray[200],
  },
  filtersContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
    paddingVertical: 12,
  },
  filtersList: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: colors.brand[500],
  },
  filterButtonText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.gray[600],
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  listContent: {
    padding: 24,
    paddingBottom: 100,
  },
  offerCard: {
    marginBottom: 16,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  buyerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  buyerDetails: {
    marginLeft: 12,
    flex: 1,
  },
  buyerName: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.gray[500],
  },
  partName: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.gray[900],
    marginTop: 2,
  },
  offerMeta: {
    alignItems: 'flex-end',
    gap: 6,
  },
  offerPrice: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 20,
    color: colors.brand[500],
  },
  offerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  offerDetails: {
    flex: 1,
  },
  carInfo: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.gray[400],
  },
});

export default MyOffersScreen;
