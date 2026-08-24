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

      if (url.includes(endpoints.parkingLot) && method === 'get') {
        return { data: mockParkingLots, status: 200, statusText: 'OK (Mock)' };
      }
      if (url.includes(endpoints.parkingSpot) && method === 'get') {
        return { data: mockParkingSpots, status: 200, statusText: 'OK (Mock)' };
      }
      if (url.includes(endpoints.subscriptionType) && method === 'get') {
        return { data: mockSubscriptionTypes, status: 200, statusText: 'OK (Mock)' };
      }
      if (url.includes(endpoints.vehicleManagement) && method === 'get') {
        return { data: mockVehicles, status: 200, statusText: 'OK (Mock)' };
      }
      if (url.includes(endpoints.booking) && method === 'get') {
        return { data: mockBookings, status: 200, statusText: 'OK (Mock)' };
      }
      if (url.includes(endpoints.subscription) && method === 'get') {
        return { data: mockSubscriptions, status: 200, statusText: 'OK (Mock)' };
      }
      if (url.includes(endpoints.reviews) && method === 'get') {
        return { data: mockReviews, status: 200, statusText: 'OK (Mock)' };
      }
      if (url.includes(endpoints.revenueData) && method === 'get') {
        return { data: mockRevenueData, status: 200, statusText: 'OK (Mock)' };
      }
      if (url.includes(endpoints.ratings) && method === 'get') {
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
