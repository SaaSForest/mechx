import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, shadows } from '../../config/theme';

const Card = ({
  children,
  onPress,
  variant = 'default',
  padding = 16,
  style,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'brand':
        return styles.cardBrand;
      case 'elevated':
        return styles.cardElevated;
      default:
        return styles.cardDefault;
    }
  };

  const content = (
    <View style={[styles.card, getVariantStyle(), { padding }, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.95}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
  },
  cardDefault: {
    shadowColor: colors.dark[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardBrand: {
    shadowColor: colors.brand[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  cardElevated: {
    shadowColor: colors.dark[900],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 12,
  },
});

export default Card;
