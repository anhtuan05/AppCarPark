import axiosClient from '../../../shared/api/axiosClient';
import { endpoints } from '../../../shared/api/endpoints';
import {
  listResponseSchema,
  parkingRatingSchema,
  parseResponse,
  revenueDataSchema,
} from '../../../shared/api/contracts';

export const reportService = {
  getRatings: async () => {
    const res = await axiosClient.get(endpoints.parkingRatings);
    return parseResponse(listResponseSchema(parkingRatingSchema), res.data, 'parkingRatings');
  },

  getRevenueData: async () => {
    const res = await axiosClient.get(endpoints.revenueStatistics);
    return parseResponse(revenueDataSchema, res.data, 'revenueStatistics');
  },
};

export default reportService;
