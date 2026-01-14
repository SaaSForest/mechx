import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  // ArrowLeft,
  CaretLeft,
  Funnel,
  Clock,
  MapPin,
  CaretRight,
  ClipboardText,
  X,
  Lightning,
  Hourglass,
  CheckCircle,
  Sparkle,
  Recycle,
} from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';
import { Card, Badge, Avatar } from '../../components/ui';
import { EmptyState } from '../../components/shared';
import useRequestStore from '../../store/requestStore';
import { formatRelativeTime } from '../../utils/date';

const QUICK_FILTERS = ['all', 'urgent', 'new', 'german', 'japanese'];

const BrowseRequestsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { browseRequests, fetchBrowseRequests, isLoading } = useRequestStore();
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    urgency: null,
    condition: null,
  });

  useEffect(() => {
    fetchBrowseRequests();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBrowseRequests();
    setRefreshing(false);
  };

  // Use real data from store with filtering
  const filteredRequests = useMemo(() => {
    let results = browseRequests;

    // Quick filters
    if (filter !== 'all') {
      results = results.filter((r) => {
        if (filter === 'urgent') return r.urgency === 'urgent';
        if (filter === 'new') return r.condition_preference === 'new';
        if (filter === 'german') return ['BMW', 'Mercedes', 'Audi', 'Porsche', 'Volkswagen'].includes(r.car_make);
        if (filter === 'japanese') return ['Toyota', 'Honda', 'Nissan', 'Mazda'].includes(r.car_make);
        return true;
      });
    }

    // Advanced filters
    if (advancedFilters.urgency) {
      results = results.filter((r) => r.urgency === advancedFilters.urgency);
    }
    if (advancedFilters.condition) {
      results = results.filter((r) => r.condition_preference === advancedFilters.condition);
    }

    return results;
  }, [browseRequests, filter, advancedFilters]);

  const hasActiveFilters = advancedFilters.urgency || advancedFilters.condition;

  const resetFilters = () => {
    setAdvancedFilters({ urgency: null, condition: null });
    setFilter('all');
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
      </Text>
    </TouchableOpacity>
  );

  const renderRequestItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('SubmitOffer', { request: item })}
      style={styles.requestCard}
    >
      <Card padding={20}>
        {/* Header */}
        <View style={styles.requestHeader}>
          <View style={styles.buyerInfo}>
            <Avatar
              source={item.user?.profile_photo_url}
              name={item.user?.full_name}
              size={44}
            />
            <View style={styles.buyerDetails}>
              <Text style={styles.buyerName}>{item.user?.full_name || 'Unknown'}</Text>
              <View style={styles.locationRow}>
                <MapPin size={14} color={colors.gray[400]} />
                <Text style={styles.locationText}>{item.location || item.user?.location || 'Not specified'}</Text>
              </View>
            </View>
          </View>
          <Badge
            text={item.urgency || 'standard'}
            status={item.urgency === 'urgent' ? 'pending' : item.urgency === 'flexible' ? 'completed' : 'active'}
            size="small"
          />
        </View>

        {/* Content */}
        <View style={styles.requestContent}>
          <Text style={styles.partName}>{item.part_name}</Text>
          <Text style={styles.carInfo}>
            {item.car_make} {item.car_model} {item.car_year}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.requestFooter}>
          <View style={styles.footerLeft}>
            <Text style={styles.budgetLabel}>Budget</Text>
            <Text style={styles.budgetValue}>{item.budget || 'Not specified'}</Text>
          </View>
          <View style={styles.footerRight}>
            <View style={styles.timeRow}>
              <Clock size={14} color={colors.gray[400]} />
              <Text style={styles.timeText}>{formatRelativeTime(item.created_at)}</Text>
            </View>
            <View style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Submit Offer</Text>
              <CaretRight size={16} color={colors.brand[500]} />
            </View>
          </View>
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
          {/* <ArrowLeft size={24} color={colors.gray[600]} /> */}
         <CaretLeft size={24} weight="bold" color={colors.gray[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Browse Requests</Text>
        <TouchableOpacity
          style={[styles.filterIcon, hasActiveFilters && styles.filterIconActive]}
          onPress={() => setShowFilterModal(true)}
        >
          <Funnel size={24} color={hasActiveFilters ? colors.brand[500] : colors.gray[600]} />
          {hasActiveFilters && <View style={styles.filterBadge} />}
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={QUICK_FILTERS}
          renderItem={({ item }) => renderFilterButton(item)}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredRequests.length} requests found
        </Text>
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
            description="Try changing the filter or check back later"
          />
        }
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowFilterModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <X size={24} color={colors.gray[600]} />
              </TouchableOpacity>
            </View>

            {/* Urgency Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Urgency</Text>
              <View style={styles.filterOptions}>
                {[
                  { key: null, label: 'All', icon: CheckCircle },
                  { key: 'urgent', label: 'Urgent', icon: Lightning },
                  { key: 'standard', label: 'Standard', icon: Clock },
                  { key: 'flexible', label: 'Flexible', icon: Hourglass },
                ].map(({ key, label, icon: Icon }) => (
                  <TouchableOpacity
                    key={label}
                    onPress={() => setAdvancedFilters(prev => ({ ...prev, urgency: key }))}
                    style={[
                      styles.filterOption,
                      advancedFilters.urgency === key && styles.filterOptionActive,
                    ]}
                  >
                    <Icon
                      size={18}
                      weight="fill"
                      color={advancedFilters.urgency === key ? colors.brand[500] : colors.gray[400]}
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        advancedFilters.urgency === key && styles.filterOptionTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Condition Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Condition Preference</Text>
              <View style={styles.filterOptions}>
                {[
                  { key: null, label: 'All', icon: CheckCircle },
                  { key: 'new', label: 'New', icon: Sparkle },
                  { key: 'used', label: 'Used', icon: Recycle },
                  { key: 'any', label: 'Any', icon: CheckCircle },
                ].map(({ key, label, icon: Icon }) => (
                  <TouchableOpacity
                    key={label}
                    onPress={() => setAdvancedFilters(prev => ({ ...prev, condition: key }))}
                    style={[
                      styles.filterOption,
                      advancedFilters.condition === key && styles.filterOptionActive,
                    ]}
                  >
                    <Icon
                      size={18}
                      weight="fill"
                      color={advancedFilters.condition === key ? colors.brand[500] : colors.gray[400]}
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        advancedFilters.condition === key && styles.filterOptionTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  resetFilters();
                  setShowFilterModal(false);
                }}
              >
                <Text style={styles.resetButtonText}>Reset All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  filterIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
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
  resultsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  resultsText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.gray[500],
  },
  listContent: {
    paddingHorizontal: 24,
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
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 15,
    color: colors.gray[900],
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.gray[500],
  },
  requestContent: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  partName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    color: colors.gray[900],
    marginBottom: 4,
  },
  carInfo: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 8,
  },
  description: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[600],
    lineHeight: 20,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerLeft: {},
  budgetLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.gray[500],
    marginBottom: 2,
  },
  budgetValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    color: colors.brand[500],
  },
  footerRight: {
    alignItems: 'flex-end',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  timeText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.gray[400],
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  submitButtonText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 14,
    color: colors.brand[500],
  },
  filterIconActive: {
    backgroundColor: colors.brand[50],
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.brand[500],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 20,
    color: colors.gray[900],
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.gray[900],
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.gray[100],
    gap: 6,
  },
  filterOptionActive: {
    backgroundColor: colors.brand[50],
    borderWidth: 1,
    borderColor: colors.brand[500],
  },
  filterOptionText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.gray[600],
  },
  filterOptionTextActive: {
    color: colors.brand[600],
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[300],
    alignItems: 'center',
  },
  resetButtonText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 16,
    color: colors.gray[600],
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.brand[500],
    alignItems: 'center',
  },
  applyButtonText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.white,
  },
});

export default BrowseRequestsScreen;
