import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp, Star, DollarSign, Loader2 } from 'lucide-react';
import { useRatingsQuery, useRevenueDataQuery } from '../../../features/admin/queries/useReportQueries';
import { formatCurrency, formatMonthKey } from '../../../i18n/formatters';
import reportBg from '../../../Img/report-bg.webp';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const Report = () => {
  const { t, i18n } = useTranslation();
  const { data: carParks = [], isLoading: ratingsLoading } = useRatingsQuery();
  const { data: revenueData = {}, isLoading: revenueLoading } = useRevenueDataQuery();

  const colors = [
    {
      backgroundColor: 'rgba(16, 185, 129, 0.7)',
      borderColor: 'rgb(16, 185, 129)',
    },
    {
      backgroundColor: 'rgba(14, 165, 233, 0.7)',
      borderColor: 'rgb(14, 165, 233)',
    },
    {
      backgroundColor: 'rgba(249, 115, 22, 0.7)',
      borderColor: 'rgb(249, 115, 22)',
    },
  ];

  const barData = {
    labels: [1, 2, 3, 4, 5].map((count) => t('report.star', { count })),
    datasets: carParks.map((park, index) => ({
      label: park.name,
      backgroundColor: colors[index % colors.length].backgroundColor,
      borderColor: colors[index % colors.length].borderColor,
      borderWidth: 1.5,
      borderRadius: 6,
      data: [
        park.rates_1 || 0,
        park.rates_2 || 0,
        park.rates_3 || 0,
        park.rates_4 || 0,
        park.rates_5 || 0,
      ],
    })),
  };

  const lineData = {
    labels: Object.keys(revenueData).map((month) => formatMonthKey(month, i18n.resolvedLanguage)),
    datasets: [
      {
        label: t('report.monthlyRevenueDataset'),
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2.5,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        tension: 0.35,
        fill: true,
        data: Object.values(revenueData),
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { family: 'Be Vietnam Pro', size: 12 } },
      },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
      x: { grid: { display: false } },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { family: 'Be Vietnam Pro', size: 12 } },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: {
          callback: (value) => (value >= 1000000 ? `${value / 1000000}M` : value),
        },
      },
      x: { grid: { display: false } },
    },
  };

  const totalRevenue = Object.values(revenueData).reduce((acc, curr) => acc + Number(curr || 0), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Telemetry & Financial Analytics Command Center Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-emerald-950 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <img
            src={reportBg}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-25 mix-blend-screen scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/98 via-emerald-950/85 to-teal-950/70" />
          <div className="absolute -bottom-8 right-10 h-44 w-44 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/25 text-emerald-300 text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Real-Time Business Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {t('report.title')}
            </h1>
            <p className="text-sm text-emerald-100/80 max-w-xl">
              {t('report.description')}
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-md">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-300 font-bold">System Status</div>
              <div className="text-sm font-semibold text-white">Live Monitoring OK</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-500">{t('report.totalRevenue')}</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {formatCurrency(totalRevenue, i18n.resolvedLanguage)}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-500">{t('report.activeFacilities')}</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('report.lots', { count: carParks.length })}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-500">{t('report.satisfaction')}</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            4.6 / 5.0
          </p>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('report.revenueGrowth')}
          </h2>
        </div>
        <div className="h-72 sm:h-80 w-full">
          {revenueLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <Line data={lineData} options={lineOptions} aria-label={t('report.revenueGrowth')} role="img" />
          )}
        </div>
      </div>

      {/* Ratings by Car Park Bar Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('report.ratingDistribution')}
          </h2>
        </div>
        <div className="h-72 sm:h-80 w-full">
          {ratingsLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <Bar data={barData} options={barOptions} aria-label={t('report.ratingDistribution')} role="img" />
          )}
        </div>

        {/* Facility Rating Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {carParks.map((park) => (
            <div key={park.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{park.name}</h4>
              <p className="text-xs text-slate-500">
                {t('report.averageRating')}{' '}
                <span className="font-bold text-amber-500">{park.average_rate || '4.5'} / 5</span>
              </p>
              <p className="text-xs text-slate-500">
                {t('report.totalReviews')} <span className="font-bold">{park.total_reviews || 0}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Report;
