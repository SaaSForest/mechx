import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Car,
  Wrench,
  Heart,
  MapPin,
  Calendar,
  Gauge,
  X,
} from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';
import { Card } from '../../components/ui';
import { EmptyState } from '../../components/shared';
import useSavedItemsStore from '../../store/savedItemsStore';

const SavedItemsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('cars');
  const [refreshing, setRefreshing] = useState(false);

  const { savedCars, savedParts, isLoading, fetchSavedItems, unsaveItem } =
    useSavedItemsStore();

  useEffect(() => {
    fetchSavedItems();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSavedItems();
    setRefreshing(false);
  };

  const handleUnsave = (type, id, title) => {
    Alert.alert(
      'Remove from Saved',
      `Are you sure you want to remove "${title}" from your saved items?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await unsaveItem(type, id);
          },
        },
      ]
    );
  };

  const renderCarItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('CarDetail', { carId: item.id })}
      style={styles.itemCard}
    >
      <Image
        source={{ uri: item.photo_url || 'https://via.placeholder.com/150' }}
        style={styles.itemImage}
      />
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title || `${item.year} ${item.make} ${item.model}`}
          </Text>
          <TouchableOpacity
            onPress={() => handleUnsave('car', item.id, item.title)}
            style={styles.removeButton}
          >
            <X size={18} color={colors.gray[500]} />
          </TouchableOpacity>
        </View>

        <Text style={styles.itemPrice}>
          ${item.price?.toLocaleString() || 'N/A'}
        </Text>

        <View style={styles.itemDetails}>
          <View style={styles.detailItem}>
            <Calendar size={14} color={colors.gray[400]} />
            <Text style={styles.detailText}>{item.year}</Text>
          </View>
          <View style={styles.detailItem}>
            <Gauge size={14} color={colors.gray[400]} />
            <Text style={styles.detailText}>
              {item.mileage?.toLocaleString() || 'N/A'} mi
            </Text>
          </View>
          {item.location && (
            <View style={styles.detailItem}>
              <MapPin size={14} color={colors.gray[400]} />
              <Text style={styles.detailText} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPartItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('RequestDetail', { requestId: item.id })}
      style={styles.itemCard}
    >
      <Image
        source={{ uri: item.photo_url || 'https://via.placeholder.com/150' }}
        style={styles.itemImage}
      />
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title || item.part_name}
          </Text>
          <TouchableOpacity
            onPress={() => handleUnsave('part', item.id, item.title || item.part_name)}
            style={styles.removeButton}
          >
            <X size={18} color={colors.gray[500]} />
          </TouchableOpacity>
        </View>

        <Text style={styles.itemSubtitle}>
          {item.car_year} {item.car_make} {item.car_model}
        </Text>

        <View style={styles.itemFooter}>
          <View
            style={[
              styles.statusBadge,
              item.status === 'open' && styles.statusOpen,
              item.status === 'pending' && styles.statusPending,
              item.status === 'completed' && styles.statusCompleted,
            ]}
          >
            <Text style={styles.statusText}>
              {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
            </Text>
          </View>
          <Text style={styles.offersCount}>
            {item.offers_count || 0} offers
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const currentData = activeTab === 'cars' ? savedCars : savedParts;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.gray[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Items</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('cars')}
          style={[styles.tab, activeTab === 'cars' && styles.tabActive]}
        >
          <Car
            size={20}
            color={activeTab === 'cars' ? colors.brand[500] : colors.gray[500]}
          />
          <Text
            style={[styles.tabText, activeTab === 'cars' && styles.tabTextActive]}
          >
            Cars ({savedCars.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('parts')}
          style={[styles.tab, activeTab === 'parts' && styles.tabActive]}
        >
          <Wrench
            size={20}
            color={activeTab === 'parts' ? colors.brand[500] : colors.gray[500]}
          />
          <Text
            style={[styles.tabText, activeTab === 'parts' && styles.tabTextActive]}
          >
            Parts ({savedParts.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={currentData}
        renderItem={activeTab === 'cars' ? renderCarItem : renderPartItem}
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
            icon={<Heart size={40} color={colors.gray[400]} />}
            title={`No saved ${activeTab}`}
            description={
              activeTab === 'cars'
                ? 'Save cars you like to view them later'
                : 'Save part requests to keep track of them'
            }
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  headerRight: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.gray[100],
    gap: 8,
  },
  tabActive: {
    backgroundColor: colors.brand[50],
  },
  tabText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.gray[500],
  },
  tabTextActive: {
    color: colors.brand[500],
    fontFamily: typography.fontFamily.semiBold,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: 110,
    height: 110,
    backgroundColor: colors.gray[100],
  },
  itemContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemTitle: {
    flex: 1,
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 15,
    color: colors.gray[900],
    marginRight: 8,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemPrice: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.brand[500],
  },
  itemSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.gray[500],
    marginTop: 2,
  },
  itemDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.gray[500],
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.gray[100],
  },
  statusOpen: {
    backgroundColor: '#D1FAE5',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusCompleted: {
    backgroundColor: '#DBEAFE',
  },
  statusText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 11,
    color: colors.gray[700],
  },
  offersCount: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.gray[500],
  },
  separator: {
    height: 12,
  },
});

export default SavedItemsScreen;
