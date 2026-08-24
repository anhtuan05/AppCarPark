import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../api/reviewApi';

export const REVIEW_KEYS = {
  all: ['reviews'],
  list: () => [...REVIEW_KEYS.all, 'list'],
};

export const useReviewsQuery = () => {
  return useQuery({
    queryKey: REVIEW_KEYS.list(),
    queryFn: reviewService.getReviews,
  });
};

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.list() });
    },
  });
};

export const useUpdateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => reviewService.updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.list() });
    },
  });
};

export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => reviewService.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.list() });
    },
  });
};
