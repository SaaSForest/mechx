import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../config/theme';

const Badge = ({ text, status = 'active', size = 'medium', style }) => {
  const getStatusColors = () => {
    switch (status) {
      case 'active':
      case 'open':
        return { bg: colors.status.active.bg, text: colors.status.active.text };
      case 'pending':
        return { bg: colors.status.pending.bg, text: colors.status.pending.text };
      case 'completed':
        return { bg: colors.status.completed.bg, text: colors.status.completed.text };
      case 'cancelled':
      case 'closed':
      case 'rejected':
        return { bg: colors.status.cancelled.bg, text: colors.status.cancelled.text };
      case 'accepted':
        return { bg: colors.status.accepted.bg, text: colors.status.accepted.text };
      case 'brand':
        return { bg: colors.brand[500], text: colors.white };
      default:
        return { bg: colors.gray[100], text: colors.gray[600] };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: 8, paddingVertical: 4, fontSize: 10 };
      case 'large':
        return { paddingHorizontal: 14, paddingVertical: 8, fontSize: 14 };
      case 'medium':
      default:
        return { paddingHorizontal: 10, paddingVertical: 6, fontSize: 12 };
    }
  };

  const statusColors = getStatusColors();
  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: statusColors.bg,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: statusColors.text,
            fontSize: sizeStyles.fontSize,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: typography.fontFamily.medium,
    textTransform: 'capitalize',
  },
});

export default Badge;
