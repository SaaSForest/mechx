import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { StatusBar as RNStatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatCircleDots } from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';
import { Avatar } from '../../components/ui';
import { EmptyState } from '../../components/shared';
import useChatStore from '../../store/chatStore';
import { formatRelativeTime } from '../../utils/date';

  const ConversationsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { conversations, fetchConversations, isLoading } = useChatStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      RNStatusBar.setBarStyle('dark-content', true);
      if (Platform.OS === 'android') {
        RNStatusBar.setBackgroundColor(colors.white, true);
      }
    }, [])
  );
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchConversations();
    setRefreshing(false);
  };

  // Use real data from store
  const renderConversationItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Chat', { conversation: item })}
      style={styles.conversationItem}
    >
      <View style={styles.avatarContainer}>
        <Avatar
          source={item.other_user?.profile_photo_url}
          name={item.other_user?.full_name}
          size={56}
        />
      </View>
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.participantName} numberOfLines={1}>
            {item.other_user?.full_name}
          </Text>
          <Text
            style={[
              styles.timestamp,
              item.unread_count > 0 && styles.timestampUnread,
            ]}
          >
            {formatRelativeTime(item.last_message?.created_at || item.updated_at)}
          </Text>
        </View>
        <View style={styles.conversationFooter}>
          <Text
            style={[
              styles.lastMessage,
              item.unread_count > 0 && styles.lastMessageUnread,
            ]}
            numberOfLines={1}
          >
            {item.last_message?.content || 'No messages yet'}
          </Text>
          {item.unread_count > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unread_count}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {/* Conversations List */}
      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
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
            icon={<ChatCircleDots size={40} color={colors.gray[400]} />}
            title="No conversations yet"
            description="Start a conversation with a seller or buyer"
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 23,
    color: colors.gray[900],
  },
  listContent: {
    paddingBottom: 100,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.gray[900],
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.gray[400],
  },
  timestampUnread: {
    color: colors.brand[500],
    fontFamily: typography.fontFamily.medium,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[500],
    flex: 1,
    marginRight: 8,
  },
  lastMessageUnread: {
    fontFamily: typography.fontFamily.medium,
    color: colors.gray[900],
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.brand[500],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 12,
    color: colors.white,
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray[100],
    marginLeft: 96,
  },
});

export default ConversationsScreen;
