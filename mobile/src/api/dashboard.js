import client from './client';
import { ENDPOINTS } from '../config/api';

export const getBuyerDashboard = async () => {
  const response = await client.get(ENDPOINTS.BUYER_DASHBOARD);
  return response.data;
};

export const getSellerDashboard = async () => {
  const response = await client.get(ENDPOINTS.SELLER_DASHBOARD);
  return response.data;
};
