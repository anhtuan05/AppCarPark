import { useQuery } from '@tanstack/react-query';
import { parkingService } from '../api/parkingApi';

export const PARKING_KEYS = {
  all: ['parking'],
  lots: () => [...PARKING_KEYS.all, 'lots'],
  spots: () => [...PARKING_KEYS.all, 'spots'],
};

export const useParkingLotsQuery = () => {
  return useQuery({
    queryKey: PARKING_KEYS.lots(),
    queryFn: parkingService.getParkingLots,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
};

export const useParkingSpotsQuery = () => {
  return useQuery({
    queryKey: PARKING_KEYS.spots(),
    queryFn: parkingService.getParkingSpots,
    staleTime: 1000 * 30, // 30 secs for dynamic spot occupancy
    refetchInterval: 1000 * 30, // Poll every 30 secs
  });
};
