import React, { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LogIn, Calendar, Clock, Car, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import CarParkContext from '../../CarParkContext';
import { useVehiclesQuery } from '../../features/vehicles/queries/useVehicleQueries';
import { useBookingsQuery, useCreateBookingMutation } from '../../features/booking/queries/useBookingQueries';
import './style.css';

export const Booking = () => {
  const [user] = useContext(CarParkContext);
  const { spotId } = useParams();

  const { data: vehicles = [], isLoading: vehiclesLoading } = useVehiclesQuery();
  const { data: bookingHistory = [], isLoading: historyLoading } = useBookingsQuery();
  const createBookingMutation = useCreateBookingMutation();

  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [feedback, setFeedback] = useState(null);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!selectedVehicle || !startTime || !endTime) {
      setFeedback({ type: 'error', message: 'Please select a vehicle and specify start & end times.' });
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      setFeedback({ type: 'error', message: 'Start time must be before end time.' });
      return;
    }

    const bookingData = {
      spot: spotId,
      vehicle: selectedVehicle,
      start_time: startTime,
      end_time: endTime,
    };

    try {
      const res = await createBookingMutation.mutateAsync(bookingData);
      setFeedback({
        type: 'success',
        message: `Booking for Spot #${spotId} confirmed successfully!`,
      });

      // Clear form
      setSelectedVehicle('');
      setStartTime('');
      setEndTime('');

      if (res?.short_link) {
        window.open(res.short_link, '_blank');
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Error submitting booking: ' + (error.response?.data?.detail || error.message),
      });
    }
  };

  const formatDateTime = (isoDateTime) => {
    if (!isoDateTime) return 'N/A';
    const clean = isoDateTime.replace('Z', '').replace('T', ' ');
    return clean;
  };

  if (!user || user.is_staff === true || user.is_superuser === true) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
        <Clock className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Login Required to Reserve Spot
        </h3>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          Please log in with your customer account to complete spot reservations.
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
            Reserve Parking Spot #{spotId}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Complete the reservation details below to secure your spot.
          </p>
        </div>
      </div>

      {/* Booking Form Card */}
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

        <form onSubmit={handleBookingSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Select Vehicle *
            </label>
            {vehiclesLoading ? (
              <div className="text-xs text-slate-500">Loading vehicles...</div>
            ) : vehicles.length > 0 ? (
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">-- Choose registered vehicle --</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.license_plate} - {v.brand} ({v.car_model})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800 border border-amber-200 flex items-center justify-between">
                <span>No registered vehicles found. Please add a vehicle first.</span>
                <Link to="/vehicleManagement" className="font-bold underline text-amber-900">
                  Add Vehicle
                </Link>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Start Time *
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                End Time *
              </label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={createBookingMutation.isPending || vehicles.length === 0}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-all transform active:scale-95 disabled:opacity-50"
          >
            {createBookingMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            <span>Confirm Reservation</span>
          </button>
        </form>
      </div>

      {/* Booking History Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          My Booking History ({bookingHistory.length})
        </h2>

        {historyLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          </div>
        ) : bookingHistory.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3.5">ID</th>
                  <th className="px-4 py-3.5">Spot</th>
                  <th className="px-4 py-3.5">License Plate</th>
                  <th className="px-4 py-3.5">Start Time</th>
                  <th className="px-4 py-3.5">End Time</th>
                  <th className="px-4 py-3.5">Hours</th>
                  <th className="px-4 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-normal">
                {bookingHistory.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">#{booking.id}</td>
                    <td className="px-4 py-3.5">Spot #{booking.spot}</td>
                    <td className="px-4 py-3.5 font-mono font-semibold">{booking.vehicle_license_plate || 'N/A'}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">{formatDateTime(booking.start_time)}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">{formatDateTime(booking.end_time)}</td>
                    <td className="px-4 py-3.5 font-semibold">{booking.total_hours ?? '-'} hrs</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {booking.status || 'Confirmed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
            No booking history found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
