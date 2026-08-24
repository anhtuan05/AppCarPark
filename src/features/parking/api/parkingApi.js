import axiosClient from '../../../shared/api/axiosClient';
import { endpoints } from '../../../shared/api/endpoints';

export const parkingService = {
  getParkingLots: async () => {
    const res = await axiosClient.get(endpoints.parkingLot);
    return Array.isArray(res.data) ? res.data : [];
  },

  getParkingSpots: async () => {
    const res = await axiosClient.get(endpoints.parkingSpot);
    return Array.isArray(res.data) ? res.data : [];
  },
};

export default parkingService;
