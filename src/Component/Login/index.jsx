import React, { useContext, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LogIn,
  ScanFace,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  KeyRound,
  Car,
  UserCheck,
  Shield,
} from 'lucide-react';
import img3 from '../../Img/auth-scene.webp';
import logo from '../../Img/logo.webp';
import CarParkContext from '../../CarParkContext';
import authService from '../../features/auth/api/authApi';
import WebcamCapture from '../../features/face-recognition/components/WebcamCapture';
import './style.css';

export const Login = () => {
  const { t } = useTranslation();
  const [, dispatch] = useContext(CarParkContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loginMode, setLoginMode] = useState('password'); // 'password' | 'face'
  const [faceDescription, setFaceDescription] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const requestedLocation = location.state?.from;
  const postLoginPath = requestedLocation?.pathname
    ? `${requestedLocation.pathname}${requestedLocation.search || ''}${requestedLocation.hash || ''}`
    : '/';

  // Quick Demo Account Auto-fill for easy evaluation & grading
  const fillDemoAccount = (role) => {
    setFeedback(null);
    setLoginMode('password');
    if (role === 'customer') {
      setUsername('customer1');
      setPassword('Customer@123');
    } else if (role === 'staff') {
      setUsername('staff_operator');
      setPassword('Staff@123');
    } else if (role === 'admin') {
      setUsername('admin');
      setPassword('Admin@123');
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const data = await authService.login(username, password);
      if (data?.user) {
        dispatch({
          type: 'login',
          payload: data.user,
        });
        setFeedback({
          type: 'success',
          key: 'login.welcome',
          values: { name: data.user.first_name || data.user.username },
        });
        setTimeout(() => navigate(postLoginPath, { replace: true }), 600);
      }
    } catch (error) {
      let errorFeedback = { key: 'login.invalidCredentials' };
      const resDetail =
        error.response?.data?.error_description ||
        error.response?.data?.detail ||
        error.message;

      if (resDetail && typeof resDetail === 'string') {
        if (resDetail.includes('invalid_grant')) {
          errorFeedback = { key: 'login.invalidCredentials' };
        } else {
          errorFeedback = { key: 'login.failure', values: { detail: resDetail } };
        }
      }

      if (error.code === 'AUTH_CONFIG_MISSING') {
        errorFeedback = { key: 'login.configMissing' };
      }

      setFeedback({
        type: 'error',
        ...errorFeedback,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFaceLogin = async () => {
    if (!faceDescription) {
      setFeedback({
        type: 'error',
        key: 'login.faceRequired',
      });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const data = await authService.loginWithFace(faceDescription);
      if (data?.user) {
        dispatch({
          type: 'login',
          payload: data.user,
        });
        setFeedback({
          type: 'success',
          key: 'login.faceSuccess',
          values: { name: data.user.first_name || data.user.username },
        });
        setTimeout(() => navigate(postLoginPath, { replace: true }), 600);
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        key: 'login.faceFailure',
        values: {
          detail:
            error.response?.data?.detail ||
            error.response?.data?.error ||
            t('login.faceFallback'),
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl py-1 sm:py-5">
      {/* Outer Card Container with modern glassmorphism & soft gradient border */}
      <div className="auth-glass-panel grid grid-cols-1 overflow-hidden rounded-[1.75rem] border border-slate-200/90 shadow-2xl sm:rounded-[2.25rem] lg:grid-cols-12 dark:border-slate-800">
        
        {/* Left Side: Interactive Auth Form (7 cols on lg) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-7">
          
          {/* Header & Logo */}
          <div className="space-y-4">
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
              <Link to="/" className="inline-flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-500 shadow-sm transition-transform group-hover:scale-105 flex-shrink-0">
                  <img src={logo} width="96" height="96" alt="" className="h-full w-full object-cover" />
                </div>
                <div>
                  <span className="font-display font-black text-xl text-slate-900 dark:text-white tracking-tight leading-none block">
                    Green Car Park
                  </span>
                  <span className="text-[11px] uppercase font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider mt-1 block">
                    {t('login.portal')}
                  </span>
                </div>
              </Link>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold whitespace-nowrap shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>{t('login.ssl')}</span>
              </div>
            </div>

            <div className="pt-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
                {t('login.title')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {t('login.description')}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200/60 bg-slate-100 p-1.5 shadow-inner dark:border-slate-700/60 dark:bg-slate-800" role="group" aria-label={t('login.methodsLabel')}>
            <button
              type="button"
              onClick={() => {
                setLoginMode('password');
                setFeedback(null);
              }}
              aria-pressed={loginMode === 'password'}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                loginMode === 'password'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-md transform scale-[1.01]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <KeyRound className="w-4 h-4 flex-shrink-0" />
              <span>{t('login.passwordMode')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMode('face');
                setFeedback(null);
              }}
              aria-pressed={loginMode === 'face'}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                loginMode === 'face'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md transform scale-[1.01]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ScanFace className="w-4 h-4 flex-shrink-0" />
              <span>{t('login.faceMode')}</span>
            </button>
          </div>

          {/* Inline Feedback Alerts */}
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

          {/* Form / Face Viewport */}
          {loginMode === 'password' ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="login-username" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t('login.username')}
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <input
                    id="login-username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('login.usernamePlaceholder')}
                    autoComplete="username"
                    spellCheck={false}
                    required
                    className="w-full auth-input py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {t('login.password')}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      alert(t('login.forgotAlert'));
                    }}
                    className="min-h-11 rounded-lg px-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 hover:underline dark:text-emerald-400 dark:hover:bg-emerald-950"
                  >
                    {t('login.forgot')}
                  </button>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center z-10">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('login.passwordPlaceholder')}
                    autoComplete="current-password"
                    required
                    className="w-full auth-input-password py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 auth-eye-btn text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 z-10"
                    aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                  <input
                    name="remember_me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span>{t('login.remember')}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-[0.99] text-white font-bold rounded-2xl shadow-xl hover:shadow-emerald-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <LogIn className="w-5 h-5" />
                )}
                <span>{t('login.submit')}</span>
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <WebcamCapture
                setFaceDescription={setFaceDescription}
                title={t('login.faceTitle')}
                subtitle={t('login.faceSubtitle')}
              />

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-300">
                <span className="font-semibold">{t('login.vectorStatus')}</span>
                {faceDescription ? (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    {t('login.vectorReady')}
                  </span>
                ) : (
                  <span className="text-slate-500 dark:text-slate-400 italic">
                    {t('login.vectorWaiting')}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleFaceLogin}
                disabled={loading || !faceDescription}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 active:scale-[0.99] text-white font-bold rounded-2xl shadow-xl hover:shadow-teal-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ScanFace className="w-5 h-5" />
                )}
                <span>{t('login.faceSubmit')}</span>
              </button>
            </div>
          )}

          {/* Quick Demo Credentials Assistant */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{t('login.demo')}</span>
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
              <button
                type="button"
                onClick={() => fillDemoAccount('customer')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 transition-all hover:border-emerald-300 shadow-sm whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>{t('login.customer')}</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('staff')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 transition-all hover:border-teal-300 shadow-sm whitespace-nowrap"
              >
                <UserCheck className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                <span>{t('login.staff')}</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('admin')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 transition-all hover:border-amber-300 shadow-sm whitespace-nowrap"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>{t('login.admin')}</span>
              </button>
            </div>
          </div>

          {/* Registration Footer Link */}
          <div className="pt-2 text-center text-sm text-slate-500 dark:text-slate-400">
            {t('login.noAccount')}{' '}
            <Link
              to="/register"
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              <span>{t('login.register')}</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Luxury Brand Visual Showcase (5 cols on lg) */}
        <div className="hidden lg:block lg:col-span-5 relative bg-slate-950 overflow-hidden min-h-[640px]">
          <img
            src={img3}
            width="720"
            height="960"
            alt={t('login.heroAlt')}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-85 transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-between p-10 text-white z-10">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold tracking-wide shadow-lg">
              <Car className="w-4 h-4 text-emerald-400" />
              <span>{t('login.facility')}</span>
            </div>

            {/* Bottom Content Card */}
            <div className="space-y-4 bg-slate-900/85 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/10 shadow-2xl">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('login.experience')}</span>
              </div>
              <h3 className="font-display font-extrabold text-xl leading-snug">
                {t('login.recognition')}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t('login.heroDescription')}
              </p>
              <div className="pt-2 flex items-center gap-5 text-xs font-semibold text-emerald-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t('login.accuracy')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t('login.gateSpeed')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
