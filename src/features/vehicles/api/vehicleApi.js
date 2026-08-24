import axiosClient from '../../../shared/api/axiosClient';
import { endpoints } from '../../../shared/api/endpoints';

export const vehicleService = {
  getVehicles: async () => {
    const res = await axiosClient.get(endpoints.vehicleManagement);
    return Array.isArray(res.data) ? res.data : [];
  },

  createVehicle: async (vehicleData) => {
    const res = await axiosClient.post(endpoints.vehicleManagement, vehicleData);
    return res.data;
  },

  updateVehicle: async (id, vehicleData) => {
    const res = await axiosClient.put(endpoints.vehicleDetail(id), vehicleData);
    return res.data;
  },

  deleteVehicle: async (id) => {
    const res = await axiosClient.delete(endpoints.vehicleDetail(id));
    return res.data;
  },
};

export default vehicleService;
