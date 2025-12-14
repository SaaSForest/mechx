import client from './client';
import { ENDPOINTS } from '../config/api';

export const login = async (email, password) => {
  const response = await client.post(ENDPOINTS.LOGIN, { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await client.post(ENDPOINTS.REGISTER, userData);
  return response.data;
};

export const logout = async () => {
  const response = await client.post(ENDPOINTS.LOGOUT);
  return response.data;
};

export const getUser = async () => {
  const response = await client.get(ENDPOINTS.USER);
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await client.put(ENDPOINTS.UPDATE_PROFILE, data);
  return response.data;
};

export const uploadPhoto = async (formData) => {
  const response = await client.post(ENDPOINTS.UPLOAD_PHOTO, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updatePushToken = async (token) => {
  const response = await client.post(ENDPOINTS.UPDATE_PUSH_TOKEN, {
    expo_push_token: token,
  });
  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await client.post('/auth/change-password', {
    current_password: currentPassword,
    new_password: newPassword,
    new_password_confirmation: newPassword,
  });
  return response.data;
};

export const deleteAccount = async (password) => {
  const response = await client.delete('/auth/account', {
    data: { password },
  });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await client.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token, email, password) => {
  const response = await client.post('/auth/reset-password', {
    token,
    email,
    password,
    password_confirmation: password,
  });
  return response.data;
};

export const getBuyerDashboard = async () => {
  const response = await client.get(ENDPOINTS.BUYER_DASHBOARD);
  return response.data;
};

export const getSellerDashboard = async () => {
  const response = await client.get(ENDPOINTS.SELLER_DASHBOARD);
  return response.data;
};
