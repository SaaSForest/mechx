import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Eye, EyeSlash } from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  icon,
  error,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  style,
  inputStyle,
  variant = 'light',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isDark = variant === 'dark';

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, isDark && styles.labelDark]}>{label}</Text>
      )}
      <View
        style={[
          styles.inputContainer,
          isDark && styles.inputContainerDark,
          error && styles.inputContainerError,
          multiline && styles.inputContainerMultiline,
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={[
            styles.input,
            isDark && styles.inputDark,
            icon && styles.inputWithIcon,
            multiline && styles.inputMultiline,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={isDark ? colors.gray[500] : colors.gray[400]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            {showPassword ? (
              <EyeSlash size={20} color={colors.gray[400]} />
            ) : (
              <Eye size={20} color={colors.gray[400]} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.gray[700],
    marginBottom: 8,
  },
  labelDark: {
    color: colors.gray[400],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  inputContainerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputContainerFocused: {
    borderColor: colors.brand[500],
    backgroundColor: colors.white,
    shadowColor: colors.brand[500],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  inputContainerMultiline: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.gray[900],
    paddingVertical: 14,
  },
  inputDark: {
    color: colors.white,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  inputMultiline: {
    minHeight: 80,
    paddingTop: 0,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  errorText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.error,
    marginTop: 6,
  },
});

export default Input;
