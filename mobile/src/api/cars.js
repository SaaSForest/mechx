import client from './client';
import { ENDPOINTS } from '../config/api';

export const getCars = async (params = {}) => {
  const response = await client.get(ENDPOINTS.CARS, { params });
  return response.data;
};

export const getMyCars = async (status = null) => {
  const params = status ? { status } : {};
  const response = await client.get(ENDPOINTS.MY_CARS, { params });
  return response.data;
};

export const createCar = async (data) => {
  const response = await client.post(ENDPOINTS.CARS, data);
  return response.data;
};

export const getCar = async (id) => {
  const response = await client.get(`${ENDPOINTS.CARS}/${id}`);
  return response.data;
};

export const updateCar = async (id, data) => {
  const response = await client.put(`${ENDPOINTS.CARS}/${id}`, data);
  return response.data;
};

export const deleteCar = async (id) => {
  const response = await client.delete(`${ENDPOINTS.CARS}/${id}`);
  return response.data;
};

export const uploadCarPhoto = async (id, formData, isPrimary = false) => {
  formData.append('is_primary', isPrimary);
  const response = await client.post(
    `${ENDPOINTS.CARS}/${id}/photos`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
};

export const deleteCarPhoto = async (carId, photoId) => {
  const response = await client.delete(
    `${ENDPOINTS.CARS}/${carId}/photos/${photoId}`
  );
  return response.data;
};

export const toggleFeatured = async (id) => {
  const response = await client.post(`${ENDPOINTS.CARS}/${id}/feature`);
  return response.data;
};
