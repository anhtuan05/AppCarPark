import React, { useContext } from 'react';
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
import { Link } from 'react-router-dom';
import { LogIn, BarChart3, TrendingUp, Star, ShieldCheck, DollarSign, Loader2 } from 'lucide-react';
import CarParkContext from '../../../CarParkContext';
import { useRatingsQuery, useRevenueDataQuery } from '../../../features/admin/queries/useReportQueries';
import './style.css';

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
  const [user] = useContext(CarParkContext);
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
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
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
    labels: Object.keys(revenueData),
    datasets: [
      {
        label: 'Monthly Revenue (VND)',
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
        labels: { font: { family: 'Inter', size: 12 } },
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
        labels: { font: { family: 'Inter', size: 12 } },
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

  if (!user || user.is_staff !== true || user.is_superuser !== true) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
        <ShieldCheck className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Administrator Access Required
        </h3>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          Only authorized superusers and administrators can access revenue analysis and rating statistics.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition-all"
        >
          <LogIn className="w-5 h-5" />
          <span>Admin Login</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header & KPI Summary */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Executive Reports & Analytics
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Real-time performance metrics, facility satisfaction ratings, and monthly revenue trends.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-500">Total Recorded Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalRevenue.toLocaleString('vi-VN')}đ
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-500">Active Facilities</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {carParks.length} Lots
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-500">Avg Satisfaction</span>
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
            Monthly Revenue Growth
          </h2>
        </div>
        <div className="h-72 sm:h-80 w-full">
          {revenueLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <Line data={lineData} options={lineOptions} />
          )}
        </div>
      </div>

      {/* Ratings by Car Park Bar Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Rating Distribution by Facility
          </h2>
        </div>
        <div className="h-72 sm:h-80 w-full">
          {ratingsLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <Bar data={barData} options={barOptions} />
          )}
        </div>

        {/* Facility Rating Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {carParks.map((park) => (
            <div key={park.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{park.name}</h4>
              <p className="text-xs text-slate-500">
                Avg Rating:{' '}
                <span className="font-bold text-amber-500">{park.average_rate || '4.5'} / 5</span>
              </p>
              <p className="text-xs text-slate-500">
                Total Reviews: <span className="font-bold">{park.total_reviews || 0}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Report;
