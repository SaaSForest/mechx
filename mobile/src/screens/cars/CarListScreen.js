import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Funnel,
  Star,
  MapPin,
  Car,
  X,
} from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';
import { Card } from '../../components/ui';
import { EmptyState } from '../../components/shared';
import useCarStore from '../../store/carStore';
import useAuthStore from '../../store/authStore';

const FUEL_TYPES = ['', 'Petrol', 'Diesel', 'Electric', 'Hybrid'];
const TRANSMISSIONS = ['', 'Manual', 'Automatic'];

const FILTERS = ['all', 'featured', 'german', 'japanese', 'recent'];

const CarListScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { cars, fetchCars, isLoading } = useCarStore();
  const { user } = useAuthStore();
  const myListingsOnly = route.params?.myListingsOnly || false;
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: '',
    mileageMax: '',
    fuelType: '',
    transmission: '',
    location: '',
  });

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  const resetFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      yearMin: '',
      yearMax: '',
      mileageMax: '',
      fuelType: '',
      transmission: '',
      location: '',
    });
  };

  const applyFilters = () => {
    setShowFilterModal(false);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCars();
    setRefreshing(false);
  };

  // Use real data from store with advanced filters
  const filteredCars = cars.filter((car) => {
    // My Listings filter - only show user's own listings
    if (myListingsOnly && car.user_id !== user?.id) return false;

    // Category filter
    if (filter === 'featured' && !car.is_featured) return false;
    if (filter === 'german' && !['BMW', 'Mercedes-Benz', 'Mercedes', 'Audi', 'Porsche', 'Volkswagen'].includes(car.make)) return false;
    if (filter === 'japanese' && !['Toyota', 'Honda', 'Nissan', 'Mazda'].includes(car.make)) return false;
    if (filter === 'recent' && car.year < 2022) return false;

    // Advanced filters
    if (filters.priceMin && Number(car.price) < Number(filters.priceMin)) return false;
    if (filters.priceMax && Number(car.price) > Number(filters.priceMax)) return false;
    if (filters.yearMin && car.year < Number(filters.yearMin)) return false;
    if (filters.yearMax && car.year > Number(filters.yearMax)) return false;
    if (filters.mileageMax && car.mileage > Number(filters.mileageMax)) return false;
    if (filters.fuelType && car.fuel_type?.toLowerCase() !== filters.fuelType.toLowerCase()) return false;
    if (filters.transmission && car.transmission?.toLowerCase() !== filters.transmission.toLowerCase()) return false;
    if (filters.location && !car.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;

    return true;
  });

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

  const renderCarItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('CarDetail', { car: item })}
      style={styles.carCard}
    >
      <View style={styles.carImageContainer}>
        {item.photos?.[0]?.url ? (
          <Image
            source={{ uri: item.photos[0].url }}
            style={styles.carImage}
          />
        ) : (
          <View style={[styles.carImage, styles.carImagePlaceholder]}>
            <Car size={32} color={colors.gray[400]} />
          </View>
        )}
        {item.is_featured && (
          <View style={styles.featuredBadge}>
            <Star size={12} weight="fill" color={colors.white} />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
      </View>
      <View style={styles.carInfo}>
        <Text style={styles.carTitle}>
          {item.make} {item.model}
        </Text>
        <View style={styles.carMeta}>
          <Text style={styles.carMetaText}>{item.year}</Text>
          <Text style={styles.carMetaDot}>•</Text>
          <Text style={styles.carMetaText}>{item.mileage}</Text>
        </View>
        <View style={styles.carFooter}>
          <Text style={styles.carPrice}>L {item.price.toLocaleString()}</Text>
          <View style={styles.locationRow}>
            <MapPin size={14} color={colors.gray[400]} />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        </View>
      </View>
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
        <Text style={styles.headerTitle}>{myListingsOnly ? 'My Listings' : 'Cars for Sale'}</Text>
        <TouchableOpacity
          style={styles.filterIcon}
          onPress={() => setShowFilterModal(true)}
        >
          <Funnel size={24} color={hasActiveFilters ? colors.brand[500] : colors.gray[600]} />
          {hasActiveFilters && <View style={styles.filterBadge} />}
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

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredCars.length} cars found
        </Text>
      </View>

      {/* Cars List */}
      <FlatList
        data={filteredCars}
        renderItem={renderCarItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
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
            icon={<Car size={40} color={colors.gray[400]} />}
            title="No cars found"
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
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 16 }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Cars</Text>
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color={colors.gray[600]} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Price Range */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Price Range (L)</Text>
                <View style={styles.filterRow}>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="Min"
                    placeholderTextColor={colors.gray[400]}
                    keyboardType="numeric"
                    value={filters.priceMin}
                    onChangeText={(v) => setFilters({ ...filters, priceMin: v })}
                  />
                  <Text style={styles.filterDash}>-</Text>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="Max"
                    placeholderTextColor={colors.gray[400]}
                    keyboardType="numeric"
                    value={filters.priceMax}
                    onChangeText={(v) => setFilters({ ...filters, priceMax: v })}
                  />
                </View>
              </View>

              {/* Year Range */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Year</Text>
                <View style={styles.filterRow}>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="From"
                    placeholderTextColor={colors.gray[400]}
                    keyboardType="numeric"
                    value={filters.yearMin}
                    onChangeText={(v) => setFilters({ ...filters, yearMin: v })}
                  />
                  <Text style={styles.filterDash}>-</Text>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="To"
                    placeholderTextColor={colors.gray[400]}
                    keyboardType="numeric"
                    value={filters.yearMax}
                    onChangeText={(v) => setFilters({ ...filters, yearMax: v })}
                  />
                </View>
              </View>

              {/* Max Mileage */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Max Mileage (km)</Text>
                <TextInput
                  style={styles.filterInputFull}
                  placeholder="e.g. 100000"
                  placeholderTextColor={colors.gray[400]}
                  keyboardType="numeric"
                  value={filters.mileageMax}
                  onChangeText={(v) => setFilters({ ...filters, mileageMax: v })}
                />
              </View>

              {/* Fuel Type */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Fuel Type</Text>
                <View style={styles.optionRow}>
                  {FUEL_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type || 'all'}
                      style={[
                        styles.optionButton,
                        filters.fuelType === type && styles.optionButtonActive,
                      ]}
                      onPress={() => setFilters({ ...filters, fuelType: type })}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          filters.fuelType === type && styles.optionButtonTextActive,
                        ]}
                      >
                        {type || 'All'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Transmission */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Transmission</Text>
                <View style={styles.optionRow}>
                  {TRANSMISSIONS.map((type) => (
                    <TouchableOpacity
                      key={type || 'all'}
                      style={[
                        styles.optionButton,
                        filters.transmission === type && styles.optionButtonActive,
                      ]}
                      onPress={() => setFilters({ ...filters, transmission: type })}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          filters.transmission === type && styles.optionButtonTextActive,
                        ]}
                      >
                        {type || 'All'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Location */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Location</Text>
                <TextInput
                  style={styles.filterInputFull}
                  placeholder="Search city..."
                  placeholderTextColor={colors.gray[400]}
                  value={filters.location}
                  onChangeText={(v) => setFilters({ ...filters, location: v })}
                />
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  columnWrapper: {
    gap: 16,
    marginBottom: 16,
  },
  carCard: {
    flex: 1,
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
    height: 120,
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
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brand[500],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  featuredText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 10,
    color: colors.white,
    marginLeft: 4,
  },
  carInfo: {
    padding: 12,
  },
  carTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 14,
    color: colors.gray[900],
  },
  carMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  carMetaText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.gray[500],
  },
  carMetaDot: {
    color: colors.gray[400],
    marginHorizontal: 6,
  },
  carFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  carPrice: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.brand[500],
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  locationText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 11,
    color: colors.gray[400],
  },
  carImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray[100],
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
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  modalTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 20,
    color: colors.gray[900],
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 14,
    color: colors.gray[700],
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterInput: {
    flex: 1,
    height: 48,
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.gray[900],
  },
  filterInputFull: {
    height: 48,
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.gray[900],
  },
  filterDash: {
    marginHorizontal: 12,
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.gray[400],
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
  },
  optionButtonActive: {
    backgroundColor: colors.brand[500],
  },
  optionButtonText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.gray[600],
  },
  optionButtonTextActive: {
    color: colors.white,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  resetButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.gray[600],
  },
  applyButton: {
    flex: 2,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.brand[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.white,
  },
});

export default CarListScreen;
