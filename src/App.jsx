import React, { lazy, Suspense, useEffect } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AlertTriangle, LoaderCircle, LockKeyhole, MapPinOff, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import tokenStorage from './shared/api/tokenStorage';
import CarParkContext from './CarParkContext';
import CarParkUserReducer from './CarParkUserReducer';
import Header from './Component/Header';
import Footer from './Component/Footer';
import ErrorBoundary from './shared/errors/ErrorBoundary';
import ProtectedRoute from './shared/routing/ProtectedRoute';
import RoleRoute from './shared/routing/RoleRoute';
import { USER_ROLES, getHomeRouteForRole, getUserRole } from './shared/auth/roles';
import useSeo from './shared/seo/useSeo';
import './App.css';

const Home = lazy(() => import('./Component/Home'));
const Parking = lazy(() => import('./Component/Parking'));
const Booking = lazy(() => import('./Component/Booking'));
const VehicleManagement = lazy(() => import('./Component/VehicleManagement'));
const Subscription = lazy(() => import('./Component/Subscription'));
const Feedback = lazy(() => import('./Component/Feedback'));
const Login = lazy(() => import('./Component/Login'));
const Register = lazy(() => import('./Component/Register'));
const ReNewSub = lazy(() => import('./Component/ReNewSub'));
const Staff = lazy(() => import('./Component/Staff'));
const Report = lazy(() => import('./Component/Admin/Report'));
const Reviews = lazy(() => import('./Component/Reviews'));
const PersonalInfo = lazy(() => import('./Component/PersonalInfo'));

function RouteLoader() {
  const { t } = useTranslation();

  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-slate-500"
      role="status"
      aria-live="polite"
    >
      <LoaderCircle className="h-8 w-8 animate-spin text-emerald-600" aria-hidden="true" />
      <span className="text-sm font-semibold">{t('app.loading')}</span>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

function NotFound() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto flex min-h-[58vh] max-w-xl flex-col items-center justify-center text-center">
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
        <MapPinOff className="h-8 w-8" aria-hidden="true" />
      </div>
      <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">{t('app.notFoundCode')}</p>
      <h1 className="text-balance text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
        {t('app.notFoundTitle')}
      </h1>
      <p className="mt-3 text-pretty text-sm leading-6 text-slate-600 sm:text-base">
        {t('app.notFoundDescription')}
      </p>
      <Link
        to="/"
        className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-800"
      >
        {t('app.backHome')}
      </Link>
    </section>
  );
}

function AccessDenied() {
  const { t } = useTranslation();
  const [user] = React.useContext(CarParkContext);

  return (
    <section className="mx-auto flex min-h-[58vh] max-w-xl flex-col items-center justify-center text-center">
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-amber-100 text-amber-700">
        <LockKeyhole className="h-8 w-8" aria-hidden="true" />
      </div>
      <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-amber-700">{t('app.accessDeniedCode')}</p>
      <h1 className="text-balance text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
        {t('app.accessDeniedTitle')}
      </h1>
      <p className="mt-3 text-pretty text-sm leading-6 text-slate-600 sm:text-base">
        {t('app.accessDeniedDescription')}
      </p>
      <Link
        to={getHomeRouteForRole(getUserRole(user))}
        className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-800"
      >
        {t('app.backToAllowedArea')}
      </Link>
    </section>
  );
}

function RouteErrorFallback({ resetErrorBoundary }) {
  const { t } = useTranslation();

  return (
    <section className="mx-auto flex min-h-[58vh] max-w-xl flex-col items-center justify-center text-center" role="alert">
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-rose-100 text-rose-700">
        <AlertTriangle className="h-8 w-8" aria-hidden="true" />
      </div>
      <h1 className="text-balance text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
        {t('app.errorTitle')}
      </h1>
      <p className="mt-3 text-pretty text-sm leading-6 text-slate-600 sm:text-base">
        {t('app.errorDescription')}
      </p>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-800"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        {t('common.retry')}
      </button>
    </section>
  );
}

function App() {
  const { t } = useTranslation();
  const location = useLocation();
  useSeo();

  const [user, dispatch] = React.useReducer(
    CarParkUserReducer,
    undefined,
    () => tokenStorage.getUser() || null,
  );

  return (
    <CarParkContext.Provider value={[user, dispatch]}>
      <ScrollToTop />
      <div className="app-shell flex min-h-dvh flex-col text-slate-900">
        <a className="skip-link" href="#main-content">
          {t('app.skipNavigation')}
        </a>
        <Header />
        <main
          id="main-content"
          className="relative mx-auto w-full max-w-[1440px] flex-1 px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
        >
          <ErrorBoundary
            resetKey={location.pathname}
            fallbackRender={(props) => <RouteErrorFallback {...props} />}
          >
            <Suspense fallback={<RouteLoader />}>
              <div key={location.pathname} className="animate-page-enter">
                <Routes location={location}>
                  <Route path="/" element={<Home />} />
                  <Route path="/parking" element={<Parking />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/access-denied" element={<AccessDenied />} />

                  <Route element={<ProtectedRoute />}>
                    <Route element={<RoleRoute allowedRoles={[USER_ROLES.CUSTOMER]} />}>
                      <Route path="/booking/:spotId" element={<Booking />} />
                      <Route path="/vehicle-management" element={<VehicleManagement />} />
                      <Route path="/subscription/:spotId" element={<Subscription />} />
                      <Route path="/feedback" element={<Feedback />} />
                      <Route path="/renew-subscription" element={<ReNewSub />} />
                      <Route path="/reviews" element={<Reviews />} />
                      <Route path="/personal-info" element={<PersonalInfo />} />
                    </Route>
                    <Route element={<RoleRoute allowedRoles={[USER_ROLES.STAFF]} />}>
                      <Route path="/staff" element={<Staff />} />
                    </Route>
                    <Route element={<RoleRoute allowedRoles={[USER_ROLES.ADMIN]} />}>
                      <Route path="/report" element={<Report />} />
                    </Route>
                  </Route>

                  <Route path="/vehicleManagement" element={<Navigate to="/vehicle-management" replace />} />
                  <Route path="/re-new-sub" element={<Navigate to="/renew-subscription" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </CarParkContext.Provider>
  );
}

export default App;
