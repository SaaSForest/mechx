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
  ArrowLeft,
  Plus,
  Tag,
  Clock,
  CaretRight,
  ClipboardText,
} from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';
import { Card, Badge } from '../../components/ui';
import { EmptyState } from '../../components/shared';
import useRequestStore from '../../store/requestStore';
import { formatRelativeTime } from '../../utils/date';

const FILTERS = ['all', 'active', 'pending', 'completed'];

const MyRequestsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { requests, fetchMyRequests, isLoading } = useRequestStore();
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMyRequests();
    setRefreshing(false);
  };

  // Use real data from store
  const filteredRequests =
    filter === 'all'
      ? requests
      : requests.filter((r) => r.status === filter);

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
        {filterKey === 'all' && ` (${requests.length})`}
      </Text>
    </TouchableOpacity>
  );

  const renderRequestItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('RequestDetail', { request: item })}
      style={[styles.requestCard, { animationDelay: index * 50 }]}
    >
      <Card padding={20}>
        <View style={styles.requestHeader}>
          <View style={styles.requestInfo}>
            <Text style={styles.requestTitle} numberOfLines={1}>
              {item.part_name}
            </Text>
            <Text style={styles.requestSubtitle}>
              {item.car_make} {item.car_model} {item.car_year}
            </Text>
          </View>
          <Badge text={item.status} status={item.status} />
        </View>

        <View style={styles.requestFooter}>
          <View style={styles.requestMeta}>
            <View style={styles.metaItem}>
              <Tag size={16} color={colors.gray[400]} />
              <Text style={styles.metaText}>{item.offers_count} offers</Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={16} color={colors.gray[400]} />
              <Text style={styles.metaText}>{formatRelativeTime(item.created_at)}</Text>
            </View>
          </View>
          <CaretRight size={20} color={colors.gray[400]} />
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.gray[600]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Requests</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Create')}
          style={styles.addButton}
        >
          <Plus size={20} color={colors.white} />
        </TouchableOpacity>
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

      {/* Requests List */}
      <FlatList
        data={filteredRequests}
        renderItem={renderRequestItem}
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
            icon={<ClipboardText size={40} color={colors.gray[400]} />}
            title="No requests found"
            description="Try changing the filter or create a new request"
            actionTitle="Create Request"
            onAction={() => navigation.navigate('Create')}
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.brand[500],
    alignItems: 'center',
    justifyContent: 'center',
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
  requestCard: {
    marginBottom: 16,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  requestInfo: {
    flex: 1,
    marginRight: 12,
  },
  requestTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.gray[900],
    marginBottom: 4,
  },
  requestSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[500],
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  requestMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[500],
  },
});

export default MyRequestsScreen;
