import axiosClient from '../../../shared/api/axiosClient';
import { listResponseSchema, parseResponse, paymentSchema } from '../../../shared/api/contracts';
import { endpoints } from '../../../shared/api/endpoints';

export const paymentService = {
  getPayments: async () => {
    const response = await axiosClient.get(endpoints.payments);
    return parseResponse(listResponseSchema(paymentSchema), response.data, 'payments');
  },
};

export default paymentService;
