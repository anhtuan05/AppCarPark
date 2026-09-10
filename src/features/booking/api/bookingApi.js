import axiosClient from '../../../shared/api/axiosClient';
import { endpoints } from '../../../shared/api/endpoints';
import {
  actionResponseSchema,
  bookingSchema,
  listResponseSchema,
  parseResponse,
} from '../../../shared/api/contracts';

export const bookingService = {
  getBookings: async () => {
    const res = await axiosClient.get(endpoints.bookings);
    return parseResponse(listResponseSchema(bookingSchema), res.data, 'bookings');
  },

  createBooking: async (bookingData) => {
    const res = await axiosClient.post(endpoints.bookings, bookingData);
    return parseResponse(actionResponseSchema, res.data, 'bookingAction');
  },
};

export default bookingService;
