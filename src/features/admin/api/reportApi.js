import axiosClient from '../../../shared/api/axiosClient';
import { endpoints } from '../../../shared/api/endpoints';

export const reportService = {
  getRatings: async () => {
    const res = await axiosClient.get(endpoints.ratings);
    return Array.isArray(res.data) ? res.data : [];
  },

  getRevenueData: async () => {
    const res = await axiosClient.get(endpoints.revenueData);
    return typeof res.data === 'object' && res.data !== null ? res.data : {};
  },
};

export default reportService;
