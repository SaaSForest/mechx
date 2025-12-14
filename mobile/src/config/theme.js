// Design tokens extracted from prototype.html

export const colors = {
  brand: {
    50: '#FFF5F0',
    100: '#FFEBE0',
    200: '#FFD4BD',
    300: '#FFBA94',
    400: '#FF8C42',
    500: '#FF5500',
    600: '#E64D00',
    700: '#CC4400',
    800: '#993300',
    900: '#662200',
  },
  dark: {
    700: '#2D2D2D',
    800: '#1A1A1A',
    900: '#0D0D0D',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  status: {
    active: { bg: '#ECFDF5', text: '#059669' },
    pending: { bg: '#FEF3C7', text: '#D97706' },
    completed: { bg: '#EFF6FF', text: '#2563EB' },
    cancelled: { bg: '#FEF2F2', text: '#DC2626' },
    accepted: { bg: '#ECFDF5', text: '#059669' },
    rejected: { bg: '#FEF2F2', text: '#DC2626' },
  },
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',
  info: '#2563EB',
  white: '#FFFFFF',
  black: '#000000',
};

export const typography = {
  fontFamily: {
    regular: 'DMSans-Regular',
    medium: 'DMSans-Medium',
    semiBold: 'DMSans-SemiBold',
    bold: 'DMSans-Bold',
  },
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 32,
    '5xl': 48,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const shadows = {
  card: {
    shadowColor: '#FF5500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  cardSm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardLg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 12,
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};
