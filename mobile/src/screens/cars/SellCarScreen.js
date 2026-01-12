import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Pressable,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  X,
  Camera,
  Car,
  Money,
  MapPin,
  WarningCircle,
  CheckCircle,
} from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';
import { Button, Input, Card } from '../../components/ui';
import useCarStore from '../../store/carStore';

const CAR_MAKES = [
  'BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Toyota',
  'Honda', 'Ford', 'Peugeot', 'Renault', 'Opel', 'Porsche', 'Volvo'
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1990 }, (_, i) => currentYear - 1 - i);

const SellCarScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { createListing, isLoading } = useCarStore();

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    mileage: '',
    price: '',
    description: '',
    location: '',
    photos: [],
    isFeatured: false,
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const [showYearModal, setShowYearModal] = useState(false);

  const screenHeight = Dimensions.get('window').height;
  const yearTranslateY = useRef(new Animated.Value(0)).current;
  const yearBackdropOpacity = useRef(new Animated.Value(0)).current;


  const updateFormData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
    if (apiError) setApiError('');
  };
  useEffect(() => {
    if (showYearModal) {
      yearTranslateY.setValue(screenHeight);
      yearBackdropOpacity.setValue(0);
      Animated.parallel([
        Animated.spring(yearTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(yearBackdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      yearTranslateY.setValue(screenHeight);
      yearBackdropOpacity.setValue(0);
    }
  }, [showYearModal]);


  const yearPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 5 && gestureState.dy > 0;
      },
      onPanResponderGrant: () => {
        yearTranslateY.setOffset(yearTranslateY._value);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          yearTranslateY.setValue(gestureState.dy);
          const dragProgress = Math.min(gestureState.dy / screenHeight, 1);
          yearBackdropOpacity.setValue(1 - dragProgress * 0.5);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        yearTranslateY.flattenOffset();
        if (gestureState.dy > 150 || gestureState.vy > 0.5) {
          Animated.parallel([
            Animated.timing(yearTranslateY, {
              toValue: screenHeight,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(yearBackdropOpacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setShowYearModal(false);
          });
        } else {
          Animated.parallel([
            Animated.spring(yearTranslateY, {
              toValue: 0,
              useNativeDriver: true,
              tension: 65,
              friction: 11,
            }),
            Animated.timing(yearBackdropOpacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;



  const pickImage = async () => {
    if (formData.photos.length >= 5) {
      Alert.alert('Limit Reached', 'You can only add up to 5 photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      updateFormData('photos', [...formData.photos, result.assets[0].uri]);
    }
  };

  const removePhoto = (index) => {
    const newPhotos = [...formData.photos];
    newPhotos.splice(index, 1);
    updateFormData('photos', newPhotos);
  };

  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    if (!formData.make) {
      newErrors.make = 'Please select a car make';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }

    if (!formData.year.trim()) {
      newErrors.year = 'Year is required';
    } else {
      const year = parseInt(formData.year);
      if (isNaN(year) || year < 1900 || year > currentYear + 1) {
        newErrors.year = 'Enter a valid year';
      }
    }

    if (!formData.mileage.trim()) {
      newErrors.mileage = 'Mileage is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = 'Enter a valid price';
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.description && formData.description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
    }

    if (formData.photos.length === 0) {
      newErrors.photos = 'At least one photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setApiError('');
    if (!validateForm()) return;

    try {
      const result = await createListing({
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        mileage: formData.mileage,
        price: parseFloat(formData.price),
        description: formData.description,
        location: formData.location,
        is_featured: formData.isFeatured,
      });
      if (result && !result.success) {
        setApiError(result.error || 'Failed to create listing');
        return;
      }

      // Upload photos after car is created
      if (result.success && formData.photos.length > 0 && result.data?.id) {
        const { uploadCarPhoto } = useCarStore.getState();
        for (let i = 0; i < formData.photos.length; i++) {
          const photoUri = formData.photos[i];
          const isPrimary = i === 0; // First photo is primary
          await uploadCarPhoto(result.data.id, photoUri, isPrimary);
        }
      }

      Alert.alert('Success', 'Your car listing has been created!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      setApiError('Failed to create listing. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <X size={24} color={colors.gray[600]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sell Your Car</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* API Error Banner */}
        {apiError && (
          <View style={styles.errorBanner}>
            <WarningCircle size={20} weight="fill" color={colors.error} />
            <Text style={styles.errorBannerText}>{apiError}</Text>
          </View>
        )}

        {/* Photos Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Camera size={20} weight="fill" color={colors.brand[500]} />
            <Text style={styles.sectionTitle}>Photos *</Text>
            <Text style={styles.sectionSubtitle}>(Up to 5)</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.photosContainer}
          >
            {formData.photos.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.photo} />
                <TouchableOpacity
                  onPress={() => removePhoto(index)}
                  style={styles.removePhotoButton}
                >
                  <X size={14} color={colors.white} />
                </TouchableOpacity>
                {index === 0 && (
                  <View style={styles.mainPhotoBadge}>
                    <Text style={styles.mainPhotoText}>Main</Text>
                  </View>
                )}
              </View>
            ))}
            {formData.photos.length < 5 && (
              <TouchableOpacity
                onPress={pickImage}
                style={[styles.addPhotoButton, errors.photos && styles.addPhotoButtonError]}
              >
                <Camera size={28} color={errors.photos ? colors.error : colors.gray[400]} />
                <Text style={[styles.addPhotoText, errors.photos && styles.addPhotoTextError]}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
          {errors.photos && (
            <Text style={styles.chipError}>{errors.photos}</Text>
          )}
        </View>

        {/* Car Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Car size={20} weight="fill" color={colors.brand[500]} />
            <Text style={styles.sectionTitle}>Car Details</Text>
          </View>

          <Text style={styles.inputLabel}>Car Make *</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.makeScroll}
          >
            {CAR_MAKES.map((make) => (
              <TouchableOpacity
                key={make}
                onPress={() => updateFormData('make', make)}
                style={[
                  styles.makeChip,
                  formData.make === make && styles.makeChipActive,
                  errors.make && styles.makeChipError,
                ]}
              >
                <Text
                  style={[
                    styles.makeChipText,
                    formData.make === make && styles.makeChipTextActive,
                  ]}
                >
                  {make}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {errors.make && (
            <Text style={styles.chipError}>{errors.make}</Text>
          )}

          <View style={styles.rowInputs}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Year *</Text>
              <TouchableOpacity
                onPress={() => setShowYearModal(true)}
                style={[
                  styles.yearPickerButton,
                  errors.year && styles.yearPickerButtonError,
                ]}
              >
                <Text
                  style={[
                    styles.yearPickerText,
                    !formData.year && styles.yearPickerPlaceholder,
                  ]}
                >
                  {formData.year || 'Select Year'}
                </Text>
              </TouchableOpacity>
              {errors.year && (
                <Text style={styles.inputError}>{errors.year}</Text>
              )}
            </View>
            <View style={styles.halfInput}>
              <Input
                label="Mileage *"
                placeholder="e.g., 45,000 km"
                value={formData.mileage}
                onChangeText={(v) => updateFormData('mileage', v)}
                error={errors.mileage}
              />
            </View>
          </View>
        </View>

        {/* Price Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Money size={20} weight="fill" color={colors.brand[500]} />
            <Text style={styles.sectionTitle}>Price *</Text>
          </View>
          <View style={[styles.priceInputContainer, errors.price && styles.priceInputError]}>
            <Text style={styles.currencySymbol}>L</Text>
            <Input
              placeholder="0"
              value={formData.price}
              onChangeText={(v) => updateFormData('price', v)}
              keyboardType="decimal-pad"
              style={styles.priceInput}
              inputStyle={styles.priceInputText}
            />
          </View>
          {errors.price && (
            <Text style={styles.chipError}>{errors.price}</Text>
          )}
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} weight="fill" color={colors.brand[500]} />
            <Text style={styles.sectionTitle}>Location *</Text>
          </View>
          <Input
            placeholder="City, Country"
            value={formData.location}
            onChangeText={(v) => updateFormData('location', v)}
            error={errors.location}
          />
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Input
            label="Description"
            placeholder="Tell buyers about your car's condition, features, service history..."
            value={formData.description}
            onChangeText={(v) => updateFormData('description', v)}
            multiline
            numberOfLines={4}
            error={errors.description}
          />
        </View>

        {/* Featured Listing Toggle */}
        <TouchableOpacity
          onPress={() => updateFormData('isFeatured', !formData.isFeatured)}
          style={styles.featuredToggle}
        >
          <View style={styles.featuredInfo}>
            <Text style={styles.featuredTitle}>Featured Listing</Text>
            <Text style={styles.featuredDescription}>
              Get more visibility with a featured badge
            </Text>
          </View>
          <View
            style={[
              styles.toggleSwitch,
              formData.isFeatured && styles.toggleSwitchActive,
            ]}
          >
            <View
              style={[
                styles.toggleKnob,
                formData.isFeatured && styles.toggleKnobActive,
              ]}
            />
          </View>
        </TouchableOpacity>

        {/* Submit Button */}
        <Button
          title="Create Listing"
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.submitButton}
        />

        {/* Year Selection Modal */}
        <Modal
          visible={showYearModal}
          animationType="none"
          transparent={true}
          onRequestClose={() => {
            Animated.parallel([
              Animated.timing(yearTranslateY, {
                toValue: screenHeight,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(yearBackdropOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }),
            ]).start(() => {
              setShowYearModal(false);
            });
          }}
        >
          <Animated.View
            style={[
              styles.modalOverlay,
              { opacity: yearBackdropOpacity },
            ]}
          >
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => {
                Animated.parallel([
                  Animated.timing(yearTranslateY, {
                    toValue: screenHeight,
                    duration: 300,
                    useNativeDriver: true,
                  }),
                  Animated.timing(yearBackdropOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                  }),
                ]).start(() => {
                  setShowYearModal(false);
                });
              }}
            />
            <Animated.View
              style={[
                styles.modalContent,
                { paddingBottom: insets.bottom + 24 },
                {
                  transform: [{ translateY: yearTranslateY }],
                },
              ]}
              {...yearPanResponder.panHandlers}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Year</Text>
                <TouchableOpacity
                  onPress={() => {
                    Animated.parallel([
                      Animated.timing(yearTranslateY, {
                        toValue: screenHeight,
                        duration: 300,
                        useNativeDriver: true,
                      }),
                      Animated.timing(yearBackdropOpacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                      }),
                    ]).start(() => {
                      setShowYearModal(false);
                    });
                  }}
                >
                  <X size={24} color={colors.gray[600]} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.yearList} showsVerticalScrollIndicator={false}>
                {YEARS.map((year) => (
                  <TouchableOpacity
                    key={year}
                    onPress={() => {
                      updateFormData('year', String(year));
                      Animated.parallel([
                        Animated.timing(yearTranslateY, {
                          toValue: screenHeight,
                          duration: 300,
                          useNativeDriver: true,
                        }),
                        Animated.timing(yearBackdropOpacity, {
                          toValue: 0,
                          duration: 300,
                          useNativeDriver: true,
                        }),
                      ]).start(() => {
                        setShowYearModal(false);
                      });
                    }}
                    style={[
                      styles.yearItem,
                      formData.year === String(year) && styles.yearItemActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.yearItemText,
                        formData.year === String(year) && styles.yearItemTextActive,
                      ]}
                    >
                      {year}
                    </Text>
                    {formData.year === String(year) && (
                      <CheckCircle size={20} weight="fill" color={colors.brand[500]} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>
          </Animated.View>
        </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'flex-start',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.gray[900],
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[400],
    marginLeft: 8,
  },
  photosContainer: {
    gap: 12,
  },
  photoContainer: {
    width: 160,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainPhotoBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: colors.brand[500],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  mainPhotoText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 11,
    color: colors.white,
  },
  addPhotoButton: {
    width: 160,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray[50],
  },
  addPhotoText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 13,
    color: colors.gray[500],
    marginTop: 4,
  },
  inputLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.gray[700],
    marginBottom: 8,
  },
  makeScroll: {
    marginBottom: 16,
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  makeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.gray[100],
    marginRight: 8,
  },
  makeChipActive: {
    backgroundColor: colors.brand[500],
  },
  makeChipText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.gray[600],
  },
  makeChipTextActive: {
    color: colors.white,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  currencySymbol: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 24,
    color: colors.gray[400],
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    marginBottom: 0,
  },
  priceInputText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 28,
    color: colors.gray[900],
  },
  featuredToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.gray[50],
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  featuredInfo: {
    flex: 1,
  },
  featuredTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.gray[900],
  },
  featuredDescription: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.gray[500],
    marginTop: 2,
  },
  toggleSwitch: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray[300],
    padding: 2,
  },
  toggleSwitchActive: {
    backgroundColor: colors.brand[500],
  },
  toggleKnob: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  toggleKnobActive: {
    transform: [{ translateX: 20 }],
  },
  submitButton: {
    marginTop: 8,
  },
  makeChipError: {
    borderWidth: 1,
    borderColor: colors.error,
  },
  chipError: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
    marginBottom: 8,
  },
  addPhotoButtonError: {
    borderColor: colors.error,
  },
  addPhotoTextError: {
    color: colors.error,
  },
  priceInputError: {
    borderColor: colors.error,
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorBannerText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.error,
    marginLeft: 10,
    flex: 1,
  },
  yearPickerButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: colors.gray[50],
    minHeight: 50,
    justifyContent: 'center',
  },
  yearPickerButtonError: {
    borderColor: colors.error,
  },
  yearPickerText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.gray[900],
  },
  yearPickerPlaceholder: {
    color: colors.gray[400],
  },
  inputError: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
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
    maxHeight: '80%',
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
  yearList: {
    maxHeight: 400,
  },
  yearItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  yearItemActive: {
    backgroundColor: colors.brand[50],
  },
  yearItemText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.gray[900],
  },
  yearItemTextActive: {
    fontFamily: typography.fontFamily.semiBold,
    color: colors.brand[600],
  },

});

export default SellCarScreen;
