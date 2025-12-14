import client from './client';
import { ENDPOINTS } from '../config/api';

export const getConversations = async () => {
  const response = await client.get(ENDPOINTS.CONVERSATIONS);
  return response.data;
};

export const createConversation = async (recipientId, contextType, contextId) => {
  const response = await client.post(ENDPOINTS.CONVERSATIONS, {
    recipient_id: recipientId,
    context_type: contextType,
    context_id: contextId,
  });
  return response.data;
};

export const getConversation = async (id) => {
  const response = await client.get(`${ENDPOINTS.CONVERSATIONS}/${id}`);
  return response.data;
};

export const getMessages = async (conversationId, page = 1) => {
  const response = await client.get(
    `${ENDPOINTS.CONVERSATIONS}/${conversationId}/messages`,
    { params: { page } }
  );
  return response.data;
};

export const sendMessage = async (conversationId, content) => {
  const response = await client.post(
    `${ENDPOINTS.CONVERSATIONS}/${conversationId}/messages`,
    { content }
  );
  return response.data;
};

export const markAsRead = async (conversationId) => {
  const response = await client.post(
    `${ENDPOINTS.CONVERSATIONS}/${conversationId}/read`
  );
  return response.data;
};
