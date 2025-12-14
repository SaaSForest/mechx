import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Engine } from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';

const SplashScreen = ({ navigation }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Bounce-in animation for logo
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Pulsing animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Bouncing dots animation
    const animateDots = () => {
      Animated.loop(
        Animated.stagger(150, [
          Animated.sequence([
            Animated.timing(dot1Anim, {
              toValue: -8,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(dot1Anim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(dot2Anim, {
              toValue: -8,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(dot2Anim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(dot3Anim, {
              toValue: -8,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(dot3Anim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };
    animateDots();

    // Navigate to login after delay
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  const pulseScale = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  return (
    <LinearGradient
      colors={[colors.dark[800], colors.dark[900]]}
      style={styles.container}
    >
      {/* Decorative Elements */}
      <View style={[styles.decorative, styles.decorativeTop]} />
      <View style={[styles.decorative, styles.decorativeBottom]} />

      {/* Logo Container */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo Box with Gradient */}
        <Animated.View style={{ transform: [{ scale: pulseScale }] }}>
          <LinearGradient
            colors={[colors.brand[500], colors.brand[400]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoBox}
          >
            <Engine size={64} weight="fill" color={colors.white} />
          </LinearGradient>
          {/* Glow Effect */}
          <View style={styles.logoGlow} />
        </Animated.View>

        {/* Brand Name */}
        <Text style={styles.brandName}>
          mech<Text style={styles.brandX}>X</Text>
        </Text>
        <Text style={styles.tagline}>Find Parts. Sell Cars. Connect.</Text>
      </Animated.View>

      {/* Loading Dots */}
      <View style={styles.dotsContainer}>
        <Animated.View
          style={[styles.dot, { transform: [{ translateY: dot1Anim }] }]}
        />
        <Animated.View
          style={[styles.dot, { transform: [{ translateY: dot2Anim }] }]}
        />
        <Animated.View
          style={[styles.dot, { transform: [{ translateY: dot3Anim }] }]}
        />
      </View>

      {/* Version */}
      <Text style={styles.version}>Version 1.0.0</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorative: {
    position: 'absolute',
    borderRadius: 999,
  },
  decorativeTop: {
    top: 80,
    left: 40,
    width: 80,
    height: 80,
    backgroundColor: colors.brand[500],
    opacity: 0.1,
  },
  decorativeBottom: {
    bottom: 128,
    right: 40,
    width: 128,
    height: 128,
    backgroundColor: colors.brand[500],
    opacity: 0.1,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoBox: {
    width: 112,
    height: 112,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.brand[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
  },
  logoGlow: {
    position: 'absolute',
    top: -12,
    left: -12,
    right: -12,
    bottom: -12,
    borderRadius: 32,
    backgroundColor: colors.brand[500],
    opacity: 0.2,
  },
  brandName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 48,
    color: colors.white,
    marginTop: 32,
    letterSpacing: -1,
  },
  brandX: {
    color: colors.brand[500],
  },
  tagline: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 18,
    color: colors.gray[400],
    marginTop: 8,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 96,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.brand[500],
  },
  version: {
    position: 'absolute',
    bottom: 32,
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[600],
  },
});

export default SplashScreen;
