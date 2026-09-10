import { beforeEach, describe, expect, it, vi } from 'vitest';
import CarParkUserReducer from './CarParkUserReducer';
import tokenStorage from './shared/api/tokenStorage';

vi.mock('./shared/api/tokenStorage', () => ({
  default: {
    setUser: vi.fn(),
    clearAll: vi.fn(),
  },
}));

describe('CarParkUserReducer', () => {
  beforeEach(() => vi.clearAllMocks());

  it('persists and returns the logged-in user', () => {
    const user = { id: 1, username: 'customer1' };
    expect(CarParkUserReducer(null, { type: 'login', payload: user })).toEqual(user);
    expect(tokenStorage.setUser).toHaveBeenCalledWith(user);
  });

  it('clears the session on logout', () => {
    expect(CarParkUserReducer({ id: 1 }, { type: 'logout' })).toBeNull();
    expect(tokenStorage.clearAll).toHaveBeenCalledOnce();
  });

  it('keeps state for unknown actions', () => {
    const currentState = { id: 1 };
    expect(CarParkUserReducer(currentState, { type: 'unknown' })).toBe(currentState);
  });
});
