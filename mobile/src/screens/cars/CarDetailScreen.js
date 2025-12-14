import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Share,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Heart,
  Export,
  MapPin,
  CalendarBlank,
  Gauge,
  Star,
  ChatCircleDots,
  Phone,
  SealCheck,
} from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';
import { Button, Avatar } from '../../components/ui';
import useSavedItemsStore from '../../store/savedItemsStore';

const { width: screenWidth } = Dimensions.get('window');

const CarDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const car = route.params?.car;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { saveItem, unsaveItem, checkIfSaved, isCarSaved, fetchSavedItems, savedCars } = useSavedItemsStore();

  // Check if car is saved on mount
  useEffect(() => {
    if (car?.id) {
      // First check local state
      const localSaved = isCarSaved(car.id);
      setIsSaved(localSaved);

      // Then verify with backend
      checkIfSaved('car', car.id).then((saved) => {
        setIsSaved(saved);
      });
    }
  }, [car?.id]);

  // Update saved state when savedCars changes
  useEffect(() => {
    if (car?.id) {
      setIsSaved(isCarSaved(car.id));
    }
  }, [savedCars, car?.id]);

  const handleToggleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      if (isSaved) {
        const result = await unsaveItem('car', car.id);
        if (result.success) {
          setIsSaved(false);
        } else {
          Alert.alert('Error', result.error);
        }
      } else {
        const result = await saveItem('car', car.id);
        if (result.success) {
          setIsSaved(true);
        } else {
          Alert.alert('Error', result.error);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this ${car.year} ${car.make} ${car.model} for L${Number(car.price).toLocaleString()} on mechX!\n\nLocation: ${car.location}\nMileage: ${car.mileage}`,
        title: `${car.make} ${car.model} - mechX`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share this listing');
    }
  };

  // Handle case where car data is missing
  if (!car) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.carTitle}>Car not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.brand[500], marginTop: 16 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images = car.photos?.length > 0 ? car.photos : [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
              setActiveImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image.url }}
                style={styles.carImage}
              />
            ))}
          </ScrollView>

          {/* Image Indicators */}
          <View style={styles.indicators}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  activeImageIndex === index && styles.indicatorActive,
                ]}
              />
            ))}
          </View>

          {/* Featured Badge */}
          {car.is_featured && (
            <View style={styles.featuredBadge}>
              <Star size={14} weight="fill" color={colors.white} />
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}

          {/* Header Overlay */}
          <View style={styles.headerOverlay}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.overlayButton}
            >
              <ArrowLeft size={24} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={handleToggleSave}
                style={[styles.overlayButton, isSaving && { opacity: 0.5 }]}
                disabled={isSaving}
              >
                <Heart
                  size={24}
                  weight={isSaved ? 'fill' : 'regular'}
                  color={isSaved ? colors.error : colors.white}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.overlayButton} onPress={handleShare}>
                <Export size={24} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Car Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.carTitle}>
            {car.make} {car.model}
          </Text>
          <Text style={styles.carPrice}>L {car.price.toLocaleString()}</Text>

          {/* Quick Info */}
          <View style={styles.quickInfo}>
            <View style={styles.quickInfoItem}>
              <CalendarBlank size={20} color={colors.gray[500]} />
              <Text style={styles.quickInfoText}>{car.year}</Text>
            </View>
            <View style={styles.quickInfoDivider} />
            <View style={styles.quickInfoItem}>
              <Gauge size={20} color={colors.gray[500]} />
              <Text style={styles.quickInfoText}>{car.mileage}</Text>
            </View>
            <View style={styles.quickInfoDivider} />
            <View style={styles.quickInfoItem}>
              <MapPin size={20} color={colors.gray[500]} />
              <Text style={styles.quickInfoText}>{car.location}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{car.description}</Text>
          </View>

          {/* Seller Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seller</Text>
            <View style={styles.sellerCard}>
              <View style={styles.sellerInfo}>
                <Avatar
                  source={car.user?.profile_photo_url}
                  name={car.user?.full_name || car.user?.business_name}
                  size={56}
                />
                <View style={styles.sellerDetails}>
                  <View style={styles.sellerNameRow}>
                    <Text style={styles.sellerName}>{car.user?.business_name || car.user?.full_name}</Text>
                    {car.user?.is_verified && (
                      <SealCheck size={18} weight="fill" color={colors.success} />
                    )}
                  </View>
                  <View style={styles.sellerMeta}>
                    {car.user?.rating > 0 && (
                      <View style={styles.ratingRow}>
                        <Star size={14} weight="fill" color="#F59E0B" />
                        <Text style={styles.ratingText}>
                          {Number(car.user.rating).toFixed(1)}
                        </Text>
                      </View>
                    )}
                    {car.user?.sales_count > 0 && (
                      <Text style={styles.listingsText}>
                        {car.user?.sales_count} sales
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.callButton}>
          <Phone size={24} color={colors.brand[500]} />
        </TouchableOpacity>
        <Button
          title="Message Seller"
          onPress={() => navigation.navigate('Messages', {
            screen: 'Chat',
            params: { seller: car.seller },
          })}
          icon={<ChatCircleDots size={20} color={colors.white} />}
          style={styles.messageButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    backgroundColor: colors.gray[100],
    position: 'relative',
  },
  carImage: {
    width: screenWidth,
    height: 300,
    resizeMode: 'cover',
  },
  indicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  indicatorActive: {
    backgroundColor: colors.white,
    width: 24,
  },
  featuredBadge: {
    position: 'absolute',
    top: 60,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brand[500],
    paddingHorizontal: 12,
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
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  overlayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  infoContainer: {
    padding: 24,
  },
  carTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 24,
    color: colors.gray[900],
    marginBottom: 8,
  },
  carPrice: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 28,
    color: colors.brand[500],
    marginBottom: 20,
  },
  quickInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  quickInfoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  quickInfoText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.gray[700],
  },
  quickInfoDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.gray[200],
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    color: colors.gray[900],
    marginBottom: 12,
  },
  description: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 15,
    color: colors.gray[600],
    lineHeight: 24,
  },
  sellerCard: {
    backgroundColor: colors.gray[50],
    borderRadius: 16,
    padding: 16,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerDetails: {
    marginLeft: 16,
    flex: 1,
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sellerName: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.gray[900],
  },
  sellerMeta: {
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.gray[600],
  },
  listingsText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.gray[500],
    marginTop: 2,
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  callButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.brand[500],
  },
  messageButton: {
    flex: 1,
  },
});

export default CarDetailScreen;
