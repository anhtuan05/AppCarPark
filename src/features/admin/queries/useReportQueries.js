import { useQuery } from '@tanstack/react-query';
import { reportService } from '../api/reportApi';

export const REPORT_KEYS = {
  all: ['reports'],
  ratings: () => [...REPORT_KEYS.all, 'ratings'],
  revenue: () => [...REPORT_KEYS.all, 'revenue'],
};

export const useRatingsQuery = () => {
  return useQuery({
    queryKey: REPORT_KEYS.ratings(),
    queryFn: reportService.getRatings,
    staleTime: 1000 * 60 * 5,
  });
};

export const useRevenueDataQuery = () => {
  return useQuery({
    queryKey: REPORT_KEYS.revenue(),
    queryFn: reportService.getRevenueData,
    staleTime: 1000 * 60 * 5,
  });
};
