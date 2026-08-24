import React, { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LogIn, Calendar, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import CarParkContext from '../../CarParkContext';
import {
  useSubscriptionTypesQuery,
  useSubscriptionsQuery,
  useCreateSubscriptionMutation,
} from '../../features/subscription/queries/useSubscriptionQueries';
import './style.css';

export const Subscription = () => {
  const [user] = useContext(CarParkContext);
  const { spotId } = useParams();

  const { data: subscriptionTypes = [], isLoading: typesLoading } = useSubscriptionTypesQuery();
  const { data: subscriptionHistory = [], isLoading: historyLoading } = useSubscriptionsQuery();
  const createSubMutation = useCreateSubscriptionMutation();

  const [selectedType, setSelectedType] = useState('');
  const [feedback, setFeedback] = useState(null);

  const handleSubscription = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!selectedType) {
      setFeedback({ type: 'error', message: 'Please select a subscription plan type.' });
      return;
    }

    try {
      const data = {
        subscription_type: selectedType,
        spot: spotId,
      };
      const res = await createSubMutation.mutateAsync(data);
      setFeedback({ type: 'success', message: 'Subscription successfully registered!' });
      setSelectedType('');

      if (res?.short_link) {
        window.open(res.short_link, '_blank');
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Failed to create subscription: ' + (error.response?.data?.detail || error.message),
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
        <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Login Required for Subscription
        </h3>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          Please log in to your customer account to purchase long-term parking passes.
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <Link
          to="/parking"
          className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Register Parking Subscription
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Dedicated parking membership for Spot #{spotId}
          </p>
        </div>
      </div>

      {/* Subscription Form Card */}
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

        <form onSubmit={handleSubscription} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Select Subscription Plan *
            </label>
            {typesLoading ? (
              <div className="text-xs text-slate-500">Loading plans...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {subscriptionTypes.map((type) => {
                  const isSelected = String(selectedType) === String(type.id);
                  return (
                    <div
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                        {type.type}
                      </h4>
                      <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                        {formatPrice(type.total_amount)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={createSubMutation.isPending || !selectedType}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all transform active:scale-95 disabled:opacity-50"
          >
            {createSubMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            <span>Activate Subscription</span>
          </button>
        </form>
      </div>

      {/* Subscription History */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Active & Past Subscriptions ({subscriptionHistory.length})
        </h2>

        {historyLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          </div>
        ) : subscriptionHistory.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3.5">ID</th>
                  <th className="px-4 py-3.5">Plan Type</th>
                  <th className="px-4 py-3.5">Start Date</th>
                  <th className="px-4 py-3.5">End Date</th>
                  <th className="px-4 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-normal">
                {subscriptionHistory.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">#{sub.id}</td>
                    <td className="px-4 py-3.5 font-semibold text-emerald-600">{sub.subscription_type_name}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">{sub.start_date}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">{sub.end_date}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {sub.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
            No subscription records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscription;
