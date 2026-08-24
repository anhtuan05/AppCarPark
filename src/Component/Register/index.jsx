import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import WebcamCapture from '../../features/face-recognition/components/WebcamCapture';
import authService from '../../features/auth/api/authApi';
import './style.css';

export function Register() {
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

  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (user.password !== user.confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match. Please verify.' });
      return;
    }

    if (!user.face_description) {
      setFeedback({
        type: 'error',
        message: 'Please capture and analyze your facial snapshot for smart gate entry.',
      });
      return;
    }

    setLoading(true);

    try {
      // Check if face already exists
      try {
        const faceCheck = await authService.loginWithFace(user.face_description);
        if (faceCheck?.token?.access_token) {
          setFeedback({
            type: 'error',
            message: 'This facial profile is already registered with another account.',
          });
          setLoading(false);
          return;
        }
      } catch {
        // Expected when face is not registered yet
      }

      await authService.register(user);
      setFeedback({
        type: 'success',
        message: 'Account successfully registered with facial biometrics! Redirecting to login...',
      });
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Registration failed: ' + (error.response?.data?.detail || error.message),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create Green Car Park Account
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Register with facial biometrics for ticketless, automated barrier entry and exit.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  First Name *
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={user.first_name}
                  onChange={handleChange}
                  placeholder="e.g. John"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={user.last_name}
                  onChange={handleChange}
                  placeholder="e.g. Doe"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleChange}
                placeholder="Choose username"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={user.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={user.date_of_birth}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={user.phone_number}
                  onChange={handleChange}
                  placeholder="0912345678"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                id="terms"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400">
                I agree to the{' '}
                <a href="#terms" className="font-bold text-emerald-600 hover:underline">
                  Terms of Service & Biometric Data Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={!agree || loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all transform active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
              <span>Complete Registration</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-emerald-600 hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        {/* Right Column: Facial Recognition Camera */}
        <div className="lg:col-span-5 space-y-4">
          <WebcamCapture
            setFaceDescription={(desc) => {
              setUser((prev) => ({ ...prev, face_description: desc }));
            }}
            title="Biometric Face Enrollment"
          />

          <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Biometric Security Guarantee</span>
            </div>
            <p>
              Your face image is processed locally in browser into a mathematical 128-dimensional
              vector descriptor. Raw photos are never stored without consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
