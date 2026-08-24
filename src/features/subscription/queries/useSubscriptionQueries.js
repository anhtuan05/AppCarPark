import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '../api/subscriptionApi';

export const SUBSCRIPTION_KEYS = {
  all: ['subscriptions'],
  types: () => [...SUBSCRIPTION_KEYS.all, 'types'],
  list: () => [...SUBSCRIPTION_KEYS.all, 'list'],
};

export const useSubscriptionTypesQuery = () => {
  return useQuery({
    queryKey: SUBSCRIPTION_KEYS.types(),
    queryFn: subscriptionService.getSubscriptionTypes,
    staleTime: 1000 * 60 * 10, // 10 mins
  });
};

export const useSubscriptionsQuery = () => {
  return useQuery({
    queryKey: SUBSCRIPTION_KEYS.list(),
    queryFn: subscriptionService.getSubscriptions,
  });
};

export const useCreateSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionService.createSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.list() });
    },
  });
};

export const useRenewSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subId, data }) => subscriptionService.renewSubscription(subId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.list() });
    },
  });
};
