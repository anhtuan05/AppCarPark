import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, MapPin, DollarSign, Calendar, Clock, CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useParkingLotsQuery, useParkingSpotsQuery } from '../../features/parking/queries/useParkingQueries';
import './style.css';

export const Parking = () => {
  const navigate = useNavigate();
  const { data: parkingLots = [], isLoading: lotsLoading, error: lotsError } = useParkingLotsQuery();
  const { data: parkingSpots = [], isLoading: spotsLoading, error: spotsError } = useParkingSpotsQuery();

  const [selectedLot, setSelectedLot] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Default to first parking lot once loaded
  useEffect(() => {
    if (parkingLots.length > 0 && !selectedLot) {
      setSelectedLot(parkingLots[0]);
    }
  }, [parkingLots, selectedLot]);

  const handleSpotClick = (spotId, status) => {
    if (status === 'available') {
      setSelectedSpot(spotId);
      setShowModal(true);
    }
  };

  const handleOptionClick = (option) => {
    if (option === 'booking') {
      navigate(`/booking/${selectedSpot}`);
    } else if (option === 'subscription') {
      navigate(`/subscription/${selectedSpot}`);
    }
    setShowModal(false);
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '0đ';
    return Number(price).toLocaleString('vi-VN') + 'đ';
  };

  const filteredSpots = selectedLot
    ? parkingSpots.filter((spot) => spot.parkinglot === selectedLot.id)
    : [];

  const availableCount = filteredSpots.filter((s) => s.status === 'available').length;
  const occupiedCount = filteredSpots.filter((s) => s.status === 'occupied').length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Interactive Parking Map
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Select a location and click any available green parking spot to reserve or register a subscription.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 sm:gap-4 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Available ({availableCount})</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span>Occupied ({occupiedCount})</span>
          </div>
        </div>
      </div>

      {/* Parking Lot Selector Tabs */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Select Parking Facility
        </h2>

        {lotsLoading ? (
          <div className="flex items-center gap-2 text-slate-500 py-4">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
            <span>Loading parking lots...</span>
          </div>
        ) : lotsError ? (
          <div className="p-4 bg-rose-50 text-rose-700 rounded-xl">Failed to load parking lots.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {parkingLots.map((lot) => {
              const isSelected = selectedLot?.id === lot.id;
              return (
                <button
                  key={lot.id}
                  type="button"
                  onClick={() => setSelectedLot(lot)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {lot.name}
                    </h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex-shrink-0">
                      {formatPrice(lot.price_per_hour)}/hr
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{lot.address || 'District 1, Ho Chi Minh City'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Lot Info Banner */}
      {selectedLot && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl">
              <Car className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{selectedLot.name}</h3>
              <p className="text-xs text-slate-300">{selectedLot.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <div className="px-3 py-1 bg-white/10 rounded-lg">
              Rate: <span className="text-emerald-400">{formatPrice(selectedLot.price_per_hour)}/hour</span>
            </div>
          </div>
        </div>
      )}

      {/* Parking Spots Grid */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Parking Spots Matrix
        </h2>

        {spotsLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : filteredSpots.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredSpots.map((spot) => {
              const isAvailable = spot.status === 'available';
              return (
                <div
                  key={spot.id}
                  onClick={() => handleSpotClick(spot.id, spot.status)}
                  className={`group relative p-5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    isAvailable
                      ? 'bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-emerald-400 shadow-md hover:shadow-lg hover:-translate-y-1'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-75'
                  }`}
                >
                  <Car
                    className={`w-9 h-9 transition-transform group-hover:scale-110 ${
                      isAvailable ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <div className="text-center">
                    <span className="block font-bold text-sm">Spot #{spot.id}</span>
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wider ${
                        isAvailable ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      {spot.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
            No spots found for this parking lot.
          </div>
        )}
      </div>

      {/* Modal Dialog for Spot Selection */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Reserve Spot #{selectedSpot}
              </h3>
              <p className="text-xs text-slate-500">
                Choose between hourly reservation (Booking) or long-term monthly pass (Subscription).
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => handleOptionClick('booking')}
                className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      Hourly Booking
                    </h4>
                    <p className="text-xs text-slate-500">Single trip reservation by specific time range</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleOptionClick('subscription')}
                className="flex items-center justify-between p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 border border-teal-300 dark:border-teal-700 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      Subscription Pass
                    </h4>
                    <p className="text-xs text-slate-500">Monthly or annual dedicated parking membership</p>
                  </div>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parking;
