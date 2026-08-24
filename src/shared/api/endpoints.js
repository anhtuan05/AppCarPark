/**
 * Centralized API endpoints for Carpark application
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://anhtuan05.pythonanywhere.com';

export const endpoints = {
  // Authentication & User
  login: '/o/token/',
  register: '/user/',
  currentUser: '/user/current-user/',
  putUser: '/user/',
  loginWithFace: '/user/login-with-face/',
  faceRecognition: '/user/login-with-face/',

  // Vehicles
  vehicleManagement: '/vehicle/',
  vehicleDetail: (id) => `/vehicle/${id}/`,

  // Parking & Spots
  parkingLot: '/parkinglot/',
  parkingSpot: '/parkingspot/',
  ratings: '/parkinglot/ratings/',

  // Booking
  booking: '/booking/',

  // Subscriptions
  subscriptionType: '/subscription-type/',
  subscription: '/subscription/',
  renewSubscription: (subId) => `/subscription/${subId}/renew-subscription/`,

  // Staff & Entry/Exit
  entryExit: '/parking-history/',

  // Payments & Reports
  payment: '/payment/',
  revenueData: '/payment/revenue_statistics/',

  // Reviews
  reviews: '/reviews/',
  reviewDetail: (id) => `/reviews/${id}/`,

  // Third-party
  plateRecognizer: 'https://api.platerecognizer.com/v1/plate-reader/',
};

// Backward-compatible export for existing legacy callers
export default endpoints;
