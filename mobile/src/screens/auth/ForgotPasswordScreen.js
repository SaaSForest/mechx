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
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Envelope, CaretLeft, PaperPlaneTilt, CheckCircle } from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';
import { Button, Input } from '../../components/ui';
import { forgotPassword } from '../../api/auth';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
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

  useFocusEffect(
    React.useCallback(() => {
      RNStatusBar.setBarStyle('light-content', true);
      if (Platform.OS === 'android') {
        RNStatusBar.setBackgroundColor(colors.dark[800], true);
      }
    }, [])
  );


  const validateEmail = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError('');
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      await forgotPassword(email);
      setEmailSent(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    navigation.navigate('ResetPassword', { email });
  };

  return (
    <LinearGradient
      colors={[colors.dark[800], colors.dark[900]]}
      style={styles.container}
    >
      <StatusBar style="light" />
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
            <CaretLeft size={24} color={colors.white} />
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
              {emailSent ? (
                <CheckCircle size={40} weight="fill" color={colors.white} />
              ) : (
                <PaperPlaneTilt size={40} weight="fill" color={colors.white} />
              )}
            </LinearGradient>
            <Text style={styles.title}>
              {emailSent ? 'Check Your Email' : 'Forgot Password?'}
            </Text>
            <Text style={styles.subtitle}>
              {emailSent
                ? `We've sent a 6-digit code to ${email}`
                : "Enter your email and we'll send you a code to reset your password"}
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
            {!emailSent ? (
              <>
                <Input
                  placeholder="Email address"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  variant="dark"
                  icon={<Envelope size={20} color={colors.gray[400]} />}
                  error={error}
                />

                <Button
                  title="Send Reset Code"
                  onPress={handleSubmit}
                  loading={isLoading}
                  style={styles.submitButton}
                />
              </>
            ) : (
              <>
                <Button
                  title="Enter Reset Code"
                  onPress={handleContinue}
                  style={styles.submitButton}
                />

                <TouchableOpacity
                  onPress={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  style={styles.resendButton}
                >
                  <Text style={styles.resendText}>
                    Didn't receive the email? Try again
                  </Text>
                </TouchableOpacity>
              </>
            )}
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
  resendButton: {
    alignItems: 'center',
    marginTop: 24,
  },
  resendText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.brand[400],
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

export default ForgotPasswordScreen;
