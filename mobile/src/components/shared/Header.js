import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, X, DotsThreeVertical } from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';

const Header = ({
  title,
  onBack,
  onClose,
  rightAction,
  rightIcon,
  variant = 'light',
  showBorder = true,
  transparent = false,
}) => {
  const insets = useSafeAreaInsets();
  const isDark = variant === 'dark';

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
        isDark && styles.containerDark,
        transparent && styles.containerTransparent,
        showBorder && !transparent && styles.containerBorder,
      ]}
    >
      <View style={styles.content}>
        {/* Left Action */}
        <View style={styles.leftAction}>
          {onBack && (
            <TouchableOpacity
              onPress={onBack}
              style={[styles.iconButton, isDark && styles.iconButtonDark]}
            >
              <ArrowLeft
                size={24}
                color={isDark ? colors.white : colors.gray[600]}
              />
            </TouchableOpacity>
          )}
          {onClose && (
            <TouchableOpacity
              onPress={onClose}
              style={[styles.iconButton, isDark && styles.iconButtonDark]}
            >
              <X size={24} color={isDark ? colors.white : colors.gray[600]} />
            </TouchableOpacity>
          )}
        </View>

        {/* Title */}
        <Text
          style={[styles.title, isDark && styles.titleDark]}
          numberOfLines={1}
        >
          {title}
        </Text>

        {/* Right Action */}
        <View style={styles.rightAction}>
          {rightAction && (
            <TouchableOpacity
              onPress={rightAction}
              style={[styles.iconButton, isDark && styles.iconButtonDark]}
            >
              {rightIcon || (
                <DotsThreeVertical
                  size={24}
                  color={isDark ? colors.white : colors.gray[600]}
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  containerDark: {
    backgroundColor: colors.dark[800],
  },
  containerTransparent: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  containerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftAction: {
    width: 44,
    alignItems: 'flex-start',
  },
  rightAction: {
    width: 44,
    alignItems: 'flex-end',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    flex: 1,
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    color: colors.gray[900],
    textAlign: 'center',
  },
  titleDark: {
    color: colors.white,
  },
});

export default Header;
