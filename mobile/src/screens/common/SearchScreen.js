import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar as RNStatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MagnifyingGlass,
  X,
  Clock,
  GearSix,
  Car,
  Storefront,
  CaretRight,
  Trash,
} from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';
import { Avatar, Badge } from '../../components/ui';
import { EmptyState } from '../../components/shared';
import useSearchStore from '../../store/searchStore';
import { debounce } from '../../utils/helpers';

const SearchScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHint, setSearchHint] = useState('');

  const {
    results,
    recentSearches,
    isLoading,
    search,
    loadRecentSearches,
    clearRecentSearches,
    removeRecentSearch,
    clearResults,
  } = useSearchStore();

  useEffect(() => {
    loadRecentSearches();
  }, []);

  useFocusEffect(
    useCallback(() => {
      RNStatusBar.setBarStyle('dark-content', true);
      if (Platform.OS === 'android') {
        RNStatusBar.setBackgroundColor(colors.white, true);
      }
    }, [])
  );

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.length >= 2) {
        search(query);
      }
    }, 300),
    []
  );

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.length === 1) {
      setSearchHint('Enter at least 2 characters to search');
      clearResults();
    } else if (query.length >= 2) {
      setSearchHint('');
      debouncedSearch(query);
    } else {
      setSearchHint('');
      clearResults();
    }
  };

  const handleRecentSearchTap = (query) => {
    setSearchQuery(query);
    setSearchHint('');
    search(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchHint('');
    clearResults();
  };

  const hasResults = results.cars.length > 0 || results.parts.length > 0 || results.sellers.length > 0;
  const isSearching = searchQuery.length >= 2;

  const renderRecentSearch = (item, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => handleRecentSearchTap(item)}
      style={styles.recentSearchItem}
    >
      <Clock size={18} color={colors.gray[400]} />
      <Text style={styles.recentSearchText}>{item}</Text>
      <TouchableOpacity
        onPress={() => removeRecentSearch(item)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <X size={16} color={colors.gray[400]} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderPartResult = (item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => navigation.navigate('RequestDetail', { request: item })}
      style={styles.resultItem}
    >
      <View style={styles.resultIcon}>
        <GearSix size={22} color={colors.gray[400]} />
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle}>{item.part_name}</Text>
        <Text style={styles.resultSubtitle}>
          {item.car_make} {item.car_model} {item.car_year}
        </Text>
      </View>
      <Badge text={item.status} status={item.status} size="small" />
    </TouchableOpacity>
  );

  const renderCarResult = (item) => {
    const imageUrl = item.photos?.[0]?.thumb || item.photos?.[0]?.url;
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => navigation.navigate('CarDetail', { car: item })}
        style={styles.resultItem}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.carImage} />
        ) : (
          <View style={[styles.carImage, styles.carImagePlaceholder]}>
            <Car size={24} color={colors.gray[400]} />
          </View>
        )}
        <View style={styles.resultInfo}>
          <Text style={styles.resultTitle}>
            {item.make} {item.model}
          </Text>
          <Text style={styles.resultSubtitle}>
            {item.year} • {item.mileage?.toLocaleString()} km
          </Text>
        </View>
        <Text style={styles.carPrice}>L {Number(item.price).toLocaleString()}</Text>
      </TouchableOpacity>
    );
  };

  const renderSellerResult = (item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => navigation.navigate('SellerReviews', { seller: item })}
      style={styles.resultItem}
    >
      <Avatar
        source={item.profile_photo_url}
        name={item.full_name || item.business_name}
        size={48}
      />
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle}>
          {item.business_name || item.full_name}
        </Text>
        <Text style={styles.resultSubtitle}>
          ⭐ {Number(item.rating || 0).toFixed(1)} • {item.sales_count || 0} sales
        </Text>
      </View>
      <CaretRight size={20} color={colors.gray[400]} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MagnifyingGlass size={22} color={colors.gray[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search parts, cars, sellers..."
            placeholderTextColor={colors.gray[400]}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color={colors.gray[400]} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {searchHint ? (
        <View style={styles.searchHint}>
          <Text style={styles.searchHintText}>{searchHint}</Text>
        </View>
      ) : null}

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.brand[500]} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}

      {!isSearching ? (
        <FlatList
          data={[]}
          renderItem={() => null}
          ListHeaderComponent={
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent</Text>
                    <TouchableOpacity onPress={clearRecentSearches}>
                      <Text style={styles.clearText}>Clear All</Text>
                    </TouchableOpacity>
                  </View>
                  {recentSearches.map(renderRecentSearch)}
                </View>
              )}

              {/* Quick Categories */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Browse Categories</Text>
                <View style={styles.categoriesGrid}>
                  <TouchableOpacity
                    style={styles.categoryCard}
                    onPress={() => {
                      setSearchQuery('');
                      navigation.navigate('Home', { screen: 'MyRequests' });
                    }}
                  >
                    <View style={[styles.categoryIcon, { backgroundColor: colors.brand[50] }]}>
                      <GearSix size={24} weight="fill" color={colors.brand[500]} />
                    </View>
                    <Text style={styles.categoryText}>Part Requests</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.categoryCard}
                    onPress={() => navigation.navigate('Home', { screen: 'CarList' })}
                  >
                    <View style={[styles.categoryIcon, { backgroundColor: colors.status.completed.bg }]}>
                      <Car size={24} weight="fill" color={colors.status.completed.text} />
                    </View>
                    <Text style={styles.categoryText}>Cars for Sale</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.categoryCard}
                    onPress={() => {
                      setSearchQuery('seller');
                      search('seller');
                    }}
                  >
                    <View style={[styles.categoryIcon, { backgroundColor: colors.status.active.bg }]}>
                      <Storefront size={24} weight="fill" color={colors.status.active.text} />
                    </View>
                    <Text style={styles.categoryText}>Sellers</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={[]}
          renderItem={() => null}
          ListHeaderComponent={
            <>
              {!isLoading && !hasResults && searchQuery.length >= 2 && (
                <View style={styles.emptyContainer}>
                  <EmptyState
                    icon={<MagnifyingGlass size={40} color={colors.gray[400]} />}
                    title="No results found"
                    description={`No matches for "${searchQuery}". Try a different search term.`}
                  />
                </View>
              )}

              {/* Part Requests Results */}
              {results.parts.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Part Requests</Text>
                    <Text style={styles.resultCount}>({results.parts.length})</Text>
                  </View>
                  {results.parts.map(renderPartResult)}
                </View>
              )}

              {/* Cars Results */}
              {results.cars.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Cars for Sale</Text>
                    <Text style={styles.resultCount}>({results.cars.length})</Text>
                  </View>
                  {results.cars.map(renderCarResult)}
                </View>
              )}

              {/* Sellers Results */}
              {results.sellers.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Sellers</Text>
                    <Text style={styles.resultCount}>({results.sellers.length})</Text>
                  </View>
                  {results.sellers.map(renderSellerResult)}
                </View>
              )}
            </>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.gray[900],
    marginHorizontal: 10,
  },
  cancelButton: {
    marginLeft: 12,
  },
  cancelText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 16,
    color: colors.brand[500],
  },
  listContent: {
    paddingBottom: 100,
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    color: colors.gray[900],
  },
  clearText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.brand[500],
  },
  resultCount: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[400],
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[50],
  },
  recentSearchText: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.gray[700],
    marginLeft: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.gray[50],
    borderRadius: 16,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 13,
    color: colors.gray[700],
    textAlign: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[50],
  },
  resultIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 15,
    color: colors.gray[900],
  },
  resultSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.gray[500],
    marginTop: 2,
  },
  carImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
  },
  carImagePlaceholder: {
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  carPrice: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.brand[500],
  },
  searchHint: {
    backgroundColor: colors.gray[50],
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  searchHintText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.gray[500],
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  loadingText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[500],
  },
  emptyContainer: {
    paddingTop: 48,
  },
});

export default SearchScreen;
