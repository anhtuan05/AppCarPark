import axiosClient from '../../../shared/api/axiosClient';
import { endpoints } from '../../../shared/api/endpoints';
import {
  listResponseSchema,
  parkingLotSchema,
  parkingSpotSchema,
  parseResponse,
} from '../../../shared/api/contracts';

export const parkingService = {
  getParkingLots: async () => {
    const res = await axiosClient.get(endpoints.parkingLots);
    return parseResponse(listResponseSchema(parkingLotSchema), res.data, 'parkingLots');
  },

  getParkingSpots: async () => {
    const res = await axiosClient.get(endpoints.parkingSpots);
    return parseResponse(listResponseSchema(parkingSpotSchema), res.data, 'parkingSpots');
  },
};

export default parkingService;
