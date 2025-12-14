import client from './client';

export const getSavedItems = async () => {
  const response = await client.get('/saved-items');
  return response.data;
};

export const saveItem = async (type, id) => {
  const response = await client.post('/saved-items', { type, id });
  return response.data;
};

export const unsaveItem = async (type, id) => {
  const response = await client.delete(`/saved-items/${type}/${id}`);
  return response.data;
};

export const checkIfSaved = async (type, id) => {
  const response = await client.get(`/saved-items/check/${type}/${id}`);
  return response.data;
};
