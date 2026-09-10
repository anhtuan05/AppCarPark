/**
 * Centralized API endpoints for Carpark application
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://anhtuan05.pythonanywhere.com';

export const endpoints = {
  // Authentication & User
  oauthToken: '/o/token/',
  users: '/user/',
  currentUser: '/user/current-user/',
  userProfile: '/user/',
  faceLogin: '/user/login-with-face/',

  // Vehicles
  vehicles: '/vehicle/',
  vehicleById: (id) => `/vehicle/${id}/`,

  // Parking & Spots
  parkingLots: '/parkinglot/',
  parkingSpots: '/parkingspot/',
  parkingRatings: '/parkinglot/ratings/',

  // Booking
  bookings: '/booking/',

  // Subscriptions
  subscriptionTypes: '/subscription-type/',
  subscriptions: '/subscription/',
  renewSubscription: (subId) => `/subscription/${subId}/renew-subscription/`,

  // Staff & Entry/Exit
  parkingHistory: '/parking-history/',

  // Payments & Reports
  payments: '/payment/',
  revenueStatistics: '/payment/revenue_statistics/',

  // Reviews
  reviews: '/reviews/',
  reviewById: (id) => `/reviews/${id}/`,

  // Third-party
  plateRecognition: 'https://api.platerecognizer.com/v1/plate-reader/',
};
export default endpoints;
