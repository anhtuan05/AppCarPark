import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, CheckCircle2, Loader2, ArrowLeft, CreditCard } from 'lucide-react';
import Alert from '../../shared/ui/Alert';
import {
  useSubscriptionTypesQuery,
  useSubscriptionsQuery,
  useCreateSubscriptionMutation,
} from '../../features/subscription/queries/useSubscriptionQueries';
import { formatCurrency, formatDate, translateStatus } from '../../i18n/formatters';
import subscriptionBg from '../../Img/subscription-bg.webp';

export const Subscription = () => {
  const { t, i18n } = useTranslation();
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
      setFeedback({ type: 'error', key: 'subscription.chooseValidation' });
      return;
    }

    try {
      const data = {
        subscription_type: selectedType,
        spot: spotId,
      };
      const res = await createSubMutation.mutateAsync(data);
      setFeedback({ type: 'success', key: 'subscription.success' });
      setSelectedType('');

      if (res?.short_link) {
        window.open(res.short_link, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        key: 'subscription.error',
        values: { detail: error.response?.data?.detail || error.message },
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* VIP Member Pass Header Banner */}
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

        <div className="relative z-10 flex items-center gap-4">
          <Link
            to="/parking"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all hover:-translate-y-0.5"
            aria-label={t('subscription.backLabel')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-300 text-xs font-bold mb-2 backdrop-blur-md">
              <CreditCard className="w-3.5 h-3.5" />
              <span>VIP Monthly Pass</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('subscription.title')}
            </h1>
            <p className="text-sm text-emerald-100/75 mt-0.5">
              {t('subscription.subtitle', { id: spotId })}
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Form Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {feedback ? <Alert type={feedback.type}>{t(feedback.key, feedback.values)}</Alert> : null}

        <form onSubmit={handleSubscription} className="space-y-6">
          <fieldset>
            <legend className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {t('subscription.selectPlan')} *
            </legend>
            {typesLoading ? (
              <div className="text-xs text-slate-500" role="status">{t('subscription.loadingPlans')}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {subscriptionTypes.map((type) => {
                  const isSelected = String(selectedType) === String(type.id);
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      aria-pressed={isSelected}
                      className={`min-h-28 rounded-2xl border p-5 text-left transition-[background-color,border-color,box-shadow] ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                        {type.type}
                      </h4>
                      <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(type.total_amount, i18n.resolvedLanguage)}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </fieldset>

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
            <span>{t('subscription.activate')}</span>
          </button>
        </form>
      </div>

      {/* Subscription History */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {t('subscription.history', { count: subscriptionHistory.length })}
        </h2>

        {historyLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          </div>
        ) : subscriptionHistory.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
            <table className="w-full min-w-[680px] text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3.5">{t('common.id')}</th>
                  <th className="px-4 py-3.5">{t('subscription.planType')}</th>
                  <th className="px-4 py-3.5">{t('subscription.startDate')}</th>
                  <th className="px-4 py-3.5">{t('subscription.endDate')}</th>
                  <th className="px-4 py-3.5">{t('common.status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-normal">
                {subscriptionHistory.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">#{sub.id}</td>
                    <td className="px-4 py-3.5 font-semibold text-emerald-600">{sub.subscription_type_name}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">{formatDate(sub.start_date, i18n.resolvedLanguage, t('common.notAvailable'))}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">{formatDate(sub.end_date, i18n.resolvedLanguage, t('common.notAvailable'))}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {translateStatus(t, sub.status || 'active')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
            {t('subscription.empty')}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscription;
