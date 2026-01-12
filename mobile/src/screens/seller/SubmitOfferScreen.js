import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  // ArrowLeft,
  CaretLeft,
  Camera,
  X,
  Money,
  Package,
  Truck,
  WarningCircle,
} from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';
import { Button, Input, Card, Badge, Avatar } from '../../components/ui';
import useOfferStore from '../../store/offerStore';

const SubmitOfferScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const request = route.params?.request;

  const { createOffer, isLoading } = useOfferStore();

  // Handle missing request
  if (!request) {
    return (
      <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }]}>
        <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: 16, color: colors.gray[600] }}>
          Request not found
        </Text>
      </View>
    );
  }

  const [formData, setFormData] = useState({
    price: '',
    condition: 'New OEM',
    delivery: '2-3 days',
    message: '',
    photos: [],
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const updateFormData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
    if (apiError) setApiError('');
  };

  const pickImage = async () => {
    if (formData.photos.length >= 3) {
      Alert.alert('Limit Reached', 'You can only add up to 3 photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
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

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = 'Enter a valid price';
      }
    }

    if (formData.message && formData.message.length > 500) {
      newErrors.message = 'Message must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Map frontend condition to backend enum values
  const mapConditionToBackend = (condition) => {
    if (condition.includes('New')) return 'new';
    if (condition.includes('Refurbished')) return 'refurbished';
    return 'used';
  };

  const handleSubmit = async () => {
    setApiError('');
    if (!validateForm()) return;

    try {
      const result = await createOffer({
        part_request_id: request.id,
        price: parseFloat(formData.price),
        part_condition: mapConditionToBackend(formData.condition),
        delivery_time: formData.delivery,
        notes: formData.message || null,
      });
      if (result && !result.success) {
        setApiError(result.error || 'Failed to submit offer');
        return;
      }

      // Upload photos if any (after offer is created)
      if (result.success && formData.photos.length > 0 && result.data?.id) {
        const { uploadOfferPhoto } = useOfferStore.getState();
        for (const photoUri of formData.photos) {
          await uploadOfferPhoto(result.data.id, photoUri);
        }
      }

      Alert.alert('Success', 'Your offer has been submitted!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      setApiError('Failed to submit offer. Please try again.');
    }
  };

  const CONDITIONS = ['New OEM', 'New Aftermarket', 'Used - Excellent', 'Used - Good', 'Refurbished'];
  const DELIVERY_OPTIONS = ['1-2 days', '2-3 days', '3-5 days', '5-7 days', '1-2 weeks'];

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
        <Text style={styles.headerTitle}>Submit Offer</Text>
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

        {/* Request Summary */}
        <Card padding={16} style={styles.requestCard}>
          <View style={styles.requestHeader}>
            <View style={styles.buyerInfo}>
              <Avatar
                source={request.user?.profile_photo_url}
                name={request.user?.full_name}
                size={44}
              />
              <View style={styles.buyerDetails}>
                <Text style={styles.buyerName}>{request.user?.full_name || 'Unknown'}</Text>
                <Text style={styles.requestTitle}>{request.part_name}</Text>
              </View>
            </View>
            <View style={styles.requestMeta}>
              <Text style={styles.carInfo}>
                {request.car_make} {request.car_model} {request.car_year}
              </Text>
              <Badge
                text={request.condition_preference || 'any'}
                status="active"
                size="small"
              />
            </View>
          </View>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Buyer's Budget:</Text>
            <Text style={styles.budgetValue}>{request.budget || 'Not specified'}</Text>
          </View>
        </Card>

        {/* Price Input */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Money size={20} weight="fill" color={colors.brand[500]} />
            <Text style={styles.sectionTitle}>Your Price *</Text>
          </View>
          <View style={[styles.priceInputContainer, errors.price && styles.priceInputError]}>
            <Text style={styles.currencySymbol}>L</Text>
            <Input
              placeholder="0.00"
              value={formData.price}
              onChangeText={(v) => updateFormData('price', v)}
              keyboardType="decimal-pad"
              style={styles.priceInput}
              inputStyle={styles.priceInputText}
            />
          </View>
          {errors.price && (
            <Text style={styles.fieldError}>{errors.price}</Text>
          )}
        </View>

        {/* Condition */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Package size={20} weight="fill" color={colors.brand[500]} />
            <Text style={styles.sectionTitle}>Part Condition</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipsContainer}>
              {CONDITIONS.map((condition) => (
                <TouchableOpacity
                  key={condition}
                  onPress={() => updateFormData('condition', condition)}
                  style={[
                    styles.chip,
                    formData.condition === condition && styles.chipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      formData.condition === condition && styles.chipTextActive,
                    ]}
                  >
                    {condition}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Delivery Time */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Truck size={20} weight="fill" color={colors.brand[500]} />
            <Text style={styles.sectionTitle}>Delivery Time</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipsContainer}>
              {DELIVERY_OPTIONS.map((delivery) => (
                <TouchableOpacity
                  key={delivery}
                  onPress={() => updateFormData('delivery', delivery)}
                  style={[
                    styles.chip,
                    formData.delivery === delivery && styles.chipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      formData.delivery === delivery && styles.chipTextActive,
                    ]}
                  >
                    {delivery}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Photos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Camera size={20} weight="fill" color={colors.brand[500]} />
            <Text style={styles.sectionTitle}>Photos (Optional)</Text>
          </View>
          <View style={styles.photosGrid}>
            {formData.photos.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.photo} />
                <TouchableOpacity
                  onPress={() => removePhoto(index)}
                  style={styles.removePhotoButton}
                >
                  <X size={14} color={colors.white} />
                </TouchableOpacity>
              </View>
            ))}
            {formData.photos.length < 3 && (
              <TouchableOpacity onPress={pickImage} style={styles.addPhotoButton}>
                <Camera size={24} color={colors.gray[400]} />
                <Text style={styles.addPhotoText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Message */}
        <View style={styles.section}>
          <Input
            label="Additional Message"
            placeholder="Add any details about your offer, availability, or questions..."
            value={formData.message}
            onChangeText={(v) => updateFormData('message', v)}
            multiline
            numberOfLines={4}
            error={errors.message}
          />
          <Text style={styles.charCount}>
            {formData.message.length}/500
          </Text>
        </View>

        {/* Submit Button */}
        <Button
          title="Submit Offer"
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.submitButton}
        />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
  },
  requestCard: {
    marginBottom: 24,
    backgroundColor: colors.gray[50],
  },
  requestHeader: {
    marginBottom: 12,
  },
  buyerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  requestTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    color: colors.gray[900],
    marginTop: 2,
  },
  requestMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carInfo: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.gray[600],
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  budgetLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[500],
  },
  budgetValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    color: colors.brand[500],
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.gray[900],
    marginLeft: 8,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
    height: 64,
  },
  currencySymbol: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 28,
    color: colors.gray[400],
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  priceInputText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 28,
    color: colors.gray[900],
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.gray[100],
  },
  chipActive: {
    backgroundColor: colors.brand[500],
  },
  chipText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.gray[600],
  },
  chipTextActive: {
    color: colors.white,
  },
  photosGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  photoContainer: {
    width: 80,
    height: 80,
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
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray[50],
  },
  addPhotoText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.gray[500],
    marginTop: 4,
  },
  submitButton: {
    marginTop: 8,
  },
  priceInputError: {
    borderColor: colors.error,
  },
  fieldError: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  charCount: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.gray[400],
    textAlign: 'right',
    marginTop: 4,
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
});

export default SubmitOfferScreen;
