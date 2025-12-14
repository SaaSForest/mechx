import client from './client';
import { ENDPOINTS } from '../config/api';

export const getNotifications = async (page = 1) => {
  const response = await client.get(ENDPOINTS.NOTIFICATIONS, {
    params: { page },
  });
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await client.get(`${ENDPOINTS.NOTIFICATIONS}/unread-count`);
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await client.post(`${ENDPOINTS.NOTIFICATIONS}/${id}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await client.post(`${ENDPOINTS.NOTIFICATIONS}/read-all`);
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await client.delete(`${ENDPOINTS.NOTIFICATIONS}/${id}`);
  return response.data;
};
