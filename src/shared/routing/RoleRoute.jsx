import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import CarParkContext from '../../CarParkContext';
import { getUserRole, hasAllowedRole } from '../auth/roles';

export function RoleRoute({ allowedRoles }) {
  const [user] = useContext(CarParkContext);
  const location = useLocation();

  if (!hasAllowedRole(user, allowedRoles)) {
    return (
      <Navigate
        to="/access-denied"
        replace
        state={{ attemptedPath: location.pathname, currentRole: getUserRole(user) }}
      />
    );
  }

  return <Outlet />;
}

export default RoleRoute;
