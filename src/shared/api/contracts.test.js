import { describe, expect, it } from 'vitest';
import {
  ApiContractError,
  listResponseSchema,
  parkingSpotSchema,
  parseResponse,
  userSchema,
} from './contracts';

describe('API contracts', () => {
  it('normalizes paginated lists, foreign keys, and backend status aliases', () => {
    const result = parseResponse(
      listResponseSchema(parkingSpotSchema),
      { results: [{ id: '101', parkinglot: { id: '3' }, status: 'Booked' }] },
      'parkingSpots',
    );

    expect(result).toEqual([{ id: 101, parkinglot: 3, status: 'reserved' }]);
  });

  it('normalizes boolean user flags', () => {
    const user = parseResponse(userSchema, {
      id: '7',
      username: 'staff',
      is_staff: 'true',
      is_superuser: 'false',
    }, 'currentUser');

    expect(user).toMatchObject({ id: 7, is_staff: true, is_superuser: false });
  });

  it('throws a named contract error for invalid DTOs', () => {
    expect(() => parseResponse(userSchema, { id: 1 }, 'currentUser')).toThrow(ApiContractError);
  });
});
