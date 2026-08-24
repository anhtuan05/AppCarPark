import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LogOut,
  LogIn,
  UserPlus,
  MapPinned,
  Menu,
  X,
  Car,
  CalendarCheck,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  User,
  ChevronDown,
  BarChart3,
} from 'lucide-react';
import logo from '../../Img/img2.webp';
import CarParkContext from '../../CarParkContext';
import authService from '../../features/auth/api/authApi';
import './style.css';

export function Header() {
  const [user, dispatch] = useContext(CarParkContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [feedbackDropdownOpen, setFeedbackDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Derived states calculated synchronously during render (Vercel Best Practice: rerender-derived-state-no-effect)
  const isUser = Boolean(user && user.is_staff === false && user.is_superuser === false);
  const isStaff = Boolean(user && user.is_staff === true && user.is_superuser === false);
  const isAdmin = Boolean(user && user.is_staff === true && user.is_superuser === true);

  const handleLogout = (e) => {
    e.preventDefault();
    authService.logout();
    dispatch({ type: 'logout' });
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setFeedbackDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Name */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-emerald-300 rounded-lg p-1"
          >
            <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border-2 border-white/80 shadow-md transition-transform group-hover:scale-105">
              <img
                src={logo}
                alt="Green Car Park Logo"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base sm:text-xl tracking-tight text-white group-hover:text-emerald-100 transition-colors">
                Green Car Park
              </span>
              <span className="text-[10px] sm:text-xs text-emerald-200 uppercase tracking-wider font-semibold">
                Smart Parking Service
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavLink
              to="/parking"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              Parking
            </NavLink>

            {/* Standard User Links */}
            {isUser && (
              <>
                <NavLink
                  to="/re-new-sub"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white/20 text-white shadow-sm'
                        : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  Renewal
                </NavLink>

                <NavLink
                  to="/vehicleManagement"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white/20 text-white shadow-sm'
                        : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  Vehicles
                </NavLink>

                {/* Feedback Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setFeedbackDropdownOpen(!feedbackDropdownOpen)}
                    onBlur={() => setTimeout(() => setFeedbackDropdownOpen(false), 200)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-emerald-100 hover:bg-white/10 hover:text-white transition-all focus:outline-none"
                  >
                    <span>Feedback</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {feedbackDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <Link
                        to="/reviews"
                        onClick={() => setFeedbackDropdownOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-700 transition-colors"
                      >
                        User Reviews
                      </Link>
                      <Link
                        to="/feedback"
                        onClick={() => setFeedbackDropdownOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-700 transition-colors"
                      >
                        Feedback & Complaints
                      </Link>
                    </div>
                  )}
                </div>

                <NavLink
                  to="/personal-info"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white/20 text-white shadow-sm'
                        : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <User className="w-4 h-4 text-emerald-300" />
                  <span>{user.username}</span>
                </NavLink>
              </>
            )}

            {/* Admin Links */}
            {isAdmin && (
              <>
                <NavLink
                  to="/report"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white/20 text-white shadow-sm'
                        : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Reports</span>
                </NavLink>
                <a
                  href="https://anhtuan05.pythonanywhere.com/admin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-emerald-100 hover:bg-white/10 hover:text-white transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>Admin Site</span>
                </a>
              </>
            )}

            {/* Staff Links */}
            {isStaff && (
              <NavLink
                to="/staff"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <UserCheck className="w-4 h-4 text-teal-300" />
                <span>Entry & Exit</span>
              </NavLink>
            )}

            {/* Non-authenticated Links */}
            {!user && (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/15 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-sm font-semibold shadow-sm transition-all transform hover:-translate-y-0.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}

            {/* Authenticated Logout */}
            {user && (
              <button
                type="button"
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-lg text-emerald-200 hover:bg-rose-600/80 hover:text-white transition-all ml-1"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}

            {/* Location Map Pin */}
            <a
              href="https://maps.app.goo.gl/AJ3rocpaq7b8s5oy6"
              target="_blank"
              rel="noopener noreferrer"
              title="View on Google Maps"
              className="p-2 rounded-lg text-emerald-200 hover:bg-white/10 hover:text-white transition-all"
            >
              <MapPinned className="w-5 h-5" />
            </a>
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="https://maps.app.goo.gl/AJ3rocpaq7b8s5oy6"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-emerald-200"
            >
              <MapPinned className="w-5 h-5" />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-emerald-100 hover:bg-white/10 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-900/98 border-t border-emerald-700/50 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-3 duration-200 shadow-2xl">
          <Link
            to="/parking"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-emerald-100 hover:bg-white/10 hover:text-white"
          >
            <Car className="w-5 h-5 text-emerald-300" />
            <span>Parking</span>
          </Link>

          {isUser && (
            <>
              <Link
                to="/re-new-sub"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-emerald-100 hover:bg-white/10 hover:text-white"
              >
                <CreditCard className="w-5 h-5 text-emerald-300" />
                <span>Registration Renewal</span>
              </Link>
              <Link
                to="/vehicleManagement"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-emerald-100 hover:bg-white/10 hover:text-white"
              >
                <Car className="w-5 h-5 text-emerald-300" />
                <span>Vehicle Management</span>
              </Link>
              <Link
                to="/reviews"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-emerald-100 hover:bg-white/10 hover:text-white"
              >
                <MessageSquare className="w-5 h-5 text-emerald-300" />
                <span>Reviews & Feedback</span>
              </Link>
              <Link
                to="/personal-info"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-emerald-100 hover:bg-white/10 hover:text-white"
              >
                <User className="w-5 h-5 text-emerald-300" />
                <span>Profile: {user.username}</span>
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link
                to="/report"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-emerald-100 hover:bg-white/10 hover:text-white"
              >
                <BarChart3 className="w-5 h-5 text-amber-300" />
                <span>Admin Reports</span>
              </Link>
              <a
                href="https://anhtuan05.pythonanywhere.com/admin/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-emerald-100 hover:bg-white/10 hover:text-white"
              >
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <span>Django Admin Site</span>
              </a>
            </>
          )}

          {isStaff && (
            <Link
              to="/staff"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-emerald-100 hover:bg-white/10 hover:text-white"
            >
              <UserCheck className="w-5 h-5 text-teal-300" />
              <span>Staff Entry & Exit</span>
            </Link>
          )}

          {!user ? (
            <div className="pt-4 border-t border-emerald-800/80 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-center font-semibold bg-white/10 hover:bg-white/20 text-white"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-center font-semibold bg-emerald-500 hover:bg-emerald-400 text-white"
              >
                <UserPlus className="w-5 h-5" />
                <span>Register</span>
              </Link>
            </div>
          ) : (
            <div className="pt-4 border-t border-emerald-800/80">
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-center font-semibold bg-rose-600/90 hover:bg-rose-700 text-white"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
