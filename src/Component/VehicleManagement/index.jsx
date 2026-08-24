import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Plus,
  Pencil,
  Trash2,
  LogIn,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Shield,
  Palette,
  Tag,
} from 'lucide-react';
import CarParkContext from '../../CarParkContext';
import {
  useVehiclesQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} from '../../features/vehicles/queries/useVehicleQueries';
import './style.css';

export const VehicleManagement = () => {
  const [user] = useContext(CarParkContext);
  const { data: vehicles = [], isLoading, isError } = useVehiclesQuery();
  const createMutation = useCreateVehicleMutation();
  const updateMutation = useUpdateVehicleMutation();
  const deleteMutation = useDeleteVehicleMutation();

  const [formData, setFormData] = useState({
    id: null,
    license_plate: '',
    color: '',
    brand: '',
    car_model: '',
  });

  const [formFeedback, setFormFeedback] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (vehicle) => {
    setFormData(vehicle);
    setFormFeedback(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setFormData({
      id: null,
      license_plate: '',
      color: '',
      brand: '',
      car_model: '',
    });
    setFormFeedback(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormFeedback(null);

    try {
      if (formData.id) {
        await updateMutation.mutateAsync({ id: formData.id, data: formData });
        setFormFeedback({ type: 'success', message: 'Vehicle details updated successfully.' });
      } else {
        await createMutation.mutateAsync(formData);
        setFormFeedback({ type: 'success', message: 'Vehicle added successfully.' });
      }
      handleCancelEdit();
    } catch (error) {
      setFormFeedback({
        type: 'error',
        message: 'Failed to save vehicle: ' + (error.response?.data?.detail || error.message),
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteMutation.mutateAsync(id);
        setFormFeedback({ type: 'success', message: 'Vehicle removed.' });
      } catch (error) {
        setFormFeedback({ type: 'error', message: 'Failed to delete vehicle.' });
      }
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (!user || user.is_staff === true || user.is_superuser === true) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
        <Car className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Vehicle Management Login Required
        </h3>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          Please log in as a registered customer to manage your vehicles and license plates.
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
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Vehicle Management
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Register and update your vehicles for automated license plate scanning and parking verification.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Car className="w-6 h-6 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {formData.id ? 'Edit Vehicle Information' : 'Register New Vehicle'}
          </h2>
        </div>

        {formFeedback && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
              formFeedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {formFeedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{formFeedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              License Plate *
            </label>
            <div className="relative">
              <input
                type="text"
                name="license_plate"
                value={formData.license_plate}
                onChange={handleChange}
                placeholder="e.g. 51F-123.45"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Vehicle Brand *
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g. Toyota, Honda, Mercedes"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Car Model *
            </label>
            <input
              type="text"
              name="car_model"
              value={formData.car_model}
              onChange={handleChange}
              placeholder="e.g. Camry 2.5Q, Civic"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Exterior Color *
            </label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="e.g. White, Black, Silver"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all transform active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : formData.id ? (
                <Pencil className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              <span>{formData.id ? 'Update Vehicle' : 'Add Vehicle'}</span>
            </button>

            {formData.id && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-5 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Registered Vehicles List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Registered Vehicles ({vehicles.length})
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-slate-900 text-emerald-400 font-mono font-bold text-sm rounded-lg border border-slate-700">
                      {vehicle.license_plate}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {vehicle.brand}
                    </span>
                  </div>

                  <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1 pt-2">
                    <p className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-slate-400" />
                      <span>Model: {vehicle.car_model || 'N/A'}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-slate-400" />
                      <span>Color: {vehicle.color || 'N/A'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleEdit(vehicle)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(vehicle.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
            No vehicles registered yet. Use the form above to add your first vehicle.
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleManagement;
