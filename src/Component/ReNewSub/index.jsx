import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, RefreshCw, CheckCircle2, AlertCircle, Loader2, CreditCard } from 'lucide-react';
import CarParkContext from '../../CarParkContext';
import {
  useSubscriptionTypesQuery,
  useSubscriptionsQuery,
  useRenewSubscriptionMutation,
} from '../../features/subscription/queries/useSubscriptionQueries';
import './style.css';

export const ReNewSub = () => {
  const [user] = useContext(CarParkContext);
  const { data: subscriptionTypes = [], isLoading: typesLoading } = useSubscriptionTypesQuery();
  const { data: subHistory = [], isLoading: historyLoading } = useSubscriptionsQuery();
  const renewMutation = useRenewSubscriptionMutation();

  const [selectedType, setSelectedType] = useState('');
  const [selectedSubId, setSelectedSubId] = useState('');
  const [feedback, setFeedback] = useState(null);

  const handleRenew = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!selectedType || !selectedSubId) {
      setFeedback({
        type: 'error',
        message: 'Please select both a subscription pass and the renewal plan.',
      });
      return;
    }

    try {
      const data = { subscription_type: selectedType };
      const res = await renewMutation.mutateAsync({ subId: selectedSubId, data });
      setFeedback({ type: 'success', message: 'Subscription renewed successfully!' });
      setSelectedType('');
      setSelectedSubId('');

      if (res?.short_link) {
        window.open(res.short_link, '_blank');
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Failed to renew subscription: ' + (error.response?.data?.detail || error.message),
      });
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '0đ';
    return Number(price).toLocaleString('vi-VN') + 'đ';
  };

  if (!user || user.is_staff === true || user.is_superuser === true) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
        <CreditCard className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Login Required for Subscription Renewal
        </h3>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          Please log in to your account to renew your ongoing parking subscriptions.
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
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Renew Parking Subscription
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Extend your active parking pass seamlessly without losing your assigned parking spot.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {feedback && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
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

        <form onSubmit={handleRenew} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Select Subscription to Renew *
            </label>
            {historyLoading ? (
              <div className="text-xs text-slate-500">Loading subscriptions...</div>
            ) : subHistory.length > 0 ? (
              <select
                value={selectedSubId}
                onChange={(e) => setSelectedSubId(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">-- Choose active subscription --</option>
                {subHistory.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    Pass #{sub.id} - Spot {sub.spot} (Expires: {sub.end_date})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800 border border-amber-200">
                No active subscriptions found to renew.
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Select Renewal Plan *
            </label>
            {typesLoading ? (
              <div className="text-xs text-slate-500">Loading plans...</div>
            ) : (
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">-- Choose renewal duration --</option>
                {subscriptionTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.type} - {formatPrice(type.total_amount)}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            type="submit"
            disabled={renewMutation.isPending || !selectedType || !selectedSubId}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-all transform active:scale-95 disabled:opacity-50"
          >
            {renewMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
            <span>Process Renewal</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReNewSub;
