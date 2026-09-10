import axios from 'axios';
import { API_BASE_URL, endpoints } from './endpoints';
import tokenStorage from './tokenStorage';
import {
  mockParkingLots,
  mockParkingSpots,
  mockSubscriptionTypes,
  mockVehicles,
  mockBookings,
  mockSubscriptions,
  mockReviews,
  mockRevenueData,
  mockRatingsData,
} from './mockData';

const isMockEnabled = import.meta.env.VITE_USE_MOCK_API === 'true';

// Base Axios instance
export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Request Interceptor: Attach Bearer Token automatically
axiosClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle response & Mock fallback if enabled
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Optional Mock fallback if enabled or backend unreachable in dev
    if (isMockEnabled && originalRequest) {
      const url = originalRequest.url || '';
      const method = (originalRequest.method || 'get').toLowerCase();
      const requestPath = new URL(url, API_BASE_URL).pathname;
      const matchesEndpoint = (endpoint) => requestPath === new URL(endpoint, API_BASE_URL).pathname;

      if (matchesEndpoint(endpoints.parkingLots) && method === 'get') {
        return { data: mockParkingLots, status: 200, statusText: 'OK (Mock)' };
      }
      if (matchesEndpoint(endpoints.parkingSpots) && method === 'get') {
        return { data: mockParkingSpots, status: 200, statusText: 'OK (Mock)' };
      }
      if (matchesEndpoint(endpoints.subscriptionTypes) && method === 'get') {
        return { data: mockSubscriptionTypes, status: 200, statusText: 'OK (Mock)' };
      }
      if (matchesEndpoint(endpoints.vehicles) && method === 'get') {
        return { data: mockVehicles, status: 200, statusText: 'OK (Mock)' };
      }
      if (matchesEndpoint(endpoints.bookings) && method === 'get') {
        return { data: mockBookings, status: 200, statusText: 'OK (Mock)' };
      }
      if (matchesEndpoint(endpoints.subscriptions) && method === 'get') {
        return { data: mockSubscriptions, status: 200, statusText: 'OK (Mock)' };
      }
      if (matchesEndpoint(endpoints.reviews) && method === 'get') {
        return { data: mockReviews, status: 200, statusText: 'OK (Mock)' };
      }
      if (matchesEndpoint(endpoints.revenueStatistics) && method === 'get') {
        return { data: mockRevenueData, status: 200, statusText: 'OK (Mock)' };
      }
      if (matchesEndpoint(endpoints.parkingRatings) && method === 'get') {
        return { data: mockRatingsData, status: 200, statusText: 'OK (Mock)' };
      }
    }

    return Promise.reject(error);
  }
);

// Helper for dynamic auth api if an explicit token is provided
export const authApi = (explicitToken) => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${explicitToken || tokenStorage.getAccessToken()}`,
    },
  });
};

export default axiosClient;
