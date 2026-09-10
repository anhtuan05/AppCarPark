import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import CarParkContext from '../../CarParkContext';

export function ProtectedRoute() {
  const [user] = useContext(CarParkContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
