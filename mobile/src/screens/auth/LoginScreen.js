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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Engine, Envelope, Lock, Info, WarningCircle } from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';
import { Button, Input } from '../../components/ui';
import useAuthStore from '../../store/authStore';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('demo@mechx.app');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const { login } = useAuthStore();

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

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setApiError('');
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        setApiError(result.error);
      }
    } catch (error) {
      setApiError('An unexpected error occurred');
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
          {/* Logo & Welcome */}
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
              style={styles.logoBox}
            >
              <Engine size={40} weight="fill" color={colors.white} />
            </LinearGradient>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign in to your mechX account
            </Text>
          </Animated.View>

          {/* API Error Banner */}
          {apiError && (
            <Animated.View
              style={[
                styles.errorBanner,
                {
                  opacity: opacityAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <WarningCircle size={20} weight="fill" color={colors.error} />
              <Text style={styles.errorBannerText}>{apiError}</Text>
            </Animated.View>
          )}

          {/* Login Form */}
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
              placeholder="Email address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                if (apiError) setApiError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              variant="dark"
              icon={<Envelope size={20} color={colors.gray[400]} />}
              error={errors.email}
            />

            <Input
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                if (apiError) setApiError('');
              }}
              secureTextEntry
              variant="dark"
              icon={<Lock size={20} color={colors.gray[400]} />}
              error={errors.password}
            />

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.signInButton}
            />
          </Animated.View>

          {/* Demo Note */}
          <Animated.View
            style={[
              styles.demoNote,
              {
                opacity: opacityAnim,
              },
            ]}
          >
            <View style={styles.demoNoteContent}>
              <Info size={20} weight="fill" color={colors.brand[400]} />
              <View style={styles.demoNoteText}>
                <Text style={styles.demoNoteTitle}>Demo Mode</Text>
                <Text style={styles.demoNoteDescription}>
                  Credentials are pre-filled. Just click Sign In to explore the
                  app.
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Register Link */}
          <Animated.View
            style={[
              styles.registerContainer,
              {
                opacity: opacityAnim,
              },
            ]}
          >
            <Text style={styles.registerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Create Account</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBox: {
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
  welcomeTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 28,
    color: colors.white,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.gray[400],
  },
  formContainer: {
    marginBottom: 24,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 24,
  },
  forgotText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.brand[400],
  },
  signInButton: {
    marginTop: 8,
  },
  demoNote: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  demoNoteContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  demoNoteText: {
    flex: 1,
    marginLeft: 12,
  },
  demoNoteTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.white,
    marginBottom: 4,
  },
  demoNoteDescription: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[400],
    lineHeight: 20,
  },
  registerContainer: {
    alignItems: 'center',
  },
  registerText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 15,
    color: colors.gray[400],
    marginBottom: 8,
  },
  registerLink: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.brand[500],
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
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

export default LoginScreen;
