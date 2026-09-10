import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import Button from '../../shared/ui/Button';
import DataCard from '../../shared/ui/DataCard';
import Field from '../../shared/ui/Field';
import PageHeader from '../../shared/ui/PageHeader';
import communityBg from '../../Img/community-bg.webp';

export function Feedback() {
  const { t } = useTranslation();
  const [feedbackType, setFeedbackType] = useState('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Community Support & Feedback Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-emerald-950 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <img
            src={communityBg}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center opacity-30 mix-blend-screen scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/98 via-emerald-950/85 to-teal-950/70" />
          <div className="absolute -bottom-10 right-1/4 h-48 w-48 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-300 text-xs font-bold mb-2 backdrop-blur-md">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Dedicated User Care</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('feedback.title')}
            </h1>
            <p className="text-sm text-emerald-100/75 mt-1 max-w-xl">
              {t('feedback.description')}
            </p>
          </div>
        </div>
      </div>

      <DataCard className="space-y-6 sm:p-8">
        {submitted ? (
          <div className="space-y-4 py-8 text-center" role="status" aria-live="polite">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('feedback.successTitle')}
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {t('feedback.successDescription')}
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setSubject('');
                setMessage('');
              }}
            >
              {t('feedback.submitAnother')}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <fieldset>
              <legend className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {t('feedback.category')} *
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFeedbackType('general')}
                  aria-pressed={feedbackType === 'general'}
                  className={`flex min-h-12 items-center gap-2 rounded-xl border p-3 text-xs font-bold transition-[background-color,border-color,color,box-shadow] ${
                    feedbackType === 'general'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>{t('feedback.general')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackType('complaint')}
                  aria-pressed={feedbackType === 'complaint'}
                  className={`flex min-h-12 items-center gap-2 rounded-xl border p-3 text-xs font-bold transition-[background-color,border-color,color,box-shadow] ${
                    feedbackType === 'complaint'
                      ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>{t('feedback.complaint')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackType('support')}
                  aria-pressed={feedbackType === 'support'}
                  className={`flex min-h-12 items-center gap-2 rounded-xl border p-3 text-xs font-bold transition-[background-color,border-color,color,box-shadow] ${
                    feedbackType === 'support'
                      ? 'bg-teal-50 border-teal-500 text-teal-700 ring-2 ring-teal-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-teal-600" />
                  <span>{t('feedback.support')}</span>
                </button>
              </div>
            </fieldset>

            <Field
                id="feedback-subject"
                name="subject"
                type="text"
                label={t('feedback.subject')}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t('feedback.subjectPlaceholder')}
                autoComplete="off"
                required
              />

            <Field
                as="textarea"
                id="feedback-message"
                name="message"
                rows={5}
                label={t('feedback.message')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('feedback.messagePlaceholder')}
                autoComplete="off"
                required
              />

            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Send className="w-4 h-4" />
              <span>{t('feedback.send')}</span>
            </Button>
          </form>
        )}
      </DataCard>
    </div>
  );
}

export default Feedback;
