import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  UserPlus,
  ScanFace,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  User,
  Mail,
  Calendar,
  Phone,
  ShieldCheck,
  Eye,
  EyeOff,
  UserCheck,
  Check,
  X,
} from 'lucide-react';
import WebcamCapture from '../../features/face-recognition/components/WebcamCapture';
import authService from '../../features/auth/api/authApi';
import './style.css';

export function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    date_of_birth: '',
    phone_number: '',
    face_description: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const isPasswordMatch =
    Boolean(user.password && user.confirmPassword && user.password === user.confirmPassword);
  const isPasswordMismatch =
    Boolean(user.confirmPassword && user.password && user.password !== user.confirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (user.password !== user.confirmPassword) {
      setFeedback({
        type: 'error',
        key: 'register.passwordMismatch',
      });
      return;
    }

    if (!user.face_description) {
      setFeedback({
        type: 'error',
        key: 'register.faceRequired',
      });
      return;
    }

    setLoading(true);

    try {
      // Optional pre-check if face already enrolled
      try {
        const faceCheck = await authService.loginWithFace(user.face_description);
        if (faceCheck?.token?.access_token) {
          setFeedback({
            type: 'error',
            key: 'register.faceDuplicate',
          });
          setLoading(false);
          return;
        }
      } catch {
        // Expected when face is brand new
      }

      await authService.register(user);
      setFeedback({
        type: 'success',
        key: 'register.success',
      });
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      let errorFeedback = { key: 'register.failure' };
      const resData = error.response?.data;
      if (resData) {
        if (typeof resData === 'string') {
          errorFeedback = { key: 'register.failureDetail', values: { detail: resData } };
        } else if (resData.username) {
          errorFeedback = { key: 'register.usernameError', values: { detail: Array.isArray(resData.username) ? resData.username.join(', ') : resData.username } };
        } else if (resData.email) {
          errorFeedback = { key: 'register.emailError', values: { detail: Array.isArray(resData.email) ? resData.email.join(', ') : resData.email } };
        } else if (resData.detail) {
          errorFeedback = { key: 'register.failureDetail', values: { detail: resData.detail } };
        } else if (resData.error) {
          errorFeedback = { key: 'register.failureDetail', values: { detail: resData.error } };
        }
      }
      setFeedback({
        type: 'error',
        ...errorFeedback,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-2 sm:py-6 space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 sm:p-8 rounded-[2rem] shadow-xl border border-emerald-600/30">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide text-emerald-100 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
            </span>
            <UserCheck className="w-3.5 h-3.5 text-emerald-200" />
            <span>{t('register.badge')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
            {t('register.title')}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
            {t('register.description')}
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-3 self-center pl-4 border-l border-white/20">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center">
            <ScanFace className="w-8 h-8 text-emerald-200" />
          </div>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-start gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
          }`}
          role={feedback.type === 'error' ? 'alert' : 'status'}
          aria-live="polite"
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
          )}
          <span className="leading-snug">{t(feedback.key, feedback.values)}</span>
        </div>
      )}

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Form Details (7 cols) */}
        <div className="lg:col-span-7 auth-glass-panel rounded-[2rem] p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              <span>{t('register.accountStep')}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('register.requiredDescription')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="register-last-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t('register.lastName')} *
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center z-10">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <input
                    id="register-last-name"
                    type="text"
                    name="last_name"
                    value={user.last_name}
                    onChange={handleChange}
                    placeholder={t('register.lastNamePlaceholder')}
                    autoComplete="family-name"
                    required
                    className="w-full auth-input py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-sm transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="register-first-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t('register.firstName')} *
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center z-10">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <input
                    id="register-first-name"
                    type="text"
                    name="first_name"
                    value={user.first_name}
                    onChange={handleChange}
                    placeholder={t('register.firstNamePlaceholder')}
                    autoComplete="given-name"
                    required
                    className="w-full auth-input py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-sm transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label htmlFor="register-username" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t('register.username')} *
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center z-10">
                  <UserCheck className="w-4.5 h-4.5" />
                </div>
                <input
                  id="register-username"
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  placeholder={t('register.usernamePlaceholder')}
                  autoComplete="username"
                  spellCheck={false}
                  required
                  className="w-full auth-input py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-sm transition-all font-medium"
                />
              </div>
            </div>

            {/* Passwords with Centered, Background-free Eye Toggles and Matching Indicator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="register-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t('register.password')} *
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center z-10">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    placeholder={t('register.passwordPlaceholder')}
                    autoComplete="new-password"
                    required
                    className="w-full auth-input-password py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-sm transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 auth-eye-btn text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 z-10"
                    aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="register-confirm-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {t('register.confirmPassword')} *
                  </label>
                  {isPasswordMatch && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      <Check className="w-3 h-3" /> {t('register.matches')}
                    </span>
                  )}
                  {isPasswordMismatch && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500 whitespace-nowrap">
                      <X className="w-3 h-3" /> {t('register.doesNotMatch')}
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center z-10">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={user.confirmPassword}
                    onChange={handleChange}
                    placeholder={t('register.confirmPlaceholder')}
                    autoComplete="new-password"
                    aria-invalid={isPasswordMismatch}
                    aria-describedby="password-match-status"
                    required
                    className={`w-full auth-input-password py-3 rounded-xl border bg-slate-50/80 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-sm transition-all font-medium ${
                      isPasswordMismatch
                        ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500'
                        : isPasswordMatch
                        ? 'border-emerald-400 dark:border-emerald-600 focus:ring-emerald-500'
                        : 'border-slate-300 dark:border-slate-700 focus:ring-emerald-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 auth-eye-btn text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 z-10"
                    aria-label={showConfirmPassword ? t('login.hidePassword') : t('login.showPassword')}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
                <span id="password-match-status" className="sr-only" aria-live="polite">
                  {isPasswordMismatch ? t('register.confirmMismatchA11y') : isPasswordMatch ? t('register.confirmMatchA11y') : ''}
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="register-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t('register.email')} *
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center z-10">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder={t('register.emailPlaceholder')}
                  autoComplete="email"
                  spellCheck={false}
                  required
                  className="w-full auth-input py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-sm transition-all font-medium"
                />
              </div>
            </div>

            {/* Date of Birth & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="register-birthday" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t('register.birthday')} *
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center z-10">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <input
                    id="register-birthday"
                    type="date"
                    name="date_of_birth"
                    value={user.date_of_birth}
                    onChange={handleChange}
                    autoComplete="bday"
                    required
                    className="w-full auth-input py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-sm transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="register-phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t('register.phone')} *
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center z-10">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <input
                    id="register-phone"
                    type="tel"
                    name="phone_number"
                    value={user.phone_number}
                    onChange={handleChange}
                    placeholder={t('register.phonePlaceholder')}
                    autoComplete="tel"
                    inputMode="tel"
                    required
                    className="w-full auth-input py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-sm transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Terms of Service Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-4 h-4 mt-0.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer flex-shrink-0"
              />
              <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                <label htmlFor="terms" className="cursor-pointer select-none">{t('register.agree')}</label>{' '}
                <button
                  type="button"
                  onClick={() => {
                    alert(t('register.termsAlert'));
                  }}
                  className="rounded font-bold text-emerald-700 hover:underline dark:text-emerald-400"
                >
                  {t('register.terms')}
                </button>{' '}
                <span>{t('register.brandSuffix')}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!agree || loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-[0.99] text-white font-bold rounded-2xl shadow-xl hover:shadow-emerald-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base !m-0 !box-border cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <UserPlus className="w-5 h-5" />
              )}
              <span>{loading ? t('register.submitting') : t('register.submit')}</span>
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
            {t('register.hasAccount')}{' '}
            <Link to="/login" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              {t('register.login')}
            </Link>
          </div>
        </div>

        {/* Right Column: Facial Recognition Camera & Upload (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="auth-glass-panel rounded-[2rem] p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ScanFace className="w-5 h-5 text-emerald-600" />
                <span>{t('register.biometricStep')}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t('register.biometricDescription')}
              </p>
            </div>

            {/* Embedded WebcamCapture Component */}
            <WebcamCapture
              setFaceDescription={(desc) => {
                setUser((prev) => ({ ...prev, face_description: desc }));
              }}
              title={t('register.faceTitle')}
              subtitle={t('register.faceSubtitle')}
            />

            {/* Live Vector Readiness Status */}
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{t('register.vectorLabel')}</span>
              {user.face_description ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  {t('register.vectorReady')}
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 font-medium italic">
                  {t('register.vectorRequired')}
                </span>
              )}
            </div>
          </div>

          {/* Biometric Security Guarantee Card */}
          <div className="p-5 rounded-3xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>{t('register.securityTitle')}</span>
            </div>
            <p className="leading-relaxed">
              {t('register.securityDescription')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
