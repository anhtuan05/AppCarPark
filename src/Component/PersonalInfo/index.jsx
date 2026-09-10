import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  User,
  Car,
  Calendar,
  CreditCard,
  History,
  Pencil,
  CheckCircle2,
  Loader2,
  Shield,
  Clock,
  Phone,
  Mail,
} from 'lucide-react';
import Alert from '../../shared/ui/Alert';
import CarParkContext from '../../CarParkContext';
import authService from '../../features/auth/api/authApi';
import staffService from '../../features/staff/api/staffApi';
import bookingService from '../../features/booking/api/bookingApi';
import subscriptionService from '../../features/subscription/api/subscriptionApi';
import paymentService from '../../features/payments/api/paymentApi';
import { formatCurrency, formatDate, formatDateTime, translateStatus } from '../../i18n/formatters';
import profileBg from '../../Img/profile-bg.webp';

export const PersonalInfo = () => {
  const { t, i18n } = useTranslation();
  const [user, dispatch] = useContext(CarParkContext);
  const userId = user?.id;
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
          paymentService.getPayments(),
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

    if (userId) {
      loadAllUserData();
    }
    return () => {
      isMounted = false;
    };
  }, [dispatch, userId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const updated = await authService.updateProfile(formData);
      setUserInfo(updated);
      dispatch({ type: 'login', payload: updated });
      setEditMode(false);
      setFeedback({ type: 'success', key: 'profile.updateSuccess' });
    } catch (error) {
      setFeedback({
        type: 'error',
        key: 'profile.updateError',
        values: { detail: error.response?.data?.detail || error.message },
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Profile VIP Biometric ID Card */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-emerald-950 p-6 sm:p-8 text-white shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Background Image & Holographic Identity Scrim */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <img
            src={profileBg}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-right opacity-30 mix-blend-screen scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/98 via-emerald-950/85 to-teal-950/70" />
          <div className="absolute -top-12 right-1/3 h-56 w-56 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-600/30 backdrop-blur-md flex items-center justify-center text-white border border-emerald-400/40 shadow-lg shadow-emerald-950/50">
            <User className="w-10 h-10 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {userInfo.first_name || userInfo.last_name
                  ? `${userInfo.first_name} ${userInfo.last_name}`
                  : userInfo.username}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-300 text-xs font-semibold uppercase backdrop-blur-md">
                {t('profile.role')}
              </span>
            </div>
            <p className="text-emerald-200/80 text-sm mt-1">@{userInfo.username}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setActiveTab('profile');
            setEditMode(!editMode);
          }}
          className="relative z-10 inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold backdrop-blur-md border border-white/20 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <Pencil className="w-4 h-4" />
          <span>{editMode ? t('profile.cancelEdit') : t('profile.edit')}</span>
        </button>
      </div>

      {feedback ? <Alert type={feedback.type}>{t(feedback.key, feedback.values)}</Alert> : null}

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
          <span>{t('profile.profileTab')}</span>
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
          <span>{t('profile.parkingTab', { count: parkingHistory.length })}</span>
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
          <span>{t('profile.bookingsTab', { count: bookings.length })}</span>
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
          <span>{t('profile.subscriptionsTab', { count: subscriptions.length })}</span>
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
          <span>{t('profile.paymentsTab', { count: payments.length })}</span>
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
                <label htmlFor="profile-first-name" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  {t('common.firstName')}
                </label>
                <input
                  id="profile-first-name"
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  value={formData.first_name || ''}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="profile-last-name" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  {t('common.lastName')}
                </label>
                <input
                  id="profile-last-name"
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  value={formData.last_name || ''}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="profile-username" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  {t('common.username')}
                </label>
                <input
                  id="profile-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  spellCheck={false}
                  value={formData.username || ''}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="profile-email" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  {t('profile.emailAddress')}
                </label>
                <input
                  id="profile-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="profile-birthday" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  {t('profile.dateOfBirth')}
                </label>
                <input
                  id="profile-birthday"
                  name="date_of_birth"
                  type="date"
                  autoComplete="bday"
                  value={formData.date_of_birth || ''}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="profile-phone" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  {t('common.phone')}
                </label>
                <input
                  id="profile-phone"
                  name="phone_number"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
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
                  <span>{t('common.saveChanges')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-xs font-bold uppercase text-slate-400">{t('common.firstName')}</span>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{userInfo.first_name || '-'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-xs font-bold uppercase text-slate-400">{t('common.lastName')}</span>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{userInfo.last_name || '-'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-xs font-bold uppercase text-slate-400">{t('common.username')}</span>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{userInfo.username || '-'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-xs font-bold uppercase text-slate-400">{t('common.email')}</span>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{userInfo.email || '-'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-xs font-bold uppercase text-slate-400">{t('profile.dateOfBirth')}</span>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{formatDate(userInfo.date_of_birth, i18n.resolvedLanguage, '—')}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-xs font-bold uppercase text-slate-400">{t('common.phone')}</span>
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
                    <th className="py-3">{t('common.spot')}</th>
                    <th className="py-3">{t('common.licensePlate')}</th>
                    <th className="py-3">{t('profile.entryTime')}</th>
                    <th className="py-3">{t('profile.exitTime')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {parkingHistory.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 font-bold">{t('staff.spotValue', { id: item.spot })}</td>
                      <td className="py-3 font-mono">{item.vehicle_license_plate || t('common.notAvailable')}</td>
                      <td className="py-3 text-xs text-slate-500">{formatDateTime(item.entry_time, i18n.resolvedLanguage, t('common.notAvailable'))}</td>
                      <td className="py-3 text-xs text-slate-500">{formatDateTime(item.exit_time, i18n.resolvedLanguage, t('common.notAvailable'))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-6">{t('profile.parkingActivityEmpty')}</p>
          )
        ) : activeTab === 'bookings' ? (
          bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="text-xs uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3">{t('common.id')}</th>
                    <th className="py-3">{t('common.spot')}</th>
                    <th className="py-3">{t('profile.plate')}</th>
                    <th className="py-3">{t('common.start')}</th>
                    <th className="py-3">{t('common.end')}</th>
                    <th className="py-3">{t('common.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td className="py-3 font-bold">#{b.id}</td>
                      <td className="py-3">{t('staff.spotValue', { id: b.spot })}</td>
                      <td className="py-3 font-mono">{b.vehicle_license_plate || t('common.notAvailable')}</td>
                      <td className="py-3 text-xs text-slate-500">{formatDateTime(b.start_time, i18n.resolvedLanguage, t('common.notAvailable'))}</td>
                      <td className="py-3 text-xs text-slate-500">{formatDateTime(b.end_time, i18n.resolvedLanguage, t('common.notAvailable'))}</td>
                      <td className="py-3 font-bold text-emerald-600">{translateStatus(t, b.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-6">{t('profile.bookingsEmpty')}</p>
          )
        ) : activeTab === 'subscriptions' ? (
          subscriptions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="text-xs uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3">{t('common.id')}</th>
                    <th className="py-3">{t('common.type')}</th>
                    <th className="py-3">{t('subscription.startDate')}</th>
                    <th className="py-3">{t('subscription.endDate')}</th>
                    <th className="py-3">{t('common.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {subscriptions.map((s) => (
                    <tr key={s.id}>
                      <td className="py-3 font-bold">#{s.id}</td>
                      <td className="py-3 font-semibold text-emerald-600">{s.subscription_type_name}</td>
                      <td className="py-3 text-xs text-slate-500">{formatDate(s.start_date, i18n.resolvedLanguage, t('common.notAvailable'))}</td>
                      <td className="py-3 text-xs text-slate-500">{formatDate(s.end_date, i18n.resolvedLanguage, t('common.notAvailable'))}</td>
                      <td className="py-3 font-bold text-emerald-600">{translateStatus(t, s.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-6">{t('profile.subscriptionsEmpty')}</p>
          )
        ) : activeTab === 'payments' ? (
          payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="text-xs uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3">{t('common.id')}</th>
                    <th className="py-3">{t('profile.amount')}</th>
                    <th className="py-3">{t('common.method')}</th>
                    <th className="py-3">{t('common.note')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 font-bold">#{p.id}</td>
                      <td className="py-3 font-bold text-emerald-600">{formatCurrency(p.amount, i18n.resolvedLanguage)}</td>
                      <td className="py-3 font-semibold">{p.payment_method || t('common.online')}</td>
                      <td className="py-3 text-xs text-slate-500">{p.payment_note || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-6">{t('profile.paymentsEmpty')}</p>
          )
        ) : null}
      </div>
    </div>
  );
};

export default PersonalInfo;
