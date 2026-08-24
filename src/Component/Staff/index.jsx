import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  UserCheck,
  LogIn,
  ScanFace,
  Car,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Clock,
  KeyRound,
  FileCheck,
} from 'lucide-react';
import CarParkContext from '../../CarParkContext';
import WebcamCapture from '../../features/face-recognition/components/WebcamCapture';
import staffService from '../../features/staff/api/staffApi';
import authService from '../../features/auth/api/authApi';
import './style.css';

export function Staff() {
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

  useEffect(() => {
    resetWorkflow();
  }, [currentTab]);

  // Authenticate staff/driver via face descriptor
  const handleFaceRecognition = async () => {
    if (!faceDescription) {
      setFeedback({ type: 'error', message: 'Please capture a facial photo first.' });
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
          message: 'Biometric identity verified successfully. Access token granted.',
        });
      } else {
        setFeedback({ type: 'error', message: 'Face descriptor not recognized in database.' });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Face authentication failed: ' + (err.response?.data?.detail || err.message),
      });
    } finally {
      setIsRecognizingFace(false);
    }
  };

  // Recognize license plate from car image
  const handleCarPlateRecognition = async () => {
    if (!selectedCarImage) {
      setFeedback({ type: 'error', message: 'Please choose or snap a vehicle photo first.' });
      return;
    }

    setIsReadingPlate(true);
    setFeedback(null);

    try {
      const plate = await staffService.recognizeLicensePlate(selectedCarImage);
      if (plate) {
        setLicensePlate(plate);
        setFeedback({ type: 'success', message: `License plate detected: ${plate}` });
      } else {
        setFeedback({ type: 'error', message: 'No license plate detected in the photo.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error reading license plate: ' + err.message });
    } finally {
      setIsReadingPlate(false);
    }
  };

  // Record Entry
  const handleCarEntry = async () => {
    if (!licensePlate || !selectedCarImage) {
      setFeedback({
        type: 'error',
        message: 'Both vehicle image and license plate are required for entry logging.',
      });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      const res = await staffService.recordCarEntry(selectedCarImage, licensePlate, accessToken);
      setEntryData(res);
      setFeedback({ type: 'success', message: 'Vehicle Entry successfully recorded in system!' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Error recording vehicle entry: ' + (err.response?.data?.detail || err.message),
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
        message: 'Both vehicle image and license plate are required for exit logging.',
      });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      const res = await staffService.recordCarExit(selectedCarImage, licensePlate, accessToken);
      setEntryData(res);
      setFeedback({ type: 'success', message: 'Vehicle Exit successfully recorded and spot freed!' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Error recording vehicle exit: ' + (err.response?.data?.detail || err.message),
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.is_staff !== true || user.is_superuser === true) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
        <ShieldCheck className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Staff Gate Operator Portal
        </h3>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          Access to automated gate entry and exit verification is restricted to authorized parking staff.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition-all"
        >
          <LogIn className="w-5 h-5" />
          <span>Staff Login</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Gate Entry & Exit Console
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Operator: <span className="font-bold text-emerald-600">@{user.username}</span> | Smart Barrier Control
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center p-1.5 bg-slate-200 dark:bg-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => setCurrentTab('entry')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              currentTab === 'entry'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Vehicle Entry
          </button>
          <button
            type="button"
            onClick={() => setCurrentTab('exit')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              currentTab === 'exit'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Vehicle Exit
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${
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

      {/* Main Workflow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: Biometric Verification */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
              Driver Face Verification
            </h3>
          </div>

          <WebcamCapture
            setFaceDescription={setFaceDescription}
            title="Driver Facial Snapshot"
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
            <span>Verify Biometrics</span>
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
                License Plate Scanner
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Upload or Capture Car Photo
              </label>
              <input
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
                  alt="Selected Car"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {licensePlate && (
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase">Detected Plate:</span>
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
              <span>Scan License Plate</span>
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
                <span>Authorize & Open Entry Gate</span>
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
                <span>Authorize & Open Exit Gate</span>
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
              Transaction Successfully Verified
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm pt-2">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl">
              <span className="text-xs text-slate-500 block">Assigned Spot</span>
              <span className="font-bold text-slate-900 dark:text-white">Spot #{entryData.spot || 'N/A'}</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl">
              <span className="text-xs text-slate-500 block">Pass Reference</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {entryData.subscription ? `Sub #${entryData.subscription}` : `Booking #${entryData.booking || 'N/A'}`}
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl">
              <span className="text-xs text-slate-500 block">Timestamp</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {entryData.entry_time || entryData.exit_time || 'Recorded'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Staff;
