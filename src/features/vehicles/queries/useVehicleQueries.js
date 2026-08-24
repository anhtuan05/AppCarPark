import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '../api/vehicleApi';

export const VEHICLE_KEYS = {
  all: ['vehicles'],
  list: () => [...VEHICLE_KEYS.all, 'list'],
};

export const useVehiclesQuery = () => {
  return useQuery({
    queryKey: VEHICLE_KEYS.list(),
    queryFn: vehicleService.getVehicles,
  });
};

export const useCreateVehicleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: vehicleService.createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLE_KEYS.list() });
    },
  });
};

export const useUpdateVehicleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => vehicleService.updateVehicle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLE_KEYS.list() });
    },
  });
};

export const useDeleteVehicleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => vehicleService.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLE_KEYS.list() });
    },
  });
};
