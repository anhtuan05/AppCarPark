import { describe, expect, it } from 'vitest';
import { USER_ROLES, getHomeRouteForRole, getUserRole, hasAllowedRole } from './roles';

describe('role helpers', () => {
  it.each([
    [null, null],
    [{ is_staff: false, is_superuser: false }, USER_ROLES.CUSTOMER],
    [{ is_staff: true, is_superuser: false }, USER_ROLES.STAFF],
    [{ is_staff: true, is_superuser: true }, USER_ROLES.ADMIN],
  ])('maps user flags to a canonical role', (user, expectedRole) => {
    expect(getUserRole(user)).toBe(expectedRole);
  });

  it('checks allowed roles and returns a role-specific home route', () => {
    const staff = { is_staff: true, is_superuser: false };
    expect(hasAllowedRole(staff, [USER_ROLES.STAFF])).toBe(true);
    expect(hasAllowedRole(staff, [USER_ROLES.ADMIN])).toBe(false);
    expect(getHomeRouteForRole(USER_ROLES.STAFF)).toBe('/staff');
  });
});
