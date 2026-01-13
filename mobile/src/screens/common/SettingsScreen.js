import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
  Pressable,
  PanResponder,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CaretLeft,
  Bell,
  Lock,
  Trash,
  CaretRight,
  X,
  Eye,
  EyeSlash,
} from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';
import { Card } from '../../components/ui';
import useAuthStore from '../../store/authStore';
import useSettingsStore from '../../store/settingsStore';
import * as authApi from '../../api/auth';

const SettingsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { logout } = useAuthStore();
  const {
    pushNotificationsEnabled,
    togglePushNotifications,
    loadSettings
  } = useSettingsStore();

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {

        const isTopArea = evt.nativeEvent.pageY < 200;
        return (Math.abs(gestureState.dy) > 10 && gestureState.dy > 0) || isTopArea;
      },
      onPanResponderGrant: () => {

      },
      onPanResponderMove: (_, gestureState) => {

      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 80 || gestureState.vy > 0.3) {
          setPasswordModalVisible(false);
        }
      },
      onPanResponderTerminate: () => {

      },
    })
  ).current;

  useEffect(() => {
    loadSettings();
  }, []);

  const handleTogglePushNotifications = async (value) => {
    await togglePushNotifications(value);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      Alert.alert('Success', 'Password changed successfully');
      setPasswordModalVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to change password'
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setDeleteModalVisible(true),
        },
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    if (!deletePassword) {
      Alert.alert('Error', 'Please enter your password to confirm');
      return;
    }

    setIsDeletingAccount(true);
    try {
      await authApi.deleteAccount(deletePassword);
      Alert.alert('Account Deleted', 'Your account has been deleted', [
        { text: 'OK', onPress: logout },
      ]);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to delete account'
      );
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const renderSectionHeader = (title) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const renderSettingItem = ({
    icon: Icon,
    label,
    onPress,
    value,
    isToggle,
    isDanger,
    rightContent,
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={styles.settingItem}
      disabled={isToggle}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, isDanger && styles.settingIconDanger]}>
          <Icon size={20} color={isDanger ? colors.error : colors.gray[600]} />
        </View>
        <Text style={[styles.settingLabel, isDanger && styles.settingLabelDanger]}>
          {label}
        </Text>
      </View>
      <View style={styles.settingRight}>
        {isToggle ? (
          <Switch
            value={value}
            onValueChange={onPress}
            trackColor={{ false: colors.gray[200], true: colors.brand[400] }}
            thumbColor={value ? colors.brand[500] : colors.gray[100]}
          />
        ) : rightContent ? (
          rightContent
        ) : (
          <CaretRight size={20} color={colors.gray[400]} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          {/* <ArrowLeft size={24} color={colors.gray[900]} /> */}
          <CaretLeft size={24} weight="bold" color={colors.gray[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Notifications Section */}
        {renderSectionHeader('NOTIFICATIONS')}
        <Card padding={0}>
          {renderSettingItem({
            icon: Bell,
            label: 'Push Notifications',
            isToggle: true,
            value: pushNotificationsEnabled,
            onPress: handleTogglePushNotifications,
          })}
        </Card>

        {/* Account Section */}
        {renderSectionHeader('ACCOUNT')}
        <Card padding={0}>
          {renderSettingItem({
            icon: Lock,
            label: 'Change Password',
            onPress: () => setPasswordModalVisible(true),
          })}
          {renderSettingItem({
            icon: Trash,
            label: 'Delete Account',
            onPress: handleDeleteAccount,
            isDanger: true,
          })}
        </Card>

        {/* App Info */}
        {renderSectionHeader('APP INFO')}
        <Card padding={0}>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.versionText}>mechX v1.0.0</Text>
          </View>
        </Card>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        visible={passwordModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setPasswordModalVisible(false)}
        >
          <View
            style={[styles.modalContent, { paddingBottom: insets.bottom + 16 }]}
            {...panResponder.panHandlers}
          >

            {/* <View style={styles.dragHandle} /> */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity
                onPress={() => setPasswordModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color={colors.gray[600]} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  placeholderTextColor={colors.gray[400]}
                  secureTextEntry={!showCurrentPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={styles.eyeButton}
                >
                  {showCurrentPassword ? (
                    <EyeSlash size={20} color={colors.gray[500]} />
                  ) : (
                    <Eye size={20} color={colors.gray[500]} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor={colors.gray[400]}
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeButton}
                >
                  {showNewPassword ? (
                    <EyeSlash size={20} color={colors.gray[500]} />
                  ) : (
                    <Eye size={20} color={colors.gray[500]} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor={colors.gray[400]}
                  secureTextEntry={!showNewPassword}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleChangePassword}
              style={styles.submitButton}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>Change Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        visible={deleteModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Deletion</Text>
              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color={colors.gray[600]} />
              </TouchableOpacity>
            </View>

            <Text style={styles.deleteWarning}>
              Enter your password to permanently delete your account. All your
              data will be lost.
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  value={deletePassword}
                  onChangeText={setDeletePassword}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.gray[400]}
                  secureTextEntry={!showDeletePassword}
                />
                <TouchableOpacity
                  onPress={() => setShowDeletePassword(!showDeletePassword)}
                  style={styles.eyeButton}
                >
                  {showDeletePassword ? (
                    <EyeSlash size={20} color={colors.gray[500]} />
                  ) : (
                    <Eye size={20} color={colors.gray[500]} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={confirmDeleteAccount}
              style={[styles.submitButton, styles.deleteButton]}
              disabled={isDeletingAccount}
            >
              {isDeletingAccount ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>Delete My Account</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

  const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    color: colors.gray[900],
  },
  headerRight: {
    width: 40,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 12,
    color: colors.gray[500],
    marginBottom: 8,
    marginTop: 16,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[50],
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingIconDanger: {
    backgroundColor: '#FEE2E2',
  },
  settingLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 15,
    color: colors.gray[900],
  },
  settingLabelDanger: {
    color: colors.error,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[500],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.gray[300],
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 20,
    color: colors.gray[900],
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.gray[700],
    marginBottom: 8,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  passwordInput: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.gray[900],
    padding: 14,
  },
  eyeButton: {
    padding: 14,
  },
  submitButton: {
    backgroundColor: colors.brand[500],
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.white,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  deleteWarning: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 20,
    lineHeight: 22,
  },
});

export default SettingsScreen;
