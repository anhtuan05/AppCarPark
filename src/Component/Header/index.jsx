import React, { useContext, useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  Car,
  ChevronDown,
  CreditCard,
  ExternalLink,
  LogIn,
  LogOut,
  Languages,
  MapPinned,
  Menu,
  MessageSquare,
  ShieldCheck,
  User,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';
import logo from '../../Img/logo.webp';
import headerBg from '../../Img/header-bg.webp';
import CarParkContext from '../../CarParkContext';
import authService from '../../features/auth/api/authApi';

const baseLinkClass =
  'group inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200';

const desktopNavClass = ({ isActive }) =>
  `${baseLinkClass} ${
    isActive
      ? 'bg-white text-emerald-950 shadow-md shadow-black/20 ring-1 ring-white/50 -translate-y-0.5'
      : 'text-emerald-50 hover:bg-white/12 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(16,185,129,0.2)]'
  }`;

const mobileNavClass = ({ isActive }) =>
  `group flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
    isActive
      ? 'bg-white text-emerald-950 shadow-md ring-1 ring-white/40 translate-x-1'
      : 'text-emerald-50 hover:bg-white/10 hover:text-white hover:translate-x-1'
  }`;

function NavIcon({ icon: Icon, className = '' }) {
  return <Icon className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${className}`} aria-hidden="true" />;
}

function LanguageToggle({ compact = false }) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage === 'en' ? 'en' : 'vi';
  const nextLanguage = currentLanguage === 'vi' ? 'en' : 'vi';
  const nextLanguageName = t(`language.${nextLanguage === 'vi' ? 'vietnamese' : 'english'}`);

  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(nextLanguage)}
      className={`${compact ? 'grid h-11 min-w-11 grid-cols-[auto_auto] place-items-center gap-1.5 px-2.5' : 'inline-flex min-h-11 items-center gap-2 px-3'} rounded-xl border border-white/15 text-sm font-black text-emerald-50 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 hover:bg-white/12 hover:text-white hover:shadow-[0_4px_12px_rgba(16,185,129,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200`}
      aria-label={t('language.switchTo', { language: nextLanguageName })}
      title={t('language.switchTo', { language: nextLanguageName })}
    >
      <Languages className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
      <span translate="no">{nextLanguage.toUpperCase()}</span>
    </button>
  );
}

export function Header() {
  const { t } = useTranslation();
  const [user, dispatch] = useContext(CarParkContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [feedbackDropdownOpen, setFeedbackDropdownOpen] = useState(false);
  const feedbackRef = useRef(null);
  const menuId = useId();
  const navigate = useNavigate();

  const isUser = Boolean(user && user.is_staff === false && user.is_superuser === false);
  const isStaff = Boolean(user && user.is_staff === true && user.is_superuser === false);
  const isAdmin = Boolean(user && user.is_staff === true && user.is_superuser === true);
  const displayName = user?.first_name || user?.username || t('common.account');

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setFeedbackDropdownOpen(false);
  };

  useEffect(() => {
    if (!mobileMenuOpen && !feedbackDropdownOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        setFeedbackDropdownOpen(false);
      }
    };

    const handlePointerDown = (event) => {
      if (feedbackRef.current && !feedbackRef.current.contains(event.target)) {
        setFeedbackDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [feedbackDropdownOpen, mobileMenuOpen]);

  const handleLogout = () => {
    authService.logout();
    dispatch({ type: 'logout' });
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-500/20 bg-emerald-950/90 text-white shadow-[0_8px_32px_rgba(4,47,38,0.36)] backdrop-blur-xl transition-colors">
      {/* Background image & rich cybernetic gradient layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src={headerBg}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center opacity-25 mix-blend-screen"
        />
        {/* Multi-stop emerald & cyan gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/85 to-teal-950/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent" />
        {/* High-tech bottom glowing neon border */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
          <Link
            to="/"
            onClick={closeMenus}
            className="group flex min-w-0 items-center gap-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
            aria-label={t('nav.homeLabel')}
          >
            <img
              src={logo}
              width="96"
              height="96"
              alt=""
              fetchpriority="high"
              className="h-10 w-10 shrink-0 rounded-xl border border-white/20 object-cover shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_14px_rgba(52,211,153,0.35)] sm:h-11 sm:w-11"
            />
            <span className="min-w-0">
              <span className="block truncate font-display text-base font-black tracking-tight sm:text-lg" translate="no">
                Green Car Park
              </span>
              <span className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300 sm:block">
                {t('nav.tagline')}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex" aria-label={t('nav.main')}>
            <NavLink to="/parking" className={desktopNavClass}>
              <NavIcon icon={MapPinned} />
              {t('nav.parking')}
            </NavLink>

            {isUser ? (
              <>
                <NavLink to="/renew-subscription" className={desktopNavClass}>
                  <NavIcon icon={CreditCard} />
                  {t('nav.renew')}
                </NavLink>
                <NavLink to="/vehicle-management" className={desktopNavClass}>
                  <NavIcon icon={Car} />
                  {t('nav.vehicles')}
                </NavLink>
                <div className="relative" ref={feedbackRef}>
                  <button
                    type="button"
                    className={`${baseLinkClass} text-emerald-50 hover:bg-white/12 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(16,185,129,0.18)]`}
                    onClick={() => setFeedbackDropdownOpen((open) => !open)}
                    aria-expanded={feedbackDropdownOpen}
                    aria-haspopup="menu"
                  >
                    <NavIcon icon={MessageSquare} />
                    {t('nav.feedback')}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${feedbackDropdownOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  {feedbackDropdownOpen ? (
                    <div
                      className="absolute right-0 top-[calc(100%+0.5rem)] w-60 origin-top animate-fade-in-down rounded-2xl border border-slate-200 bg-white p-2 text-slate-800 shadow-2xl transition-all"
                      role="menu"
                    >
                      <Link
                        to="/reviews"
                        onClick={closeMenus}
                        className="flex min-h-11 items-center rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-150 hover:translate-x-1.5 hover:bg-emerald-50 hover:text-emerald-800"
                        role="menuitem"
                      >
                        {t('nav.reviews')}
                      </Link>
                      <Link
                        to="/feedback"
                        onClick={closeMenus}
                        className="flex min-h-11 items-center rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-150 hover:translate-x-1.5 hover:bg-emerald-50 hover:text-emerald-800"
                        role="menuitem"
                      >
                        {t('nav.feedbackAndComplaints')}
                      </Link>
                    </div>
                  ) : null}
                </div>
                <NavLink to="/personal-info" className={desktopNavClass}>
                  <NavIcon icon={User} />
                  <span className="max-w-28 truncate">{displayName}</span>
                </NavLink>
              </>
            ) : null}

            {isAdmin ? (
              <>
                <NavLink to="/report" className={desktopNavClass}>
                  <NavIcon icon={BarChart3} />
                  {t('nav.report')}
                </NavLink>
                <a
                  href="https://anhtuan05.pythonanywhere.com/admin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${baseLinkClass} text-emerald-50 hover:bg-white/12 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(16,185,129,0.18)]`}
                >
                  <NavIcon icon={ShieldCheck} className="text-amber-300" />
                  {t('nav.administration')}
                  <NavIcon icon={ExternalLink} />
                </a>
              </>
            ) : null}

            {isStaff ? (
              <NavLink to="/staff" className={desktopNavClass}>
                <NavIcon icon={UserCheck} className="text-teal-300" />
                {t('nav.staffConsole')}
              </NavLink>
            ) : null}

            {!user ? (
              <div className="ml-2 flex items-center gap-2 border-l border-white/15 pl-3">
                <NavLink to="/login" className={desktopNavClass}>
                  <NavIcon icon={LogIn} />
                  {t('nav.login')}
                </NavLink>
                <NavLink
                  to="/register"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2 text-sm font-black text-emerald-950 shadow-md shadow-emerald-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <NavIcon icon={UserPlus} />
                  {t('nav.register')}
                </NavLink>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="ml-1 grid h-11 w-11 place-items-center rounded-xl text-emerald-100 transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-600 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
                aria-label={t('nav.logout')}
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
            <LanguageToggle />
          </nav>

          <div className="flex items-center gap-1 xl:hidden">
            <LanguageToggle compact />
            <a
              href="https://maps.app.goo.gl/AJ3rocpaq7b8s5oy6"
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-11 w-11 place-items-center rounded-xl text-emerald-100 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={t('nav.openMap')}
            >
              <MapPinned className="h-5 w-5" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="grid h-11 w-11 place-items-center rounded-xl text-emerald-50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
              aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={mobileMenuOpen}
              aria-controls={menuId}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        id={menuId}
        className={`relative z-10 overflow-hidden border-t border-emerald-500/20 bg-emerald-950/98 backdrop-blur-2xl transition-[max-height,opacity] duration-200 xl:hidden ${
          mobileMenuOpen ? 'max-h-[calc(100dvh-4rem)] opacity-100 shadow-2xl' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <nav
          className="mx-auto max-h-[calc(100dvh-4rem)] max-w-[1440px] space-y-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6"
          aria-label={t('nav.mobile')}
        >
          <NavLink to="/parking" onClick={closeMenus} className={mobileNavClass} tabIndex={mobileMenuOpen ? 0 : -1}>
            <NavIcon icon={MapPinned} className="text-emerald-300" />
            {t('nav.parking')}
          </NavLink>

          {isUser ? (
            <>
              <NavLink to="/renew-subscription" onClick={closeMenus} className={mobileNavClass} tabIndex={mobileMenuOpen ? 0 : -1}>
                <NavIcon icon={CreditCard} className="text-emerald-300" />
                {t('nav.renewMonthly')}
              </NavLink>
              <NavLink to="/vehicle-management" onClick={closeMenus} className={mobileNavClass} tabIndex={mobileMenuOpen ? 0 : -1}>
                <NavIcon icon={Car} className="text-emerald-300" />
                {t('nav.manageVehicles')}
              </NavLink>
              <NavLink to="/reviews" onClick={closeMenus} className={mobileNavClass} tabIndex={mobileMenuOpen ? 0 : -1}>
                <NavIcon icon={MessageSquare} className="text-emerald-300" />
                {t('nav.reviews')}
              </NavLink>
              <NavLink to="/feedback" onClick={closeMenus} className={mobileNavClass} tabIndex={mobileMenuOpen ? 0 : -1}>
                <NavIcon icon={MessageSquare} className="text-emerald-300" />
                {t('nav.feedbackAndComplaints')}
              </NavLink>
              <NavLink to="/personal-info" onClick={closeMenus} className={mobileNavClass} tabIndex={mobileMenuOpen ? 0 : -1}>
                <NavIcon icon={User} className="text-emerald-300" />
                {t('common.account')}: <span className="min-w-0 truncate">{displayName}</span>
              </NavLink>
            </>
          ) : null}

          {isAdmin ? (
            <>
              <NavLink to="/report" onClick={closeMenus} className={mobileNavClass} tabIndex={mobileMenuOpen ? 0 : -1}>
                <NavIcon icon={BarChart3} className="text-amber-300" />
                {t('nav.revenueReport')}
              </NavLink>
              <a
                href="https://anhtuan05.pythonanywhere.com/admin/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenus}
                tabIndex={mobileMenuOpen ? 0 : -1}
                className="flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-emerald-50 transition-colors hover:bg-white/10"
              >
                <NavIcon icon={ShieldCheck} className="text-amber-300" />
                {t('nav.djangoAdmin')}
                <NavIcon icon={ExternalLink} />
              </a>
            </>
          ) : null}

          {isStaff ? (
            <NavLink to="/staff" onClick={closeMenus} className={mobileNavClass} tabIndex={mobileMenuOpen ? 0 : -1}>
              <NavIcon icon={UserCheck} className="text-teal-300" />
              {t('nav.staffOperator')}
            </NavLink>
          ) : null}

          {!user ? (
            <div className="grid gap-2 border-t border-white/10 pt-3 sm:grid-cols-2">
              <NavLink to="/login" onClick={closeMenus} className={mobileNavClass} tabIndex={mobileMenuOpen ? 0 : -1}>
                <NavIcon icon={LogIn} className="text-emerald-300" />
                {t('nav.login')}
              </NavLink>
              <NavLink
                to="/register"
                onClick={closeMenus}
                tabIndex={mobileMenuOpen ? 0 : -1}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-black text-emerald-950 transition-colors hover:bg-emerald-300"
              >
                <NavIcon icon={UserPlus} />
                {t('nav.registerAccount')}
              </NavLink>
            </div>
          ) : (
            <div className="border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={handleLogout}
                tabIndex={mobileMenuOpen ? 0 : -1}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-rose-700"
              >
                <NavIcon icon={LogOut} />
                {t('nav.logout')}
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
