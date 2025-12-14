import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../config/theme';

const Avatar = ({
  source,
  name,
  size = 48,
  showOnline = false,
  isOnline = false,
  style,
}) => {
  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const names = fullName.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const onlineIndicatorSize = size * 0.25;
  const fontSize = size * 0.4;

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {source ? (
        <Image
          source={typeof source === 'string' ? { uri: source } : source}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size * 0.3,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: size,
              height: size,
              borderRadius: size * 0.3,
            },
          ]}
        >
          <Text style={[styles.initials, { fontSize }]}>{getInitials(name)}</Text>
        </View>
      )}
      {showOnline && (
        <View
          style={[
            styles.onlineIndicator,
            {
              width: onlineIndicatorSize,
              height: onlineIndicatorSize,
              borderRadius: onlineIndicatorSize / 2,
              backgroundColor: isOnline ? colors.success : colors.gray[400],
              borderWidth: size * 0.04,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    backgroundColor: colors.gray[100],
  },
  placeholder: {
    backgroundColor: colors.brand[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: typography.fontFamily.semiBold,
    color: colors.brand[500],
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderColor: colors.white,
  },
});

export default Avatar;
