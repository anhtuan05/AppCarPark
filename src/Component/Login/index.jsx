import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Sparkles,
  KeyRound,
  Car,
  UserCheck,
  Shield,
} from 'lucide-react';
import img3 from '../../Img/img3.jpg';
import logo from '../../Img/img2.webp';
import CarParkContext from '../../CarParkContext';
import authService from '../../features/auth/api/authApi';
import WebcamCapture from '../../features/face-recognition/components/WebcamCapture';
import './style.css';

export const Login = () => {
  const [user, dispatch] = useContext(CarParkContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loginMode, setLoginMode] = useState('password'); // 'password' | 'face'
  const [faceDescription, setFaceDescription] = useState(null);
  const navigate = useNavigate();

  // 1-Click Demo Login credentials filler for effortless evaluation
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
          message: `Welcome back, ${data.user.first_name || data.user.username}! Sign in successful.`,
        });
        setTimeout(() => navigate('/'), 600);
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message:
          'Login failed: ' +
          (error.response?.data?.error_description ||
            error.response?.data?.detail ||
            error.message ||
            'Invalid username or password.'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFaceLogin = async () => {
    if (!faceDescription) {
      setFeedback({
        type: 'error',
        message: 'Please click "Take Photo" and "Analyze Face" to generate your biometric face descriptor.',
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
          message: `Face ID Verified! Welcome back, ${data.user.first_name || data.user.username}.`,
        });
        setTimeout(() => navigate('/'), 600);
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message:
          'Biometric face not found in database: ' +
          (error.response?.data?.detail || error.message || 'Please verify your face enrollment or use password.'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-8">
      {/* Outer Card Container with modern glassmorphism & soft gradient border */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
        
        {/* Left Side: Interactive Auth Form (7 cols on lg) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8">
          
          {/* Header & Logo */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="inline-flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500 shadow-sm transition-transform group-hover:scale-105">
                  <img src={logo} alt="Green Car Park Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="font-display font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                    Green Car Park
                  </span>
                  <span className="block text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                    Smart Access Portal
                  </span>
                </div>
              </Link>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>

            <div className="pt-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
                Sign In to Your Account
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Access your parking reservations, active subscriptions, and biometric gate passes.
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setLoginMode('password');
                setFeedback(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                loginMode === 'password'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-md transform scale-[1.01]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Password Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMode('face');
                setFeedback(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                loginMode === 'face'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md transform scale-[1.01]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ScanFace className="w-4 h-4" />
              <span>AI Face ID Sign In</span>
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
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
              )}
              <span className="leading-snug">{feedback.message}</span>
            </div>
          )}

          {/* Form / Face Viewport */}
          {loginMode === 'password' ? (
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Username
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('To reset password, please contact support at mycarpark020924@gmail.com.');
                    }}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span>Remember my session</span>
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
                <span>Sign In Securely</span>
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <WebcamCapture
                setFaceDescription={setFaceDescription}
                title="AI Facial Biometrics Scanner"
              />

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
                <span>Authorize with Biometrics</span>
              </button>
            </div>
          )}

          {/* Quick Demo Credentials Assistant */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Fill Demo Roles</span>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('customer')}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-600 transition-all hover:border-emerald-300"
              >
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Customer</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('staff')}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-600 transition-all hover:border-teal-300"
              >
                <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Staff Gate</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('admin')}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-600 transition-all hover:border-amber-300"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>Super Admin</span>
              </button>
            </div>
          </div>

          {/* Registration Footer Link */}
          <div className="pt-2 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Create an account</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Luxury Brand Visual Showcase (5 cols on lg) */}
        <div className="hidden lg:block lg:col-span-5 relative bg-slate-950 overflow-hidden min-h-[640px]">
          <img
            src={img3}
            alt="Green Car Park Smart Facility"
            className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-between p-10 text-white z-10">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold tracking-wide">
              <Car className="w-4 h-4 text-emerald-400" />
              <span>Smart Facility #01</span>
            </div>

            {/* Bottom Content Card */}
            <div className="space-y-4 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Next-Gen Parking Experience</span>
              </div>
              <h3 className="font-display font-extrabold text-xl leading-snug">
                Automated Facial Recognition & License Plate Entry
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enjoy ticketless, frictionless parking. Drive up to the gate, let our AI verify your
                facial biometrics or vehicle plate in milliseconds, and park hassle-free.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-emerald-300">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>99.8% AI Accuracy</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>&lt; 0.5s Gate Lift</span>
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
