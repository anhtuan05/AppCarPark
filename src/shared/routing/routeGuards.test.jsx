import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import CarParkContext from '../../CarParkContext';
import { USER_ROLES } from '../auth/roles';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

function renderGuardedRoute(user) {
  return render(
    <CarParkContext.Provider value={[user, vi.fn()]}>
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute allowedRoles={[USER_ROLES.CUSTOMER]} />}>
              <Route path="/private" element={<h1>Private customer page</h1>} />
            </Route>
          </Route>
          <Route path="/login" element={<h1>Login page</h1>} />
          <Route path="/access-denied" element={<h1>Access denied page</h1>} />
        </Routes>
      </MemoryRouter>
    </CarParkContext.Provider>,
  );
}

describe('route guards', () => {
  it('redirects anonymous visitors to login', () => {
    renderGuardedRoute(null);
    expect(screen.getByRole('heading', { name: 'Login page' })).toBeInTheDocument();
  });

  it('redirects an authenticated user with the wrong role', () => {
    renderGuardedRoute({ is_staff: true, is_superuser: false });
    expect(screen.getByRole('heading', { name: 'Access denied page' })).toBeInTheDocument();
  });

  it('renders the route for an allowed role', () => {
    renderGuardedRoute({ is_staff: false, is_superuser: false });
    expect(screen.getByRole('heading', { name: 'Private customer page' })).toBeInTheDocument();
  });
});
