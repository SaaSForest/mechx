import client from './client';
import { ENDPOINTS } from '../config/api';

export const getOffers = async (status = null) => {
  const params = status ? { status } : {};
  const response = await client.get(ENDPOINTS.OFFERS, { params });
  return response.data;
};

export const getMyOffers = async (status = null) => {
  const params = status ? { status } : {};
  const response = await client.get(ENDPOINTS.MY_OFFERS, { params });
  return response.data;
};

export const createOffer = async (data) => {
  const response = await client.post(ENDPOINTS.OFFERS, data);
  return response.data;
};

export const getOffer = async (id) => {
  const response = await client.get(`${ENDPOINTS.OFFERS}/${id}`);
  return response.data;
};

export const updateOffer = async (id, data) => {
  const response = await client.put(`${ENDPOINTS.OFFERS}/${id}`, data);
  return response.data;
};

export const withdrawOffer = async (id) => {
  const response = await client.delete(`${ENDPOINTS.OFFERS}/${id}`);
  return response.data;
};

export const acceptOffer = async (id) => {
  const response = await client.post(`${ENDPOINTS.OFFERS}/${id}/accept`);
  return response.data;
};

export const rejectOffer = async (id) => {
  const response = await client.post(`${ENDPOINTS.OFFERS}/${id}/reject`);
  return response.data;
};

export const uploadOfferPhoto = async (id, formData) => {
  const response = await client.post(
    `${ENDPOINTS.OFFERS}/${id}/photos`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
};
