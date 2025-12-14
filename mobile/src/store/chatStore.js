import { create } from 'zustand';
import * as conversationsApi from '../api/conversations';

const useChatStore = create((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,
  unreadCount: 0,

  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await conversationsApi.getConversations();
      const data = response.data || response;
      const unreadCount = data.reduce((sum, c) => sum + (c.unread_count || 0), 0);
      set({ conversations: data, unreadCount, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch conversations',
      });
    }
  },

  fetchMessages: async (conversationId, page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await conversationsApi.getMessages(conversationId, page);
      // Backend returns paginated response: { data: [...messages], current_page, ... }
      const messagesData = response.data || response;
      const messagesArray = Array.isArray(messagesData) ? messagesData : [];
      // Messages are returned in ascending order (oldest first) - correct order for chat
      set({
        messages: page === 1 ? messagesArray : [...get().messages, ...messagesArray],
        isLoading: false,
      });
    } catch (error) {
      console.error('fetchMessages error:', error);
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch messages',
      });
    }
  },

  sendMessage: async (conversationId, content) => {
    try {
      const response = await conversationsApi.sendMessage(conversationId, content);
      // Backend returns { message: "Message sent", data: {...message} }
      const newMessage = response.data || response;
      set({ messages: [...get().messages, newMessage] });
      return { success: true };
    } catch (error) {
      console.error('sendMessage error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send message',
      };
    }
  },

  createConversation: async (recipientId, contextType, contextId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await conversationsApi.createConversation(
        recipientId,
        contextType,
        contextId
      );
      return { success: true, data: response.conversation };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create conversation',
      };
    }
  },

  markAsRead: async (conversationId) => {
    try {
      await conversationsApi.markAsRead(conversationId);
      set({
        conversations: get().conversations.map((c) =>
          c.id === conversationId ? { ...c, unread_count: 0 } : c
        ),
      });
    } catch (error) {
      // Silently fail
    }
  },

  addMessage: (message) => {
    set({ messages: [...get().messages, message] });
  },

  setCurrentConversation: (conversation) => {
    set({ currentConversation: conversation, messages: [] });
  },

  clearMessages: () => set({ messages: [] }),
  clearError: () => set({ error: null }),
}));

export default useChatStore;
