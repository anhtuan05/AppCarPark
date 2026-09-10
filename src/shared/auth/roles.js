export const USER_ROLES = Object.freeze({
  CUSTOMER: 'customer',
  STAFF: 'staff',
  ADMIN: 'admin',
});

export function getUserRole(user) {
  if (!user) return null;
  if (user.is_staff === true && user.is_superuser === true) return USER_ROLES.ADMIN;
  if (user.is_staff === true) return USER_ROLES.STAFF;
  return USER_ROLES.CUSTOMER;
}

export function hasAllowedRole(user, allowedRoles = []) {
  return allowedRoles.includes(getUserRole(user));
}

export function getHomeRouteForRole(role) {
  if (role === USER_ROLES.ADMIN) return '/report';
  if (role === USER_ROLES.STAFF) return '/staff';
  return '/parking';
}
