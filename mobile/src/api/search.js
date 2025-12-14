import client from './client';
import { ENDPOINTS } from '../config/api';

export const search = async (query, type = null) => {
  const params = { q: query };
  if (type) params.type = type;
  const response = await client.get(ENDPOINTS.SEARCH, { params });
  return response.data;
};

export const searchCars = async (query) => {
  const response = await client.get(`${ENDPOINTS.SEARCH}/cars`, {
    params: { q: query },
  });
  return response.data;
};

export const searchParts = async (query) => {
  const response = await client.get(`${ENDPOINTS.SEARCH}/parts`, {
    params: { q: query },
  });
  return response.data;
};

export const searchSellers = async (query) => {
  const response = await client.get(`${ENDPOINTS.SEARCH}/sellers`, {
    params: { q: query },
  });
  return response.data;
};
