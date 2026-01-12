import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  // ArrowLeft,
  CaretLeft,
  Bell,
  Tag,
  ChatCircleDots,
  Car,
  CheckCircle,
  Warning,
} from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';
import { Avatar } from '../../components/ui';
import { EmptyState } from '../../components/shared';
import useNotificationStore from '../../store/notificationStore';
import { formatRelativeTime } from '../../utils/date';

const NotificationsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { notifications, fetchNotifications, markAsRead, markAllAsRead, isLoading } = useNotificationStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  // Use real data from store

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'offer':
        return <Tag size={22} weight="fill" color={colors.brand[500]} />;
      case 'message':
        return <ChatCircleDots size={22} weight="fill" color={colors.success} />;
      case 'accepted':
        return <CheckCircle size={22} weight="fill" color={colors.success} />;
      case 'car':
        return <Car size={22} weight="fill" color={colors.status.completed.text} />;
      case 'reminder':
        return <Warning size={22} weight="fill" color={colors.status.pending.text} />;
      default:
        return <Bell size={22} weight="fill" color={colors.gray[400]} />;
    }
  };

  const handleNotificationPress = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    // Navigate based on notification type
    switch (notification.type) {
      case 'offer':
        navigation.navigate('Home', { screen: 'RequestDetail' });
        break;
      case 'message':
        navigation.navigate('Messages');
        break;
      case 'car':
        navigation.navigate('Home', { screen: 'CarDetail' });
        break;
      default:
        break;
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleNotificationPress(item)}
      style={[
        styles.notificationItem,
        !item.is_read && styles.notificationItemUnread,
      ]}
    >
      <View style={styles.notificationIcon}>
        {item.data?.sender_photo ? (
          <Avatar source={item.data.sender_photo} name="" size={48} />
        ) : (
          <View style={styles.iconContainer}>
            {getNotificationIcon(item.type)}
          </View>
        )}
      </View>
      <View style={styles.notificationContent}>
        <Text
          style={[
            styles.notificationTitle,
            !item.is_read && styles.notificationTitleUnread,
          ]}
        >
          {item.title}
        </Text>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.notificationTime}>{formatRelativeTime(item.created_at)}</Text>
      </View>
      {!item.is_read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          {/* <ArrowLeft size={24} color={colors.gray[600]} /> */}
           <CaretLeft size={24} weight="bold" color={colors.gray[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
        {unreadCount === 0 && <View style={styles.headerSpacer} />}
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.brand[500]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon={<Bell size={40} color={colors.gray[400]} />}
            title="No notifications"
            description="You're all caught up! Check back later for updates."
          />
        }
      />
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
    paddingHorizontal: 24,
    paddingVertical: 16,
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
  headerSpacer: {
    width: 80,
  },
  markAllText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.brand[500],
  },
  listContent: {
    paddingBottom: 100,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[50],
    position: 'relative',
  },
  notificationItemUnread: {
    backgroundColor: colors.brand[50],
  },
  notificationIcon: {
    marginRight: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 15,
    color: colors.gray[700],
    marginBottom: 4,
  },
  notificationTitleUnread: {
    fontFamily: typography.fontFamily.semiBold,
    color: colors.gray[900],
  },
  notificationMessage: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[500],
    lineHeight: 20,
    marginBottom: 6,
  },
  notificationTime: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.gray[400],
  },
  unreadDot: {
    position: 'absolute',
    top: 20,
    right: 24,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.brand[500],
  },
});

export default NotificationsScreen;
