import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  CalendarCheck,
  Car,
  CheckCircle2,
  Clock3,
  History,
  LoaderCircle,
} from 'lucide-react';
import Alert from '../../shared/ui/Alert';
import { useVehiclesQuery } from '../../features/vehicles/queries/useVehicleQueries';
import { useBookingsQuery, useCreateBookingMutation } from '../../features/booking/queries/useBookingQueries';
import { formatDateTime, translateStatus } from '../../i18n/formatters';
import bookingBg from '../../Img/booking-bg.webp';

function StatusBadge({ status }) {
  const { t } = useTranslation();
  const normalizedStatus = status || 'Confirmed';
  const isConfirmed = ['confirmed', 'active', 'completed'].includes(normalizedStatus.toLowerCase());
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${
      isConfirmed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
    }`}>
      {translateStatus(t, normalizedStatus)}
    </span>
  );
}

export function Booking() {
  const { t, i18n } = useTranslation();
  const { spotId } = useParams();
  const { data: vehicles = [], isLoading: vehiclesLoading } = useVehiclesQuery();
  const { data: bookingHistory = [], isLoading: historyLoading } = useBookingsQuery();
  const createBookingMutation = useCreateBookingMutation();
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [feedback, setFeedback] = useState(null);

  const handleBookingSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    if (!selectedVehicle || !startTime || !endTime) {
      setFeedback({ type: 'error', key: 'booking.validationRequired' });
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      setFeedback({ type: 'error', key: 'booking.validationEnd' });
      return;
    }

    try {
      const response = await createBookingMutation.mutateAsync({
        spot: spotId,
        vehicle: selectedVehicle,
        start_time: startTime,
        end_time: endTime,
      });

      setFeedback({ type: 'success', key: 'booking.success', values: { id: spotId } });
      setSelectedVehicle('');
      setStartTime('');
      setEndTime('');

      if (response?.short_link) {
        window.open(response.short_link, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      const detail = error.response?.data?.detail || error.message;
      setFeedback({
        type: 'error',
        key: 'booking.error',
        values: { detail: detail || t('booking.tryAgain') },
      });
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-7 sm:space-y-9">
      <header className="flex items-start gap-3">
        <Link
          to="/parking"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
          aria-label={t('common.backToParking')}
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{t('booking.eyebrow')}</p>
          <h1 className="mt-1 text-balance font-display text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            {t('booking.spotTitle', { id: spotId })}
          </h1>
          <p className="mt-1 text-sm text-slate-600">{t('booking.intro')}</p>
        </div>
      </header>

      <section className="grid overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.72fr_1.28fr]" aria-labelledby="booking-form-title">
        <div className="relative overflow-hidden bg-emerald-950 p-5 text-white sm:p-7 lg:p-8">
          {/* Background Image & Gradient Scrim */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <img
              src={bookingBg}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-center opacity-25 mix-blend-screen scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/95 via-emerald-950/85 to-teal-950/90" />
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-emerald-400/15 blur-2xl" />
          </div>

          <div className="relative z-10">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-emerald-950 shadow-md shadow-emerald-950/40">
              <CalendarCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 id="booking-form-title" className="mt-5 font-display text-2xl font-black">{t('booking.formTitle')}</h2>
            <p className="mt-3 text-sm leading-6 text-emerald-50/70">{t('booking.formDescription')}</p>
            <ul className="mt-6 space-y-3 text-sm font-semibold text-emerald-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" /> {t('booking.instantUpdates')}</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" /> {t('booking.securePayment')}</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" /> {t('booking.easyHistory')}</li>
            </ul>
          </div>
        </div>

        <div className="p-5 sm:p-7 lg:p-8">
          {feedback ? (
            <Alert type={feedback.type} className="mb-5">{t(feedback.key, feedback.values)}</Alert>
          ) : null}

          <form onSubmit={handleBookingSubmit} className="space-y-5" autoComplete="off">
            <div>
              <label htmlFor="booking-vehicle" className="mb-2 block text-sm font-bold text-slate-700">{t('booking.vehicle')} <span className="text-rose-600" aria-hidden="true">*</span></label>
              {vehiclesLoading ? (
                <div className="flex min-h-12 items-center gap-2 rounded-xl bg-slate-100 px-4 text-sm text-slate-500" role="status">
                  <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> {t('booking.loadingVehicles')}
                </div>
              ) : vehicles.length ? (
                <select
                  id="booking-vehicle"
                  name="vehicle"
                  value={selectedVehicle}
                  onChange={(event) => setSelectedVehicle(event.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition-[border-color,box-shadow,background-color] focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100"
                >
                  <option value="">{t('booking.chooseVehicle')}</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.license_plate} — {vehicle.brand} {vehicle.car_model}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  {t('booking.noVehicleStart')} <Link to="/vehicle-management" className="font-black underline underline-offset-2">{t('booking.addVehicle')}</Link> {t('booking.noVehicleEnd')}
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="booking-start" className="mb-2 block text-sm font-bold text-slate-700">{t('common.start')} <span className="text-rose-600" aria-hidden="true">*</span></label>
                <input
                  id="booking-start"
                  name="start_time"
                  type="datetime-local"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition-[border-color,box-shadow,background-color] focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label htmlFor="booking-end" className="mb-2 block text-sm font-bold text-slate-700">{t('common.end')} <span className="text-rose-600" aria-hidden="true">*</span></label>
                <input
                  id="booking-end"
                  name="end_time"
                  type="datetime-local"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition-[border-color,box-shadow,background-color] focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={createBookingMutation.isPending || vehicles.length === 0}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-black text-white shadow-sm transition-[background-color,transform] hover:bg-emerald-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {createBookingMutation.isPending ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> : <CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
              {createBookingMutation.isPending ? t('booking.confirming') : t('booking.confirm')}
            </button>
          </form>
        </div>
      </section>

      <section aria-labelledby="history-title">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{t('booking.recent')}</p>
            <h2 id="history-title" className="mt-1 font-display text-xl font-black text-slate-950 sm:text-2xl">{t('booking.history')}</h2>
          </div>
          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-black text-slate-700">{t('booking.visits', { count: bookingHistory.length })}</span>
        </div>

        {historyLoading ? (
          <div className="flex min-h-40 items-center justify-center rounded-2xl border border-slate-200 bg-white" role="status">
            <LoaderCircle className="h-6 w-6 animate-spin text-emerald-700" aria-hidden="true" />
            <span className="sr-only">{t('booking.loadingHistory')}</span>
          </div>
        ) : bookingHistory.length ? (
          <>
            <div className="grid gap-3 md:hidden">
              {bookingHistory.map((booking) => (
                <article key={booking.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><Car className="h-5 w-5" aria-hidden="true" /></span>
                      <div className="min-w-0"><h3 className="truncate font-black text-slate-950">{t('booking.spotTitle', { id: booking.spot })}</h3><p className="truncate font-mono text-xs font-bold text-slate-500">{booking.vehicle_license_plate || t('booking.noPlate')}</p></div>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs">
                    <div><dt className="text-slate-500">{t('common.start')}</dt><dd className="mt-1 font-bold text-slate-800">{formatDateTime(booking.start_time, i18n.resolvedLanguage, t('common.notAvailable'))}</dd></div>
                    <div><dt className="text-slate-500">{t('common.end')}</dt><dd className="mt-1 font-bold text-slate-800">{formatDateTime(booking.end_time, i18n.resolvedLanguage, t('common.notAvailable'))}</dd></div>
                  </dl>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-500">
                  <tr><th className="px-4 py-3.5">{t('common.id')}</th><th className="px-4 py-3.5">{t('common.spot')}</th><th className="px-4 py-3.5">{t('common.licensePlate')}</th><th className="px-4 py-3.5">{t('common.start')}</th><th className="px-4 py-3.5">{t('common.end')}</th><th className="px-4 py-3.5">{t('booking.duration')}</th><th className="px-4 py-3.5">{t('common.status')}</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {bookingHistory.map((booking) => (
                    <tr key={booking.id} className="transition-colors hover:bg-slate-50">
                      <td className="px-4 py-3.5 font-black text-slate-950">#{booking.id}</td><td className="px-4 py-3.5">#{booking.spot}</td><td className="px-4 py-3.5 font-mono font-bold">{booking.vehicle_license_plate || t('common.notAvailable')}</td><td className="px-4 py-3.5 text-xs">{formatDateTime(booking.start_time, i18n.resolvedLanguage, t('common.notAvailable'))}</td><td className="px-4 py-3.5 text-xs">{formatDateTime(booking.end_time, i18n.resolvedLanguage, t('common.notAvailable'))}</td><td className="px-4 py-3.5 font-bold">{t('common.hours', { count: booking.total_hours ?? 0 })}</td><td className="px-4 py-3.5"><StatusBadge status={booking.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
            <History className="h-9 w-9 text-slate-300" aria-hidden="true" />
            <p className="mt-3 font-bold text-slate-700">{t('booking.emptyTitle')}</p>
            <p className="mt-1 text-sm text-slate-500">{t('booking.emptyDescription')}</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Booking;
