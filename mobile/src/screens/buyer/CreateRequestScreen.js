// import React, { useState } from 'react';
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
  TextInput,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  X,
  Car,
  GearSix,
  Camera,
  Sparkle,
  Recycle,
  CheckCircle,
  ClipboardText,
  WarningCircle,
  Money,
  Lightning,
  Clock,
  Hourglass,
} from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';
import { Button, Input, Card } from '../../components/ui';
import useRequestStore from '../../store/requestStore';
import useAuthStore from '../../store/authStore';

const CAR_MAKES = [
  'BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Toyota',
  'Honda', 'Ford', 'Peugeot', 'Renault', 'Opel', 'Porsche', 'Volvo'
];


const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1990 }, (_, i) => currentYear - 1 - i);

const ENGINE_OPTIONS = [
  '1.0 TSI', '1.2 TSI', '1.4 TSI', '1.5 TSI', '1.6 TDI', '1.6 TSI',
  '1.8 TSI', '2.0 TDI', '2.0 TSI', '2.5 TDI', '3.0 TDI', '3.0 TSI',
  '1.4 GDI', '1.6 GDI', '2.0 GDI', '1.6 HDI', '2.0 HDI', '1.5 CDI',
  '2.0 CDI', '2.2 CDI', '3.0 CDI', '1.6 CRDi', '2.0 CRDi', '2.2 CRDi',
  '1.4 Turbo', '1.6 Turbo', '2.0 Turbo', '3.0 Turbo', '4.0 Turbo',
  '1.0', '1.2', '1.4', '1.6', '1.8', '2.0', '2.5', '3.0', '3.5', '4.0',
  'Electric', 'Hybrid'
];

const CreateRequestScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { createRequest, updateRequest, isLoading } = useRequestStore();
  const { user } = useAuthStore();

  // Edit mode support
  const editMode = route.params?.editMode || false;
  const existingRequest = route.params?.request;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    carMake: editMode && existingRequest ? existingRequest.car_make : '',
    carModel: editMode && existingRequest ? existingRequest.car_model : '',
    carYear: editMode && existingRequest ? String(existingRequest.car_year) : '',
    engine: editMode && existingRequest ? (existingRequest.engine || '') : '',
    partName: editMode && existingRequest ? existingRequest.part_name : '',
    description: editMode && existingRequest ? (existingRequest.description || '') : '',
    condition: editMode && existingRequest ? (existingRequest.condition_preference || 'any') : 'any',
    photos: editMode && existingRequest && existingRequest.photos ? existingRequest.photos.map(p => p.url) : [],
    timeframe: '48',
    budgetMin: editMode && existingRequest && existingRequest.budget_min ? String(existingRequest.budget_min) : '',
    budgetMax: editMode && existingRequest && existingRequest.budget_max ? String(existingRequest.budget_max) : '',
    urgency: editMode && existingRequest ? (existingRequest.urgency || 'standard') : 'standard',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const [showYearModal, setShowYearModal] = useState(false);
  const [showEngineModal, setShowEngineModal] = useState(false);
  const [customEngine, setCustomEngine] = useState('');


  const screenHeight = Dimensions.get('window').height;
  const yearTranslateY = useRef(new Animated.Value(0)).current;
  const yearBackdropOpacity = useRef(new Animated.Value(0)).current;

  const engineTranslateY = useRef(new Animated.Value(0)).current;
  const engineBackdropOpacity = useRef(new Animated.Value(0)).current;


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


  useEffect(() => {
    if (showEngineModal) {
      engineTranslateY.setValue(screenHeight);
      engineBackdropOpacity.setValue(0);
      Animated.parallel([
        Animated.spring(engineTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(engineBackdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      engineTranslateY.setValue(screenHeight);
      engineBackdropOpacity.setValue(0);
    }
  }, [showEngineModal]);


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

  const enginePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        return true;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 5 && gestureState.dy > 0;
      },
      onPanResponderGrant: () => {
        engineTranslateY.setOffset(engineTranslateY._value);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          engineTranslateY.setValue(gestureState.dy);
          const dragProgress = Math.min(gestureState.dy / screenHeight, 1);
          engineBackdropOpacity.setValue(1 - dragProgress * 0.5);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        engineTranslateY.flattenOffset();
        if (gestureState.dy > 150 || gestureState.vy > 0.5) {
          Animated.parallel([
            Animated.timing(engineTranslateY, {
              toValue: screenHeight,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(engineBackdropOpacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setShowEngineModal(false);
            setCustomEngine('');
          });
        } else {
          Animated.parallel([
            Animated.spring(engineTranslateY, {
              toValue: 0,
              useNativeDriver: true,
              tension: 65,
              friction: 11,
            }),
            Animated.timing(engineBackdropOpacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;


  const validateStep1 = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    if (!formData.carMake) {
      newErrors.carMake = 'Please select a car make';
    }

    if (!formData.carModel.trim()) {
      newErrors.carModel = 'Car model is required';
    }

    if (!formData.carYear.trim()) {
      newErrors.carYear = 'Year is required';
    } else {
      const year = parseInt(formData.carYear);
      if (isNaN(year) || year < 1900 || year > currentYear + 1) {
        newErrors.carYear = 'Enter a valid year';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.partName.trim()) {
      newErrors.partName = 'Part name is required';
    }

    if (formData.description && formData.description.length < 10) {
      newErrors.description = 'Description should be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleNextStep1 = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleNextStep2 = () => {
    if (validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    setApiError('');
    try {
      const requestData = {
        car_make: formData.carMake,
        car_model: formData.carModel,
        car_year: parseInt(formData.carYear),
        engine: formData.engine,
        part_name: formData.partName,
        description: formData.description,
        condition_preference: formData.condition,
        budget_min: formData.budgetMin ? parseFloat(formData.budgetMin) : null,
        budget_max: formData.budgetMax ? parseFloat(formData.budgetMax) : null,
        location: user?.location || null,
        urgency: formData.urgency,
      };

      let result;
      if (editMode && existingRequest?.id) {
        result = await updateRequest(existingRequest.id, requestData);
      } else {
        result = await createRequest(requestData);
      }

      if (result && !result.success) {
        setApiError(result.error || (editMode ? 'Failed to update request' : 'Failed to submit request'));
        return;
      }

      // Upload photos after request is created (only for new requests with new photos)
      if (result.success && formData.photos.length > 0 && result.data?.id) {
        const { uploadRequestPhoto } = useRequestStore.getState();
        for (const photoUri of formData.photos) {
          // Only upload if it's a local URI (not already uploaded)
          if (photoUri.startsWith('file://') || photoUri.startsWith('content://')) {
            await uploadRequestPhoto(result.data.id, photoUri);
          }
        }
      }

      Alert.alert('Success', editMode ? 'Your request has been updated!' : 'Your part request has been submitted!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      setApiError(editMode ? 'Failed to update request. Please try again.' : 'Failed to submit request. Please try again.');
    }
  };

  const canProceedStep1 = formData.carMake && formData.carModel && formData.carYear;
  const canProceedStep2 = formData.partName;

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((s) => (
        <View key={s} style={styles.stepRow}>
          <View
            style={[
              styles.stepCircle,
              step >= s && styles.stepCircleActive,
            ]}
          >
            <Text
              style={[
                styles.stepNumber,
                step >= s && styles.stepNumberActive,
              ]}
            >
              {s}
            </Text>
          </View>
          {s < 3 && (
            <View
              style={[
                styles.stepLine,
                step > s && styles.stepLineActive,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

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
        <Text style={styles.headerTitle}>{editMode ? 'Edit Request' : 'Request a Part'}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderStepIndicator()}

        {/* API Error Banner */}
        {apiError && (
          <View style={styles.errorBanner}>
            <WarningCircle size={20} weight="fill" color={colors.error} />
            <Text style={styles.errorBannerText}>{apiError}</Text>
          </View>
        )}

        {/* Step 1: Car Details */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconBox}>
                <Car size={32} weight="fill" color={colors.brand[500]} />
              </View>
              <Text style={styles.stepTitle}>Car Information</Text>
              <Text style={styles.stepSubtitle}>Tell us about your vehicle</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Car Make *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.makeScroll}
              >
                {CAR_MAKES.map((make) => (
                  <TouchableOpacity
                    key={make}
                    onPress={() => updateFormData('carMake', make)}
                    style={[
                      styles.makeChip,
                      formData.carMake === make && styles.makeChipActive,
                      errors.carMake && styles.makeChipError,
                    ]}
                  >
                    <Text
                      style={[
                        styles.makeChipText,
                        formData.carMake === make && styles.makeChipTextActive,
                      ]}
                    >
                      {make}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {errors.carMake && (
                <Text style={styles.chipError}>{errors.carMake}</Text>
              )}

              <Input
                label="Car Model *"
                placeholder="e.g., 3 Series, A4, Golf GTI"
                value={formData.carModel}
                onChangeText={(v) => updateFormData('carModel', v)}
                error={errors.carModel}
              />

              <View style={styles.rowInputs}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Year *</Text>
                  <TouchableOpacity
                    onPress={() => setShowYearModal(true)}
                    style={[
                      styles.yearPickerButton,
                      errors.carYear && styles.yearPickerButtonError,
                    ]}
                  >
                    <Text
                      style={[
                        styles.yearPickerText,
                        !formData.carYear && styles.yearPickerPlaceholder,
                      ]}
                    >
                      {formData.carYear || 'Select Year'}
                    </Text>
                  </TouchableOpacity>
                  {errors.carYear && (
                    <Text style={styles.inputError}>{errors.carYear}</Text>
                  )}

                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Engine</Text>
                  <TouchableOpacity
                    onPress={() => setShowEngineModal(true)}
                    style={styles.yearPickerButton}
                  >
                    <Text
                      style={[
                        styles.yearPickerText,
                        !formData.engine && styles.yearPickerPlaceholder,
                      ]}
                    >
                      {formData.engine || 'Select Engine'}
                    </Text>
                  </TouchableOpacity>


                </View>
              </View>
            </View>

            <Button
              title="Continue"
              onPress={handleNextStep1}
              style={styles.continueButton}
            />
          </View>
        )}

        {/* Step 2: Part Details */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconBox}>
                <GearSix size={32} weight="fill" color={colors.brand[500]} />
              </View>
              <Text style={styles.stepTitle}>Part Details</Text>
              <Text style={styles.stepSubtitle}>Describe the part you need</Text>
            </View>

            <View style={styles.formSection}>
              <Input
                label="Part Name *"
                placeholder="e.g., Front Brake Pads, Side Mirror"
                value={formData.partName}
                onChangeText={(v) => updateFormData('partName', v)}
                error={errors.partName}
              />

              <Input
                label="Description"
                placeholder="Any specific details, OEM part numbers, additional requirements..."
                value={formData.description}
                onChangeText={(v) => updateFormData('description', v)}
                multiline
                numberOfLines={3}
                error={errors.description}
              />

              <Text style={styles.inputLabel}>Condition Preference *</Text>
              <View style={styles.conditionGrid}>
                {[
                  { key: 'new', label: 'New', icon: Sparkle },
                  { key: 'used', label: 'Used', icon: Recycle },
                  { key: 'any', label: 'Any', icon: CheckCircle },
                ].map(({ key, label, icon: Icon }) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => updateFormData('condition', key)}
                    style={[
                      styles.conditionButton,
                      formData.condition === key && styles.conditionButtonActive,
                    ]}
                  >
                    <Icon
                      size={20}
                      weight="fill"
                      color={
                        formData.condition === key
                          ? colors.brand[500]
                          : colors.gray[400]
                      }
                    />
                    <Text
                      style={[
                        styles.conditionText,
                        formData.condition === key && styles.conditionTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Budget Range (Optional)</Text>
              <View style={styles.rowInputs}>
                <View style={styles.halfInput}>
                  <Input
                    placeholder="Min L"
                    value={formData.budgetMin}
                    onChangeText={(v) => updateFormData('budgetMin', v)}
                    keyboardType="numeric"
                    leftIcon={<Money size={18} color={colors.gray[400]} />}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Input
                    placeholder="Max L"
                    value={formData.budgetMax}
                    onChangeText={(v) => updateFormData('budgetMax', v)}
                    keyboardType="numeric"
                    leftIcon={<Money size={18} color={colors.gray[400]} />}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Urgency *</Text>
              <View style={styles.conditionGrid}>
                {[
                  { key: 'flexible', label: 'Flexible', icon: Hourglass },
                  { key: 'standard', label: 'Standard', icon: Clock },
                  { key: 'urgent', label: 'Urgent', icon: Lightning },
                ].map(({ key, label, icon: Icon }) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => updateFormData('urgency', key)}
                    style={[
                      styles.conditionButton,
                      formData.urgency === key && styles.conditionButtonActive,
                      key === 'urgent' && formData.urgency === key && styles.urgentButtonActive,
                    ]}
                  >
                    <Icon
                      size={20}
                      weight="fill"
                      color={
                        formData.urgency === key
                          ? key === 'urgent' ? colors.error : colors.brand[500]
                          : colors.gray[400]
                      }
                    />
                    <Text
                      style={[
                        styles.conditionText,
                        formData.urgency === key && styles.conditionTextActive,
                        key === 'urgent' && formData.urgency === key && styles.urgentTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.buttonRow}>
              <Button
                title="Back"
                onPress={() => setStep(1)}
                variant="outline"
                size="medium"
                style={styles.halfButton}
              />
              <Button
                title="Continue"
                onPress={handleNextStep2}
                style={styles.halfButton}
                size="medium"
              />
            </View>
          </View>
        )}

        {/* Step 3: Photos & Submit */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconBox}>
                <Camera size={32} weight="fill" color={colors.brand[500]} />
              </View>
              <Text style={styles.stepTitle}>Add Photos</Text>
              <Text style={styles.stepSubtitle}>
                Help sellers identify your part (max 3)
              </Text>
            </View>

            <View style={styles.formSection}>
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
                  <TouchableOpacity
                    onPress={pickImage}
                    style={styles.addPhotoButton}
                  >
                    <Camera size={24} color={colors.gray[400]} />
                    <Text style={styles.addPhotoText}>Add Photo</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Summary Card */}
              <Card style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <ClipboardText size={18} weight="fill" color={colors.brand[500]} />
                  <Text style={styles.summaryTitle}>Request Summary</Text>
                </View>
                <View style={styles.summaryContent}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Car</Text>
                    <Text style={styles.summaryValue}>
                      {formData.carMake} {formData.carModel} ({formData.carYear})
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Part</Text>
                    <Text style={styles.summaryValue}>{formData.partName}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Condition</Text>
                    <Text style={[styles.summaryValue, { textTransform: 'capitalize' }]}>
                      {formData.condition}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Budget</Text>
                    <Text style={styles.summaryValue}>
                      {formData.budgetMin && formData.budgetMax
                        ? `L${formData.budgetMin} - L${formData.budgetMax}`
                        : formData.budgetMax
                          ? `Up to L${formData.budgetMax}`
                          : formData.budgetMin
                            ? `From L${formData.budgetMin}`
                            : 'Not specified'}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Urgency</Text>
                    <Text style={[styles.summaryValue, { textTransform: 'capitalize' }]}>
                      {formData.urgency}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Photos</Text>
                    <Text style={styles.summaryValue}>
                      {formData.photos.length} attached
                    </Text>
                  </View>
                </View>
              </Card>
            </View>

            <View style={styles.buttonRow}>
              <Button
                title="Back"
                onPress={() => setStep(2)}
                variant="outline"
                style={styles.halfButton}
                size="medium"
              />
              <Button
                title={editMode ? 'Update Request' : 'Submit Request'}
                onPress={handleSubmit}
                loading={isLoading}
                style={styles.halfButton}
                size="medium"
              />
            </View>
          </View>
        )}
      </ScrollView>

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
                    updateFormData('carYear', String(year));
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
                    formData.carYear === String(year) && styles.yearItemActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.yearItemText,
                      formData.carYear === String(year) && styles.yearItemTextActive,
                    ]}
                  >
                    {year}
                  </Text>
                  {formData.carYear === String(year) && (
                    <CheckCircle size={20} weight="fill" color={colors.brand[500]} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* Engine Selection Modal */}
      <Modal
        visible={showEngineModal}
        animationType="none"
        transparent={true}
        onRequestClose={() => {
          Animated.parallel([
            Animated.timing(engineTranslateY, {
              toValue: screenHeight,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(engineBackdropOpacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setShowEngineModal(false);
            setCustomEngine('');
          });
        }}
      >
        <Animated.View
          style={[
            styles.modalOverlay,
            { opacity: engineBackdropOpacity },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => {
              Animated.parallel([
                Animated.timing(engineTranslateY, {
                  toValue: screenHeight,
                  duration: 300,
                  useNativeDriver: true,
                }),
                Animated.timing(engineBackdropOpacity, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: true,
                }),
              ]).start(() => {
                setShowEngineModal(false);
                setCustomEngine('');
              });
            }}
          />
          <Animated.View
            style={[
              styles.modalContent,
              { paddingBottom: insets.bottom + 24 },
              {
                transform: [{ translateY: engineTranslateY }],
              },
            ]}
            {...enginePanResponder.panHandlers}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Engine</Text>
              <TouchableOpacity
                onPress={() => {
                  Animated.parallel([
                    Animated.timing(engineTranslateY, {
                      toValue: screenHeight,
                      duration: 300,
                      useNativeDriver: true,
                    }),
                    Animated.timing(engineBackdropOpacity, {
                      toValue: 0,
                      duration: 300,
                      useNativeDriver: true,
                    }),
                  ]).start(() => {
                    setShowEngineModal(false);
                    setCustomEngine('');
                  });
                }}
              >
                <X size={24} color={colors.gray[600]} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.yearList} showsVerticalScrollIndicator={false}>
              {ENGINE_OPTIONS.map((engine) => (
                <TouchableOpacity
                  key={engine}
                  onPress={() => {
                    updateFormData('engine', engine);
                    Animated.parallel([
                      Animated.timing(engineTranslateY, {
                        toValue: screenHeight,
                        duration: 300,
                        useNativeDriver: true,
                      }),
                      Animated.timing(engineBackdropOpacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                      }),
                    ]).start(() => {
                      setShowEngineModal(false);
                      setCustomEngine('');
                    });
                  }}
                  style={[
                    styles.yearItem,
                    formData.engine === engine && styles.yearItemActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.yearItemText,
                      formData.engine === engine && styles.yearItemTextActive,
                    ]}
                  >
                    {engine}
                  </Text>
                  {formData.engine === engine && (
                    <CheckCircle size={20} weight="fill" color={colors.brand[500]} />
                  )}
                </TouchableOpacity>
              ))}

              {/* Custom Engine Input */}
              <View style={styles.customEngineSection}>
                <Text style={styles.customEngineLabel}>Or enter custom engine:</Text>
                <TextInput
                  style={styles.customEngineInput}
                  placeholder="e.g., 2.0 TDI, 1.6 HDI"
                  value={customEngine}
                  onChangeText={setCustomEngine}
                  onSubmitEditing={() => {
                    if (customEngine.trim()) {
                      updateFormData('engine', customEngine.trim());
                      Animated.parallel([
                        Animated.timing(engineTranslateY, {
                          toValue: screenHeight,
                          duration: 300,
                          useNativeDriver: true,
                        }),
                        Animated.timing(engineBackdropOpacity, {
                          toValue: 0,
                          duration: 300,
                          useNativeDriver: true,
                        }),
                      ]).start(() => {
                        setShowEngineModal(false);
                        setCustomEngine('');
                      });
                    }
                  }}
                />
                <TouchableOpacity
                  style={[
                    styles.customEngineButton,
                    !customEngine.trim() && styles.customEngineButtonDisabled,
                  ]}
                  onPress={() => {
                    if (customEngine.trim()) {
                      updateFormData('engine', customEngine.trim());
                      Animated.parallel([
                        Animated.timing(engineTranslateY, {
                          toValue: screenHeight,
                          duration: 300,
                          useNativeDriver: true,
                        }),
                        Animated.timing(engineBackdropOpacity, {
                          toValue: 0,
                          duration: 300,
                          useNativeDriver: true,
                        }),
                      ]).start(() => {
                        setShowEngineModal(false);
                        setCustomEngine('');
                      });
                    }
                  }}
                  disabled={!customEngine.trim()}
                >
                  <Text style={[
                    styles.customEngineButtonText,
                    !customEngine.trim() && styles.customEngineButtonTextDisabled,
                  ]}>
                    Use Custom
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </Modal>

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
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: colors.brand[500],
  },
  stepNumber: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 14,
    color: colors.gray[400],
  },
  stepNumberActive: {
    color: colors.white,
  },
  stepLine: {
    width: 48,
    height: 4,
    backgroundColor: colors.gray[100],
    marginHorizontal: 8,
    borderRadius: 2,
  },
  stepLineActive: {
    backgroundColor: colors.brand[500],
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stepIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 22,
    color: colors.gray[900],
    marginBottom: 4,
  },
  stepSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.gray[500],
  },
  formSection: {
    marginBottom: 24,
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
  conditionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  conditionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray[200],
    alignItems: 'center',
  },
  conditionButtonActive: {
    borderColor: colors.brand[500],
    backgroundColor: colors.brand[50],
  },
  conditionText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.gray[600],
    marginTop: 4,
  },
  conditionTextActive: {
    color: colors.brand[600],
  },
  urgentButtonActive: {
    borderColor: colors.error,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  urgentTextActive: {
    color: colors.error,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  photoContainer: {
    width: '31%',
    aspectRatio: 1,
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
  addPhotoButton: {
    width: '31%',
    aspectRatio: 1,
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
  summaryCard: {
    backgroundColor: colors.gray[50],
    padding: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.gray[900],
    marginLeft: 8,
  },
  summaryContent: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[500],
  },
  summaryValue: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.gray[900],
  },
  continueButton: {
    marginTop: 174,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 64,
  },
  halfButton: {
    flex: 1,
  },
  makeChipError: {
    borderWidth: 1,
    borderColor: colors.error,
  },
  chipError: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.error,
    marginTop: -8,
    marginBottom: 16,
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
  customEngineSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  customEngineLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.gray[700],
    marginBottom: 8,
  },
  customEngineInput: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: colors.white,
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.gray[900],
    marginBottom: 12,
  },
  customEngineButton: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.brand[500],
    alignItems: 'center',
  },
  customEngineButtonDisabled: {
    backgroundColor: colors.gray[200],
  },
  customEngineButtonText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.white,
  },
  customEngineButtonTextDisabled: {
    color: colors.gray[400],
  },
});

export default CreateRequestScreen;
