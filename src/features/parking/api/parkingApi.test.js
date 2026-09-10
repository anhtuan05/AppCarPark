import { beforeEach, describe, expect, it, vi } from 'vitest';
import axiosClient from '../../../shared/api/axiosClient';
import { ApiContractError } from '../../../shared/api/contracts';
import { parkingService } from './parkingApi';

vi.mock('../../../shared/api/axiosClient', () => ({
  default: { get: vi.fn() },
}));

describe('parkingService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('adapts a paginated parking-lot response', async () => {
    axiosClient.get.mockResolvedValue({
      data: {
        results: [{ id: '1', name: 'Central', address: null, price_per_hour: '25000' }],
      },
    });

    await expect(parkingService.getParkingLots()).resolves.toEqual([
      { id: 1, name: 'Central', address: '', price_per_hour: 25000 },
    ]);
  });

  it('rejects an invalid response instead of silently returning an empty list', async () => {
    axiosClient.get.mockResolvedValue({ data: [{ id: 1, name: 'Missing price' }] });
    await expect(parkingService.getParkingLots()).rejects.toBeInstanceOf(ApiContractError);
  });
});
