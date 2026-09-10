import axiosClient from '../../../shared/api/axiosClient';
import { endpoints } from '../../../shared/api/endpoints';
import { listResponseSchema, parseResponse, vehicleSchema } from '../../../shared/api/contracts';

export const vehicleService = {
  getVehicles: async () => {
    const res = await axiosClient.get(endpoints.vehicles);
    return parseResponse(listResponseSchema(vehicleSchema), res.data, 'vehicles');
  },

  createVehicle: async (vehicleData) => {
    const res = await axiosClient.post(endpoints.vehicles, vehicleData);
    return parseResponse(vehicleSchema, res.data, 'vehicle');
  },

  updateVehicle: async (id, vehicleData) => {
    const res = await axiosClient.put(endpoints.vehicleById(id), vehicleData);
    return parseResponse(vehicleSchema, res.data, 'vehicle');
  },

  deleteVehicle: async (id) => {
    const res = await axiosClient.delete(endpoints.vehicleById(id));
    return res.data;
  },
};

export default vehicleService;
