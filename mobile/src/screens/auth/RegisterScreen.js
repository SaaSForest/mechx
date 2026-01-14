import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  CaretLeft,
  ShoppingCart,
  Storefront,
  Buildings,
  WarningCircle,
} from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../../config/theme';
import { Button, Input, Card } from '../../components/ui';
import useAuthStore from '../../store/authStore';


const RegisterScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [userType, setUserType] = useState('buyer');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirmation: '',
    businessName: '',
    businessAddress: '',
    specialty: '',
    agreeTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const { register } = useAuthStore();
  useFocusEffect(
    React.useCallback(() => {
      RNStatusBar.setBarStyle('light-content', true);
      if (Platform.OS === 'android') {
        RNStatusBar.setBackgroundColor(colors.dark[800], true);
      }
    }, [])
  );

  const updateFormData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.passwordConfirmation) {
      newErrors.passwordConfirmation = 'Please confirm your password';
    } else if (formData.password !== formData.passwordConfirmation) {
      newErrors.passwordConfirmation = 'Passwords do not match';
    }

    if (userType === 'seller') {
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Business name is required';
      }
      if (!formData.businessAddress.trim()) {
        newErrors.businessAddress = 'Business address is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    setApiError('');
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await register({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password_confirmation: formData.passwordConfirmation,
        business_name: formData.businessName,
        business_address: formData.businessAddress,
        user_type: userType,
      });
      if (!result.success) {
        setApiError(result.error);
        if (result.errors) {
          setErrors(prev => ({ ...prev, ...result.errors }));
        }
      }
    } catch (error) {
      setApiError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Header with Gradient */}
      <LinearGradient
        colors={[colors.dark[800], colors.dark[900]]}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.decorative} />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <CaretLeft size={24} color={colors.white} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <Text style={styles.headerSubtitle}>
          Join the mechX community today
        </Text>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Card variant="brand" padding={24} style={styles.formCard}>
            {/* API Error Banner */}
            {apiError && (
              <View style={styles.errorBanner}>
                <WarningCircle size={20} weight="fill" color={colors.error} />
                <Text style={styles.errorBannerText}>{apiError}</Text>
              </View>
            )}

            {/* Account Type Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>I want to</Text>
              <View style={styles.typeGrid}>
                <TouchableOpacity
                  onPress={() => setUserType('buyer')}
                  style={[
                    styles.typeButton,
                    userType === 'buyer' && styles.typeButtonActive,
                  ]}
                >
                  <View
                    style={[
                      styles.typeIcon,
                      userType === 'buyer' && styles.typeIconActive,
                    ]}
                  >
                    <ShoppingCart
                      size={24}
                      weight="fill"
                      color={
                        userType === 'buyer'
                          ? colors.brand[500]
                          : colors.gray[400]
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.typeTitle,
                      userType === 'buyer' && styles.typeTitleActive,
                    ]}
                  >
                    Buy Parts
                  </Text>
                  <Text style={styles.typeSubtitle}>Find car parts</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setUserType('seller')}
                  style={[
                    styles.typeButton,
                    userType === 'seller' && styles.typeButtonActive,
                  ]}
                >
                  <View
                    style={[
                      styles.typeIcon,
                      userType === 'seller' && styles.typeIconActive,
                    ]}
                  >
                    <Storefront
                      size={24}
                      weight="fill"
                      color={
                        userType === 'seller'
                          ? colors.brand[500]
                          : colors.gray[400]
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.typeTitle,
                      userType === 'seller' && styles.typeTitleActive,
                    ]}
                  >
                    Sell Parts
                  </Text>
                  <Text style={styles.typeSubtitle}>List your inventory</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Form Fields */}
            <View style={styles.section}>
              <Input
                label="Full Name *"
                placeholder="John Doe"
                value={formData.fullName}
                onChangeText={(v) => updateFormData('fullName', v)}
                error={errors.fullName}
              />

              <Input
                label="Email *"
                placeholder="john@example.com"
                value={formData.email}
                onChangeText={(v) => updateFormData('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              <Input
                label="Phone *"
                placeholder="+49 123 456 7890"
                value={formData.phone}
                onChangeText={(v) => updateFormData('phone', v)}
                keyboardType="phone-pad"
                error={errors.phone}
              />

              <Input
                label="Password *"
                placeholder="Min. 8 characters"
                value={formData.password}
                onChangeText={(v) => updateFormData('password', v)}
                secureTextEntry
                error={errors.password}
              />

              <Input
                label="Confirm Password *"
                placeholder="Re-enter your password"
                value={formData.passwordConfirmation}
                onChangeText={(v) => updateFormData('passwordConfirmation', v)}
                secureTextEntry
                error={errors.passwordConfirmation}
              />
            </View>

            {/* Seller Additional Fields */}
            {userType === 'seller' && (
              <View style={styles.section}>
                <View style={styles.businessHeader}>
                  <Buildings size={18} weight="fill" color={colors.brand[500]} />
                  <Text style={styles.businessTitle}>Business Information</Text>
                </View>

                <Input
                  label="Business Name *"
                  placeholder="Auto Parts Pro GmbH"
                  value={formData.businessName}
                  onChangeText={(v) => updateFormData('businessName', v)}
                  error={errors.businessName}
                />

                <Input
                  label="Business Address *"
                  placeholder="123 Industrial Street, Berlin"
                  value={formData.businessAddress}
                  onChangeText={(v) => updateFormData('businessAddress', v)}
                  error={errors.businessAddress}
                />
              </View>
            )}

            {/* Terms Checkbox */}
            <TouchableOpacity
              onPress={() => updateFormData('agreeTerms', !formData.agreeTerms)}
              style={styles.termsContainer}
            >
              <View
                style={[
                  styles.checkbox,
                  formData.agreeTerms && styles.checkboxChecked,
                ]}
              >
                {formData.agreeTerms && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={isLoading}
              disabled={!formData.agreeTerms}
              style={styles.submitButton}
            />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    position: 'relative',
    overflow: 'hidden',
  },
  decorative: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: colors.brand[500],
    opacity: 0.1,
    transform: [{ translateX: 40 }, { translateY: -40 }],
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  backText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.white,
    marginLeft: 8,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 24,
    color: colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.gray[400],
  },
  keyboardView: {
    flex: 1,
    marginTop: -16,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  formCard: {
    borderRadius: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 14,
    color: colors.gray[700],
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.gray[200],
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: colors.brand[500],
    backgroundColor: colors.brand[50],
  },
  typeIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  typeIconActive: {
    backgroundColor: colors.brand[100],
  },
  typeTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 15,
    color: colors.gray[600],
    marginBottom: 4,
  },
  typeTitleActive: {
    color: colors.brand[600],
  },
  typeSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.gray[400],
  },
  businessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  businessTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 14,
    color: colors.gray[900],
    marginLeft: 8,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.gray[300],
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.brand[500],
    borderColor: colors.brand[500],
  },
  checkmark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[600],
    lineHeight: 20,
  },
  termsLink: {
    color: colors.brand[500],
    fontFamily: typography.fontFamily.medium,
  },
  submitButton: {
    marginTop: 8,
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

export default RegisterScreen;
