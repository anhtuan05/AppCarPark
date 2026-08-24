import axiosClient from '../../../shared/api/axiosClient';
import { endpoints } from '../../../shared/api/endpoints';

export const subscriptionService = {
  getSubscriptionTypes: async () => {
    const res = await axiosClient.get(endpoints.subscriptionType);
    return Array.isArray(res.data) ? res.data : [];
  },

  getSubscriptions: async () => {
    const res = await axiosClient.get(endpoints.subscription);
    return Array.isArray(res.data) ? res.data : [];
  },

  createSubscription: async (subscriptionData) => {
    const res = await axiosClient.post(endpoints.subscription, subscriptionData);
    return res.data;
  },

  renewSubscription: async (subId, renewalData) => {
    const res = await axiosClient.post(endpoints.renewSubscription(subId), renewalData);
    return res.data;
  },
};

export default subscriptionService;
