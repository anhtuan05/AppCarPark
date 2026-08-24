import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../api/bookingApi';

export const BOOKING_KEYS = {
  all: ['bookings'],
  list: () => [...BOOKING_KEYS.all, 'list'],
};

export const useBookingsQuery = () => {
  return useQuery({
    queryKey: BOOKING_KEYS.list(),
    queryFn: bookingService.getBookings,
  });
};

export const useCreateBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingService.createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_KEYS.list() });
    },
  });
};
