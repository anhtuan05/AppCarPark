import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  MapPin,
  RefreshCw,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useParkingLotsQuery, useParkingSpotsQuery } from '../../features/parking/queries/useParkingQueries';
import { formatCurrency } from '../../i18n/formatters';
import parkingHeroBg from '../../Img/parking-hero-bg.webp';

const statusMeta = {
  available: { dot: 'bg-emerald-500', card: 'border-emerald-200 bg-emerald-50 text-emerald-950 hover:border-emerald-400 hover:bg-emerald-100' },
  occupied: { dot: 'bg-rose-500', card: 'border-slate-200 bg-slate-100 text-slate-500' },
  reserved: { dot: 'bg-amber-500', card: 'border-amber-200 bg-amber-50 text-amber-800' },
  in_use: { dot: 'bg-rose-500', card: 'border-slate-200 bg-slate-100 text-slate-500' },
  maintenance: { dot: 'bg-slate-400', card: 'border-slate-200 bg-slate-100 text-slate-500' },
};

function ParkingSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" aria-hidden="true">
      {Array.from({ length: 12 }, (_, index) => (
        <div key={index} className="h-28 animate-pulse rounded-2xl bg-slate-200/80" />
      ))}
    </div>
  );
}

export function Parking() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lotsQuery = useParkingLotsQuery();
  const spotsQuery = useParkingSpotsQuery();
  const parkingLots = lotsQuery.data || [];
  const parkingSpots = spotsQuery.data;
  const [selectedLotId, setSelectedLotId] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const firstDialogActionRef = useRef(null);

  const activeLotId = selectedLotId ?? parkingLots[0]?.id ?? null;
  const selectedLot = parkingLots.find((lot) => lot.id === activeLotId) || null;

  const filteredSpots = useMemo(
    () => (parkingSpots || []).filter((spot) => spot.parkinglot === activeLotId),
    [activeLotId, parkingSpots],
  );

  const spotSummary = useMemo(
    () => filteredSpots.reduce(
      (summary, spot) => {
        if (spot.status === 'available') summary.available += 1;
        else summary.unavailable += 1;
        return summary;
      },
      { available: 0, unavailable: 0 },
    ),
    [filteredSpots],
  );

  useEffect(() => {
    if (!selectedSpot) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedSpot(null);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    firstDialogActionRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedSpot]);

  const handleOptionClick = (option) => {
    const spotId = selectedSpot?.id;
    if (!spotId) return;
    navigate(option === 'booking' ? `/booking/${spotId}` : `/subscription/${spotId}`);
    setSelectedSpot(null);
  };

  const isLoading = lotsQuery.isLoading || spotsQuery.isLoading;
  const hasError = lotsQuery.isError || spotsQuery.isError;

  return (
    <div className="space-y-7 sm:space-y-9">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-emerald-500/20 bg-emerald-950 px-5 py-7 text-white shadow-2xl sm:px-8 sm:py-9" aria-labelledby="parking-title">
        {/* Background Image & Holographic Grid Scrim */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <img
            src={parkingHeroBg}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-right opacity-30 mix-blend-screen scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/98 via-emerald-950/85 to-teal-950/70" />
          <div className="absolute -top-16 right-1/4 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span>{t('parking.liveBadge')}</span>
            </div>
            <h1 id="parking-title" className="text-balance font-display text-3xl font-black tracking-tight sm:text-4xl">
              {t('parking.title')}
            </h1>
            <p className="mt-3 text-pretty text-sm leading-6 text-emerald-50/75 sm:text-base">
              {t('parking.description')}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:w-auto">
            <div className="min-w-32 rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-4 backdrop-blur-md shadow-lg transition-all hover:border-emerald-400/40">
              <dt className="text-xs font-semibold text-emerald-100/65">{t('parking.available')}</dt>
              <dd className="mt-1 font-display text-2xl font-black text-emerald-300 tabular-nums">{spotSummary.available}</dd>
            </div>
            <div className="min-w-32 rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-md shadow-lg transition-all hover:border-white/20">
              <dt className="text-xs font-semibold text-emerald-100/65">{t('parking.unavailable')}</dt>
              <dd className="mt-1 font-display text-2xl font-black text-white tabular-nums">{spotSummary.unavailable}</dd>
            </div>
          </dl>
        </div>
      </section>

      {hasError ? (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-900" role="alert">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <h2 className="font-bold">{t('parking.loadErrorTitle')}</h2>
              <p className="mt-1 text-sm text-rose-700">{t('parking.loadErrorDescription')}</p>
            </div>
            <button
              type="button"
              onClick={() => Promise.all([lotsQuery.refetch(), spotsQuery.refetch()])}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-rose-700 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-rose-800"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              {t('common.retry')}
            </button>
          </div>
        </section>
      ) : (
        <>
          <section aria-labelledby="lot-heading">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{t('parking.area')}</p>
                <h2 id="lot-heading" className="mt-1 font-display text-xl font-black text-slate-950 sm:text-2xl">{t('parking.chooseLot')}</h2>
              </div>
              <span className="hidden text-sm font-semibold text-slate-500 sm:block">{t('parking.connectedLots', { count: parkingLots.length })}</span>
            </div>

            {lotsQuery.isLoading ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label={t('parking.mapLoading')}>
                {Array.from({ length: 3 }, (_, index) => <div key={index} className="h-28 animate-pulse rounded-2xl bg-slate-200/80" />)}
              </div>
            ) : parkingLots.length ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {parkingLots.map((lot) => {
                  const isSelected = lot.id === activeLotId;
                  return (
                    <button
                      key={lot.id}
                      type="button"
                      onClick={() => setSelectedLotId(lot.id)}
                      className={`min-h-28 rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.99] ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 shadow-[0_0_0_3px_rgba(16,185,129,0.12)]'
                          : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40'
                      }`}
                      aria-pressed={isSelected}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="min-w-0">
                          <span className="block truncate font-display text-base font-black text-slate-950">{lot.name}</span>
                          <span className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-slate-500">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            <span className="line-clamp-2">{lot.address || t('parking.defaultAddress')}</span>
                          </span>
                        </span>
                        {isSelected ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" /> : null}
                      </span>
                      <span className="mt-3 block text-sm font-black text-emerald-800">
                        {formatCurrency(lot.price_per_hour, i18n.resolvedLanguage)}<span className="font-semibold text-slate-500">{t('parking.perHour')}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-7 text-center text-sm text-slate-500">
                {t('parking.noLots')}
              </div>
            )}
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8" aria-labelledby="spot-heading">
            <div className="mb-5 flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{t('parking.map')}</p>
                <h2 id="spot-heading" className="mt-1 truncate font-display text-xl font-black text-slate-950 sm:text-2xl">
                  {selectedLot?.name || t('parking.chooseALot')}
                </h2>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold text-slate-600">
                {[
                  ['status.available', 'bg-emerald-500'],
                  ['status.reserved', 'bg-amber-500'],
                  ['parking.unavailable', 'bg-slate-400'],
                ].map(([labelKey, color]) => (
                  <span key={labelKey} className="inline-flex items-center gap-1.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                    {t(labelKey)}
                  </span>
                ))}
              </div>
            </div>

            {isLoading ? (
              <ParkingSkeleton />
            ) : filteredSpots.length ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(7.25rem,1fr))] gap-3">
                {filteredSpots.map((spot) => {
                  const isAvailable = spot.status === 'available';
                  const meta = statusMeta[spot.status] || statusMeta.occupied;
                  const statusLabel = t(`status.${spot.status}`, { defaultValue: t('status.unknown') });
                  return (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={() => setSelectedSpot(spot)}
                      disabled={!isAvailable}
                      className={`group flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border p-3 text-center transition-all duration-200 ${meta.card} ${
                        isAvailable ? 'hover:-translate-y-1 hover:shadow-lg active:scale-95 active:translate-y-0' : 'cursor-not-allowed opacity-75'
                      }`}
                      aria-label={t('parking.spotLabel', {
                        id: spot.id,
                        status: statusLabel,
                        action: isAvailable ? t('parking.chooseAction') : '',
                      })}
                    >
                      <Car className={`h-7 w-7 transition-transform duration-200 ${isAvailable ? 'text-emerald-700 group-hover:scale-110' : 'text-slate-400'}`} aria-hidden="true" />
                      <span className="font-display text-base font-black">#{spot.id}</span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold">
                        <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                        {statusLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-7 text-center">
                <Car className="h-9 w-9 text-slate-300" aria-hidden="true" />
                <p className="mt-3 font-bold text-slate-700">{t('parking.noSpotsTitle')}</p>
                <p className="mt-1 text-sm text-slate-500">{t('parking.noSpotsDescription')}</p>
              </div>
            )}
          </section>
        </>
      )}

      {selectedSpot ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto overscroll-contain bg-slate-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedSpot(null);
          }}
        >
          <section
            className="w-full rounded-t-[1.75rem] border border-slate-200 bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-[1.75rem] sm:p-7"
            role="dialog"
            aria-modal="true"
            aria-labelledby="spot-dialog-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{t('parking.selected')}</p>
                <h2 id="spot-dialog-title" className="mt-1 font-display text-2xl font-black text-slate-950">{t('parking.selectedTitle', { id: selectedSpot.id })}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSpot(null)}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-950"
                aria-label={t('parking.closeDialog')}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">{t('parking.dialogDescription')}</p>

            <div className="mt-5 grid gap-3">
              <button
                ref={firstDialogActionRef}
                type="button"
                onClick={() => handleOptionClick('booking')}
                className="group flex min-h-20 items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left transition-[border-color,background-color] hover:border-emerald-400 hover:bg-emerald-100"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-700 text-white">
                  <Clock3 className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-display font-black text-slate-950">{t('parking.hourlyTitle')}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-slate-600">{t('parking.hourlyDescription')}</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleOptionClick('subscription')}
                className="group flex min-h-20 items-center gap-4 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-left transition-[border-color,background-color] hover:border-teal-400 hover:bg-teal-100"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-700 text-white">
                  <CalendarDays className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-display font-black text-slate-950">{t('parking.monthlyTitle')}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-slate-600">{t('parking.monthlyDescription')}</span>
                </span>
              </button>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-500">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              {t('parking.holdNotice')}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

export default Parking;
