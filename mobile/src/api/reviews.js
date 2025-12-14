import client from './client';

export const getUserReviews = async (userId) => {
  const response = await client.get(`/users/${userId}/reviews`);
  return response.data;
};

export const createReview = async (data) => {
  const response = await client.post('/reviews', data);
  return response.data;
};

export const canReviewOffer = async (offerId) => {
  const response = await client.get(`/offers/${offerId}/can-review`);
  return response.data;
};
