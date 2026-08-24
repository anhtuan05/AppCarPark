import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Car,
  Calendar,
  CreditCard,
  History,
  LogIn,
  Pencil,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shield,
  Clock,
  Phone,
  Mail,
} from 'lucide-react';
import CarParkContext from '../../CarParkContext';
import authService from '../../features/auth/api/authApi';
import staffService from '../../features/staff/api/staffApi';
import bookingService from '../../features/booking/api/bookingApi';
import subscriptionService from '../../features/subscription/api/subscriptionApi';
import axiosClient from '../../shared/api/axiosClient';
import { endpoints } from '../../shared/api/endpoints';
import './style.css';

export const PersonalInfo = () => {
  const [user, dispatch] = useContext(CarParkContext);
  const [activeTab, setActiveTab] = useState('profile');

  // State for data sections
  const [userInfo, setUserInfo] = useState(user || {});
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [parkingHistory, setParkingHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Load all user data in parallel (Vercel Best Practice: async-parallel)
  useEffect(() => {
    let isMounted = true;
    const loadAllUserData = async () => {
      setIsLoading(true);
      try {
        const [userRes, bookingRes, subRes, historyRes, paymentRes] = await Promise.allSettled([
          authService.getCurrentUser(),
          bookingService.getBookings(),
          subscriptionService.getSubscriptions(),
          staffService.getParkingHistory(),
          axiosClient.get(endpoints.payment).then((r) => r.data),
        ]);

        if (isMounted) {
          if (userRes.status === 'fulfilled' && userRes.value) {
            setUserInfo(userRes.value);
            setFormData(userRes.value);
            dispatch({ type: 'login', payload: userRes.value });
          }
          if (bookingRes.status === 'fulfilled') setBookings(bookingRes.value);
          if (subRes.status === 'fulfilled') setSubscriptions(subRes.value);
          if (historyRes.status === 'fulfilled') setParkingHistory(historyRes.value);
          if (paymentRes.status === 'fulfilled') setPayments(Array.isArray(paymentRes.value) ? paymentRes.value : []);
        }
      } catch (err) {
        console.error('Error loading profile data:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (user) {
      loadAllUserData();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const updated = await authService.updateProfile(formData);
      setUserInfo(updated);
      dispatch({ type: 'login', payload: updated });
      setEditMode(false);
      setFeedback({ type: 'success', message: 'Profile updated successfully!' });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Failed to update profile: ' + (error.response?.data?.detail || error.message),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '0đ';
    return Number(price).toLocaleString('vi-VN') + 'đ';
  };

  const formatDateTime = (isoDateTime) => {
    if (!isoDateTime) return 'N/A';
    return isoDateTime.replace('Z', '').replace('T', ' ');
  };

  if (!user || user.is_staff === true || user.is_superuser === true) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
        <User className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Customer Login Required
        </h3>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          Please log in to view your personal information and complete parking history.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition-all"
        >
          <LogIn className="w-5 h-5" />
          <span>Login to Account</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Profile Badge */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
            <User className="w-10 h-10" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {userInfo.first_name || userInfo.last_name
                  ? `${userInfo.first_name} ${userInfo.last_name}`
                  : userInfo.username}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/40 text-emerald-200 text-xs font-semibold uppercase">
                Customer
              </span>
            </div>
            <p className="text-emerald-200 text-sm mt-1">@{userInfo.username}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setActiveTab('profile');
            setEditMode(!editMode);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-semibold backdrop-blur-md border border-white/20 transition-all"
        >
          <Pencil className="w-4 h-4" />
          <span>{editMode ? 'Cancel Edit' : 'Edit Profile'}</span>
        </button>
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

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Info</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('parking')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'parking'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Parking Activity ({parkingHistory.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'bookings'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Bookings ({bookings.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('subscriptions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'subscriptions'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Subscriptions ({subscriptions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'payments'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payments ({payments.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : activeTab === 'profile' ? (
          editMode ? (
            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.first_name || ''}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name || ''}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username || ''}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.date_of_birth || ''}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone_number || ''}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all transform active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-xs font-bold uppercase text-slate-400">First Name</span>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{userInfo.first_name || '-'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-xs font-bold uppercase text-slate-400">Last Name</span>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{userInfo.last_name || '-'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-xs font-bold uppercase text-slate-400">Username</span>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{userInfo.username || '-'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-xs font-bold uppercase text-slate-400">Email</span>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{userInfo.email || '-'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-xs font-bold uppercase text-slate-400">Date of Birth</span>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{userInfo.date_of_birth || '-'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-xs font-bold uppercase text-slate-400">Phone Number</span>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{userInfo.phone_number || '-'}</p>
              </div>
            </div>
          )
        ) : activeTab === 'parking' ? (
          parkingHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="text-xs uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3">Spot</th>
                    <th className="py-3">License Plate</th>
                    <th className="py-3">Entry Time</th>
                    <th className="py-3">Exit Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {parkingHistory.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 font-bold">Spot #{item.spot}</td>
                      <td className="py-3 font-mono">{item.vehicle_license_plate || 'N/A'}</td>
                      <td className="py-3 text-xs text-slate-500">{formatDateTime(item.entry_time)}</td>
                      <td className="py-3 text-xs text-slate-500">{formatDateTime(item.exit_time)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-6">No parking activity found.</p>
          )
        ) : activeTab === 'bookings' ? (
          bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="text-xs uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3">ID</th>
                    <th className="py-3">Spot</th>
                    <th className="py-3">Plate</th>
                    <th className="py-3">Start</th>
                    <th className="py-3">End</th>
                    <th className="py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td className="py-3 font-bold">#{b.id}</td>
                      <td className="py-3">Spot #{b.spot}</td>
                      <td className="py-3 font-mono">{b.vehicle_license_plate || 'N/A'}</td>
                      <td className="py-3 text-xs text-slate-500">{formatDateTime(b.start_time)}</td>
                      <td className="py-3 text-xs text-slate-500">{formatDateTime(b.end_time)}</td>
                      <td className="py-3 font-bold text-emerald-600">{b.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-6">No bookings found.</p>
          )
        ) : activeTab === 'subscriptions' ? (
          subscriptions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="text-xs uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3">ID</th>
                    <th className="py-3">Type</th>
                    <th className="py-3">Start Date</th>
                    <th className="py-3">End Date</th>
                    <th className="py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {subscriptions.map((s) => (
                    <tr key={s.id}>
                      <td className="py-3 font-bold">#{s.id}</td>
                      <td className="py-3 font-semibold text-emerald-600">{s.subscription_type_name}</td>
                      <td className="py-3 text-xs text-slate-500">{s.start_date}</td>
                      <td className="py-3 text-xs text-slate-500">{s.end_date}</td>
                      <td className="py-3 font-bold text-emerald-600">{s.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-6">No subscriptions found.</p>
          )
        ) : activeTab === 'payments' ? (
          payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="text-xs uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3">ID</th>
                    <th className="py-3">Amount</th>
                    <th className="py-3">Method</th>
                    <th className="py-3">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 font-bold">#{p.id}</td>
                      <td className="py-3 font-bold text-emerald-600">{formatPrice(p.amount)}</td>
                      <td className="py-3 font-semibold">{p.payment_method || 'Online'}</td>
                      <td className="py-3 text-xs text-slate-500">{p.payment_note || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-6">No payment records found.</p>
          )
        ) : null}
      </div>
    </div>
  );
};

export default PersonalInfo;
