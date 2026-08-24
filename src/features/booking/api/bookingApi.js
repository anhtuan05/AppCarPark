import axiosClient from '../../../shared/api/axiosClient';
import { endpoints } from '../../../shared/api/endpoints';

export const bookingService = {
  getBookings: async () => {
    const res = await axiosClient.get(endpoints.booking);
    return Array.isArray(res.data) ? res.data : [];
  },

  createBooking: async (bookingData) => {
    const res = await axiosClient.post(endpoints.booking, bookingData);
    return res.data;
  },
};

export default bookingService;
