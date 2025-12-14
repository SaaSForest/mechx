// API Configuration

// For local development, use your computer's IP address
// Replace with your actual IP when testing on physical device
// export const API_BASE_URL = 'http://localhost:8000/api';

// For production, this would be your VPS URL
export const API_BASE_URL = 'https://mechx.al/api';

// Laravel Reverb WebSocket configuration
export const REVERB_HOST = 'localhost';
export const REVERB_PORT = 8080;
export const REVERB_KEY = 'mechx-reverb-key';
export const REVERB_SCHEME = 'http';

// API Endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  USER: '/user',
  UPDATE_PROFILE: '/user',
  UPLOAD_PHOTO: '/user/photo',
  UPDATE_PUSH_TOKEN: '/user/push-token',

  // Dashboard
  BUYER_DASHBOARD: '/dashboard/buyer',
  SELLER_DASHBOARD: '/dashboard/seller',

  // Part Requests
  PART_REQUESTS: '/part-requests',
  BROWSE_REQUESTS: '/browse-requests',

  // Offers
  OFFERS: '/offers',
  MY_OFFERS: '/my-offers',

  // Car Listings
  CARS: '/cars',
  MY_CARS: '/my-cars',

  // Conversations & Messages
  CONVERSATIONS: '/conversations',

  // Notifications
  NOTIFICATIONS: '/notifications',

  // Search
  SEARCH: '/search',
};
