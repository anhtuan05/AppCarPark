import axiosClient from '../../../shared/api/axiosClient';
import { endpoints } from '../../../shared/api/endpoints';

export const reviewService = {
  getReviews: async () => {
    const res = await axiosClient.get(endpoints.reviews);
    return Array.isArray(res.data) ? res.data : [];
  },

  createReview: async (reviewData) => {
    const res = await axiosClient.post(endpoints.reviews, reviewData);
    return res.data;
  },

  updateReview: async (id, reviewData) => {
    const res = await axiosClient.put(endpoints.reviewDetail(id), reviewData);
    return res.data;
  },

  deleteReview: async (id) => {
    const res = await axiosClient.delete(endpoints.reviewDetail(id));
    return res.data;
  },
};

export default reviewService;
