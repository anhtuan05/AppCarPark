import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Car,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Palette,
  Tag,
} from 'lucide-react';
import Alert from '../../shared/ui/Alert';
import Button from '../../shared/ui/Button';
import DataCard from '../../shared/ui/DataCard';
import Field from '../../shared/ui/Field';
import {
  useVehiclesQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} from '../../features/vehicles/queries/useVehicleQueries';
import garageBg from '../../Img/garage-bg.webp';

export const VehicleManagement = () => {
  const { t } = useTranslation();
  const { data: vehicles = [], isLoading } = useVehiclesQuery();
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

  const handleCancelEdit = (clearFeedback = true) => {
    setFormData({
      id: null,
      license_plate: '',
      color: '',
      brand: '',
      car_model: '',
    });
    if (clearFeedback) setFormFeedback(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormFeedback(null);

    try {
      if (formData.id) {
        await updateMutation.mutateAsync({ id: formData.id, data: formData });
        setFormFeedback({ type: 'success', key: 'vehicles.updated' });
      } else {
        await createMutation.mutateAsync(formData);
        setFormFeedback({ type: 'success', key: 'vehicles.added' });
      }
      handleCancelEdit(false);
    } catch (error) {
      setFormFeedback({
        type: 'error',
        key: 'vehicles.saveError',
        values: { detail: error.response?.data?.detail || error.message },
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('vehicles.deleteConfirm'))) {
      try {
        await deleteMutation.mutateAsync(id);
        setFormFeedback({ type: 'success', key: 'vehicles.removed' });
      } catch {
        setFormFeedback({ type: 'error', key: 'vehicles.deleteError' });
      }
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Smart Digital Garage Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-emerald-950 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <img
            src={garageBg}
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
              <Car className="w-3.5 h-3.5" />
              <span>Smart EV Fleet</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('vehicles.title')}
            </h1>
            <p className="text-sm text-emerald-100/75 mt-1 max-w-xl">
              {t('vehicles.description')}
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md text-xs font-bold text-emerald-200">
            {t('vehicles.registered', { count: vehicles.length })}
          </div>
        </div>
      </div>

      <DataCard className="space-y-6 sm:p-8">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Car className="w-6 h-6 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {formData.id ? t('vehicles.editTitle') : t('vehicles.registerTitle')}
          </h2>
        </div>

        {formFeedback ? (
          <Alert type={formFeedback.type}>{t(formFeedback.key, formFeedback.values)}</Alert>
        ) : null}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Field
                id="vehicle-license-plate"
                type="text"
                name="license_plate"
                label={t('vehicles.licensePlate')}
                value={formData.license_plate}
                onChange={handleChange}
                placeholder={t('vehicles.licensePlaceholder')}
                autoComplete="off"
                spellCheck={false}
                required
                className="font-mono uppercase"
              />

          <Field
              id="vehicle-brand"
              type="text"
              name="brand"
              label={t('vehicles.brand')}
              value={formData.brand}
              onChange={handleChange}
              placeholder={t('vehicles.brandPlaceholder')}
              autoComplete="off"
              required
            />

          <Field
              id="vehicle-model"
              type="text"
              name="car_model"
              label={t('vehicles.model')}
              value={formData.car_model}
              onChange={handleChange}
              placeholder={t('vehicles.modelPlaceholder')}
              autoComplete="off"
              required
            />

          <Field
              id="vehicle-color"
              type="text"
              name="color"
              label={t('vehicles.color')}
              value={formData.color}
              onChange={handleChange}
              placeholder={t('vehicles.colorPlaceholder')}
              autoComplete="off"
              required
            />

          <div className="flex flex-col gap-3 pt-2 min-[420px]:flex-row min-[420px]:items-center sm:col-span-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : formData.id ? (
                <Pencil className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              <span>{formData.id ? t('vehicles.update') : t('vehicles.add')}</span>
            </Button>

            {formData.id && (
              <Button
                onClick={() => handleCancelEdit()}
                variant="secondary"
                size="lg"
              >
                {t('common.cancel')}
              </Button>
            )}
          </div>
        </form>
      </DataCard>

      {/* Registered Vehicles List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {t('vehicles.registered', { count: vehicles.length })}
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
                className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
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
                      <span>{t('vehicles.modelValue', { value: vehicle.car_model || t('common.notAvailable') })}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-slate-400" />
                      <span>{t('vehicles.colorValue', { value: vehicle.color || t('common.notAvailable') })}</span>
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
                    <span>{t('common.edit')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(vehicle.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t('common.delete')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
            {t('vehicles.empty')}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleManagement;
