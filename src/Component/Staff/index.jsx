import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScanFace,
  Car,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import Alert from '../../shared/ui/Alert';
import CarParkContext from '../../CarParkContext';
import WebcamCapture from '../../features/face-recognition/components/WebcamCapture';
import staffService from '../../features/staff/api/staffApi';
import authService from '../../features/auth/api/authApi';
import { formatDateTime } from '../../i18n/formatters';
import garageBg from '../../Img/garage-bg.webp';

export function Staff() {
  const { t, i18n } = useTranslation();
  const [user] = useContext(CarParkContext);
  const [currentTab, setCurrentTab] = useState('entry'); // 'entry' or 'exit'

  // Biometric & Staff Auth
  const [faceDescription, setFaceDescription] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isRecognizingFace, setIsRecognizingFace] = useState(false);

  // Vehicle & Plate State
  const [selectedCarImage, setSelectedCarImage] = useState(null);
  const [carImagePreviewUrl, setCarImagePreviewUrl] = useState(null);
  const [licensePlate, setLicensePlate] = useState('');
  const [isReadingPlate, setIsReadingPlate] = useState(false);

  // Submission State
  const [entryData, setEntryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Manage object URL lifecycle safely (Vercel Best Practice: cleanup transient memory)
  const handleCarImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (carImagePreviewUrl) {
        URL.revokeObjectURL(carImagePreviewUrl);
      }
      setSelectedCarImage(file);
      setCarImagePreviewUrl(URL.createObjectURL(file));
      setFeedback(null);
    }
  };

  useEffect(() => {
    return () => {
      if (carImagePreviewUrl) {
        URL.revokeObjectURL(carImagePreviewUrl);
      }
    };
  }, [carImagePreviewUrl]);

  // Reset tab state
  const resetWorkflow = () => {
    setFaceDescription(null);
    setSelectedCarImage(null);
    if (carImagePreviewUrl) {
      URL.revokeObjectURL(carImagePreviewUrl);
      setCarImagePreviewUrl(null);
    }
    setLicensePlate('');
    setEntryData(null);
    setFeedback(null);
  };

  const handleTabChange = (nextTab) => {
    if (nextTab === currentTab) return;
    resetWorkflow();
    setCurrentTab(nextTab);
  };

  // Authenticate staff/driver via face descriptor
  const handleFaceRecognition = async () => {
    if (!faceDescription) {
      setFeedback({ type: 'error', key: 'staff.captureFace' });
      return;
    }

    setIsRecognizingFace(true);
    setFeedback(null);

    try {
      const res = await authService.loginWithFace(faceDescription);
      if (res?.token?.access_token) {
        setAccessToken(res.token.access_token);
        setFeedback({
          type: 'success',
          key: 'staff.faceVerified',
        });
      } else {
        setFeedback({ type: 'error', key: 'staff.faceUnknown' });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        key: 'staff.faceError',
        values: { detail: err.response?.data?.detail || err.message },
      });
    } finally {
      setIsRecognizingFace(false);
    }
  };

  // Recognize license plate from car image
  const handleCarPlateRecognition = async () => {
    if (!selectedCarImage) {
      setFeedback({ type: 'error', key: 'staff.chooseVehiclePhoto' });
      return;
    }

    setIsReadingPlate(true);
    setFeedback(null);

    try {
      const plate = await staffService.recognizeLicensePlate(selectedCarImage);
      if (plate) {
        setLicensePlate(plate);
        setFeedback({ type: 'success', key: 'staff.plateDetected', values: { plate } });
      } else {
        setFeedback({ type: 'error', key: 'staff.plateUnknown' });
      }
    } catch (err) {
      setFeedback({ type: 'error', key: 'staff.plateError', values: { detail: err.message } });
    } finally {
      setIsReadingPlate(false);
    }
  };

  // Record Entry
  const handleCarEntry = async () => {
    if (!licensePlate || !selectedCarImage) {
      setFeedback({
        type: 'error',
        key: 'staff.entryRequired',
      });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      const res = await staffService.recordCarEntry(selectedCarImage, licensePlate, accessToken);
      setEntryData(res);
      setFeedback({ type: 'success', key: 'staff.entrySuccess' });
    } catch (err) {
      setFeedback({
        type: 'error',
        key: 'staff.entryError',
        values: { detail: err.response?.data?.detail || err.message },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Record Exit
  const handleCarExit = async () => {
    if (!licensePlate || !selectedCarImage) {
      setFeedback({
        type: 'error',
        key: 'staff.exitRequired',
      });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      const res = await staffService.recordCarExit(selectedCarImage, licensePlate, accessToken);
      setEntryData(res);
      setFeedback({ type: 'success', key: 'staff.exitSuccess' });
    } catch (err) {
      setFeedback({
        type: 'error',
        key: 'staff.exitError',
        values: { detail: err.response?.data?.detail || err.message },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* High-tech Gate Operator Terminal Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-emerald-950 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <img
            src={garageBg}
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
              <span>Gate Terminal Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {t('staff.title')}
            </h1>
            <p className="text-sm text-emerald-100/80">
              {t('staff.operator', { username: user.username })}
            </p>
          </div>

          {/* Tab Toggle */}
          <div className="flex items-center p-1.5 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner">
            <button
              type="button"
              onClick={() => handleTabChange('entry')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                currentTab === 'entry'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg font-black shadow-emerald-500/25'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {t('staff.entryTab')}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('exit')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                currentTab === 'exit'
                  ? 'bg-teal-400 text-slate-950 shadow-lg font-black shadow-teal-500/25'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {t('staff.exitTab')}
            </button>
          </div>
        </div>
      </div>

      {feedback ? <Alert type={feedback.type}>{t(feedback.key, feedback.values)}</Alert> : null}

      {/* Main Workflow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: Biometric Verification */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
              {t('staff.faceStep')}
            </h3>
          </div>

          <WebcamCapture
            setFaceDescription={setFaceDescription}
            title={t('staff.faceSnapshot')}
          />

          <button
            type="button"
            onClick={handleFaceRecognition}
            disabled={!faceDescription || isRecognizingFace}
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            {isRecognizingFace ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ScanFace className="w-5 h-5" />
            )}
            <span>{t('staff.verify')}</span>
          </button>
        </div>

        {/* Step 2: License Plate & Vehicle Image */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                {t('staff.plateStep')}
              </h3>
            </div>

            <div>
              <label htmlFor="staff-car-image" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                {t('staff.uploadPhoto')}
              </label>
              <input
                id="staff-car-image"
                name="car_image"
                type="file"
                accept="image/*"
                onChange={handleCarImageChange}
                className="w-full text-xs file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
              />
            </div>

            {carImagePreviewUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video bg-slate-950 flex items-center justify-center">
                <img
                  src={carImagePreviewUrl}
                  width="640"
                  height="360"
                  alt={t('staff.selectedCarAlt')}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {licensePlate && (
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase">{t('staff.detectedPlate')}</span>
                <span className="text-lg font-mono font-bold text-emerald-400 tracking-wider">
                  {licensePlate}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleCarPlateRecognition}
              disabled={!selectedCarImage || isReadingPlate}
              className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {isReadingPlate ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Car className="w-5 h-5" />
              )}
              <span>{t('staff.scanPlate')}</span>
            </button>

            {currentTab === 'entry' ? (
              <button
                type="button"
                onClick={handleCarEntry}
                disabled={isLoading || !licensePlate || !selectedCarImage}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-xl shadow-lg transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                <span>{t('staff.authorizeEntry')}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCarExit}
                disabled={isLoading || !licensePlate || !selectedCarImage}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold rounded-xl shadow-lg transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                <span>{t('staff.authorizeExit')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Result Information Card */}
      {entryData && (
        <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 shadow-md space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-lg">
              {t('staff.transactionSuccess')}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm pt-2">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl">
              <span className="text-xs text-slate-500 block">{t('staff.assignedSpot')}</span>
              <span className="font-bold text-slate-900 dark:text-white">{t('staff.spotValue', { id: entryData.spot || t('common.notAvailable') })}</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl">
              <span className="text-xs text-slate-500 block">{t('staff.passReference')}</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {entryData.subscription
                  ? t('staff.subscriptionReference', { id: entryData.subscription })
                  : t('staff.bookingReference', { id: entryData.booking || t('common.notAvailable') })}
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl">
              <span className="text-xs text-slate-500 block">{t('staff.timestamp')}</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {entryData.entry_time || entryData.exit_time
                  ? formatDateTime(entryData.entry_time || entryData.exit_time, i18n.resolvedLanguage, t('staff.recorded'))
                  : t('staff.recorded')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Staff;
