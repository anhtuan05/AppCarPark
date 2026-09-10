import axiosClient from '../../../shared/api/axiosClient';
import { endpoints } from '../../../shared/api/endpoints';
import {
  actionResponseSchema,
  listResponseSchema,
  parseResponse,
  subscriptionSchema,
  subscriptionTypeSchema,
} from '../../../shared/api/contracts';

export const subscriptionService = {
  getSubscriptionTypes: async () => {
    const res = await axiosClient.get(endpoints.subscriptionTypes);
    return parseResponse(listResponseSchema(subscriptionTypeSchema), res.data, 'subscriptionTypes');
  },

  getSubscriptions: async () => {
    const res = await axiosClient.get(endpoints.subscriptions);
    return parseResponse(listResponseSchema(subscriptionSchema), res.data, 'subscriptions');
  },

  createSubscription: async (subscriptionData) => {
    const res = await axiosClient.post(endpoints.subscriptions, subscriptionData);
    return parseResponse(actionResponseSchema, res.data, 'subscriptionAction');
  },

  renewSubscription: async (subId, renewalData) => {
    const res = await axiosClient.post(endpoints.renewSubscription(subId), renewalData);
    return parseResponse(actionResponseSchema, res.data, 'subscriptionRenewal');
  },
};

export default subscriptionService;
