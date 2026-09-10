import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, Loader2, CreditCard } from 'lucide-react';
import Alert from '../../shared/ui/Alert';
import {
  useSubscriptionTypesQuery,
  useSubscriptionsQuery,
  useRenewSubscriptionMutation,
} from '../../features/subscription/queries/useSubscriptionQueries';
import { formatCurrency, formatDate } from '../../i18n/formatters';
import subscriptionBg from '../../Img/subscription-bg.webp';

export const ReNewSub = () => {
  const { t, i18n } = useTranslation();
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
        key: 'renewal.validation',
      });
      return;
    }

    try {
      const data = { subscription_type: selectedType };
      const res = await renewMutation.mutateAsync({ subId: selectedSubId, data });
      setFeedback({ type: 'success', key: 'renewal.success' });
      setSelectedType('');
      setSelectedSubId('');

      if (res?.short_link) {
        window.open(res.short_link, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        key: 'renewal.error',
        values: { detail: error.response?.data?.detail || error.message },
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* VIP Member Renewal Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-emerald-950 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <img
            src={subscriptionBg}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-right opacity-30 mix-blend-screen scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/98 via-emerald-950/85 to-teal-950/70" />
          <div className="absolute -bottom-10 right-1/4 h-48 w-48 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
        </div>

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-300 text-xs font-bold mb-2 backdrop-blur-md">
              <CreditCard className="w-3.5 h-3.5" />
              <span>VIP Monthly Pass</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('renewal.title')}
            </h1>
            <p className="text-sm text-emerald-100/75 mt-1">
              {t('renewal.description')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {feedback ? <Alert type={feedback.type}>{t(feedback.key, feedback.values)}</Alert> : null}

        <form onSubmit={handleRenew} className="space-y-6">
          <div>
            <label htmlFor="renew-subscription" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              {t('renewal.selectSubscription')} *
            </label>
            {historyLoading ? (
              <div className="text-xs text-slate-500" role="status">{t('renewal.loadingSubscriptions')}</div>
            ) : subHistory.length > 0 ? (
              <select
                id="renew-subscription"
                name="subscription"
                value={selectedSubId}
                onChange={(e) => setSelectedSubId(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">{t('renewal.chooseSubscription')}</option>
                {subHistory.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {t('renewal.option', { id: sub.id, spot: sub.spot, date: formatDate(sub.end_date, i18n.resolvedLanguage, t('common.notAvailable')) })}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800 border border-amber-200">
                {t('renewal.noActive')}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="renew-plan" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              {t('renewal.selectPlan')} *
            </label>
            {typesLoading ? (
              <div className="text-xs text-slate-500" role="status">{t('subscription.loadingPlans')}</div>
            ) : (
              <select
                id="renew-plan"
                name="subscription_type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">{t('renewal.chooseDuration')}</option>
                {subscriptionTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.type} — {formatCurrency(type.total_amount, i18n.resolvedLanguage)}
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
            <span>{t('renewal.process')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReNewSub;
