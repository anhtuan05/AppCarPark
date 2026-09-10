import axiosClient from '../../../shared/api/axiosClient';
import { endpoints } from '../../../shared/api/endpoints';
import { listResponseSchema, parseResponse, reviewSchema } from '../../../shared/api/contracts';

export const reviewService = {
  getReviews: async () => {
    const res = await axiosClient.get(endpoints.reviews);
    return parseResponse(listResponseSchema(reviewSchema), res.data, 'reviews');
  },

  createReview: async (reviewData) => {
    const res = await axiosClient.post(endpoints.reviews, reviewData);
    return parseResponse(reviewSchema, res.data, 'review');
  },

  updateReview: async (id, reviewData) => {
    const res = await axiosClient.put(endpoints.reviewById(id), reviewData);
    return parseResponse(reviewSchema, res.data, 'review');
  },

  deleteReview: async (id) => {
    const res = await axiosClient.delete(endpoints.reviewById(id));
    return res.data;
  },
};

export default reviewService;
