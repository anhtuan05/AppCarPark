import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import './style.css';

export function Feedback() {
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Feedback & Support Helpdesk
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Have an inquiry, suggestion, or complaint? Send us a direct message and our management
          team will respond within 24 hours.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Thank You for Your Feedback!
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Your inquiry has been dispatched to our facility customer support team. A ticket reference has been logged.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setSubject('');
                setMessage('');
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Category *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFeedbackType('general')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                    feedbackType === 'general'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>General Feedback</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackType('complaint')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                    feedbackType === 'complaint'
                      ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Report Complaint</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackType('support')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                    feedbackType === 'support'
                      ? 'bg-teal-50 border-teal-500 text-teal-700 ring-2 ring-teal-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-teal-600" />
                  <span>Technical Support</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Subject Title *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your inquiry"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Detailed Message *
              </label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your suggestion or issue in detail..."
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Feedback;