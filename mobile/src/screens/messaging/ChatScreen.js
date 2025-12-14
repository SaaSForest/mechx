import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  DotsThreeVertical,
  PaperPlane,
  Camera,
  Image as ImageIcon,
} from 'phosphor-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography } from '../../config/theme';
import { Avatar } from '../../components/ui';
import useChatStore from '../../store/chatStore';
import useAuthStore from '../../store/authStore';
import { formatRelativeTime, formatTime } from '../../utils/date';

const ChatScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const conversation = route.params?.conversation;

  const { user } = useAuthStore();
  const { messages, fetchMessages, sendMessage } = useChatStore();
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef();

  useEffect(() => {
    if (conversation?.id) {
      fetchMessages(conversation.id);
    }
  }, [conversation?.id]);

  // Handle missing conversation
  if (!conversation) {
    return (
      <View style={[{ flex: 1, paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Conversation not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.brand[500], marginTop: 16 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      await sendMessage(conversation.id, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const renderMessage = ({ item, index }) => {
    const isMe = item.sender_id === user?.id || item.sender_id === 'me';
    const showTime = index === 0 ||
      messages[index - 1]?.sender_id !== item.sender_id;

    return (
      <View style={[styles.messageContainer, isMe && styles.messageContainerMe]}>
        {isMe ? (
          <LinearGradient
            colors={[colors.brand[500], colors.brand[400]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.messageBubble, styles.messageBubbleMe]}
          >
            <Text style={[styles.messageText, styles.messageTextMe]}>
              {item.content}
            </Text>
          </LinearGradient>
        ) : (
          <View style={[styles.messageBubble, styles.messageBubbleOther]}>
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        )}
        {showTime && (
          <Text
            style={[styles.messageTime, isMe && styles.messageTimeMe]}
          >
            {formatTime(item.created_at)}
          </Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.gray[600]} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Avatar
            source={conversation.other_user?.profile_photo_url}
            name={conversation.other_user?.full_name}
            size={40}
          />
          <View style={styles.headerText}>
            <Text style={styles.headerName} numberOfLines={1}>
              {conversation.other_user?.full_name}
            </Text>
            {conversation.context && (
              <Text style={styles.headerStatus} numberOfLines={1}>
                {conversation.context.name}
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <DotsThreeVertical size={24} color={colors.gray[600]} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        inverted={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Input */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity style={styles.attachButton}>
          <Camera size={24} color={colors.gray[500]} />
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.gray[400]}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
          />
          {newMessage.length > 400 && (
            <Text style={[
              styles.charCount,
              newMessage.length >= 500 && styles.charCountMax
            ]}>
              {newMessage.length}/500
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={handleSend}
          disabled={!newMessage.trim()}
          style={[
            styles.sendButton,
            newMessage.trim() && styles.sendButtonActive,
          ]}
        >
          <PaperPlane
            size={22}
            weight="fill"
            color={newMessage.trim() ? colors.white : colors.gray[400]}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  headerName: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.gray[900],
  },
  headerStatus: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.gray[500],
    marginTop: 1,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  messageContainerMe: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  messageBubbleMe: {
    borderBottomRightRadius: 4,
  },
  messageBubbleOther: {
    backgroundColor: colors.gray[100],
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 15,
    color: colors.gray[900],
    lineHeight: 22,
  },
  messageTextMe: {
    color: colors.white,
  },
  messageTime: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 11,
    color: colors.gray[400],
    marginTop: 4,
    marginLeft: 4,
  },
  messageTimeMe: {
    textAlign: 'right',
    marginRight: 4,
    marginLeft: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    backgroundColor: colors.white,
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.gray[50],
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 120,
  },
  input: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.gray[900],
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.brand[500],
  },
  charCount: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 11,
    color: colors.gray[400],
    textAlign: 'right',
    marginTop: 4,
  },
  charCountMax: {
    color: colors.error,
  },
});

export default ChatScreen;
