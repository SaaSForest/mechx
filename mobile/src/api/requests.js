import client from './client';
import { ENDPOINTS } from '../config/api';

export const getMyRequests = async (status = null) => {
  const params = status ? { status } : {};
  const response = await client.get(ENDPOINTS.PART_REQUESTS, { params });
  return response.data;
};

export const browseRequests = async (search = '') => {
  const params = search ? { search } : {};
  const response = await client.get(ENDPOINTS.BROWSE_REQUESTS, { params });
  return response.data;
};

export const createRequest = async (data) => {
  const response = await client.post(ENDPOINTS.PART_REQUESTS, data);
  return response.data;
};

export const getRequest = async (id) => {
  const response = await client.get(`${ENDPOINTS.PART_REQUESTS}/${id}`);
  return response.data;
};

export const updateRequest = async (id, data) => {
  const response = await client.put(`${ENDPOINTS.PART_REQUESTS}/${id}`, data);
  return response.data;
};

export const deleteRequest = async (id) => {
  const response = await client.delete(`${ENDPOINTS.PART_REQUESTS}/${id}`);
  return response.data;
};

export const uploadRequestPhoto = async (id, formData) => {
  const response = await client.post(
    `${ENDPOINTS.PART_REQUESTS}/${id}/photos`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
};

export const deleteRequestPhoto = async (requestId, photoId) => {
  const response = await client.delete(
    `${ENDPOINTS.PART_REQUESTS}/${requestId}/photos/${photoId}`
  );
  return response.data;
};

export const markRequestComplete = async (id) => {
  const response = await client.post(`${ENDPOINTS.PART_REQUESTS}/${id}/complete`);
  return response.data;
};
