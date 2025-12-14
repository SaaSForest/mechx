import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, ArrowLeft, ShieldCheck, Key } from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';
import { Button, Input } from '../../components/ui';
import { resetPassword } from '../../api/auth';

const ResetPasswordScreen = ({ navigation, route }) => {
  const { email } = route.params || {};
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const slideAnim = useRef(new Animated.Value(20)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!token.trim()) {
      newErrors.token = 'Reset code is required';
    } else if (token.length !== 6) {
      newErrors.token = 'Reset code must be 6 digits';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await resetPassword(token, email, password);
      Alert.alert(
        'Password Reset',
        'Your password has been reset successfully. Please login with your new password.',
        [
          {
            text: 'Go to Login',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password. Please try again.';
      setErrors({ token: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[colors.dark[800], colors.dark[900]]}
      style={styles.container}
    >
      {/* Decorative Elements */}
      <View style={[styles.decorative, styles.decorativeTopRight]} />
      <View style={[styles.decorative, styles.decorativeBottomLeft]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.white} />
          </TouchableOpacity>

          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: opacityAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={[colors.brand[500], colors.brand[400]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconBox}
            >
              <ShieldCheck size={40} weight="fill" color={colors.white} />
            </LinearGradient>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code from your email and create a new password
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: opacityAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Input
              placeholder="6-digit code"
              value={token}
              onChangeText={(text) => {
                // Only allow digits, max 6
                const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6);
                setToken(cleaned);
                if (errors.token) setErrors((prev) => ({ ...prev, token: '' }));
              }}
              keyboardType="number-pad"
              variant="dark"
              icon={<Key size={20} color={colors.gray[400]} />}
              error={errors.token}
              maxLength={6}
            />

            <Input
              placeholder="New password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              }}
              secureTextEntry
              variant="dark"
              icon={<Lock size={20} color={colors.gray[400]} />}
              error={errors.password}
            />

            <Input
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword)
                  setErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }}
              secureTextEntry
              variant="dark"
              icon={<Lock size={20} color={colors.gray[400]} />}
              error={errors.confirmPassword}
            />

            <Button
              title="Reset Password"
              onPress={handleSubmit}
              loading={isLoading}
              style={styles.submitButton}
            />
          </Animated.View>

          {/* Back to Login */}
          <Animated.View
            style={[
              styles.loginContainer,
              {
                opacity: opacityAnim,
              },
            ]}
          >
            <Text style={styles.loginText}>Remember your password?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Back to Login</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decorative: {
    position: 'absolute',
    borderRadius: 999,
  },
  decorativeTopRight: {
    top: 0,
    right: 0,
    width: 288,
    height: 288,
    backgroundColor: colors.brand[500],
    opacity: 0.1,
    transform: [{ translateX: 120 }, { translateY: -120 }],
  },
  decorativeBottomLeft: {
    bottom: 0,
    left: 0,
    width: 192,
    height: 192,
    backgroundColor: colors.brand[500],
    opacity: 0.05,
    transform: [{ translateX: -80 }, { translateY: 80 }],
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 0,
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: colors.brand[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 28,
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.gray[400],
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  formContainer: {
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 16,
  },
  loginContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  loginText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 15,
    color: colors.gray[400],
    marginBottom: 8,
  },
  loginLink: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.brand[500],
  },
});

export default ResetPasswordScreen;
