import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { useTranslation } from 'react-i18next';
import {
  Camera,
  RefreshCw,
  ScanFace,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Upload,
  AlertTriangle,
  FolderOpen,
} from 'lucide-react';
import { useFaceRecognition } from '../hooks/useFaceRecognition';

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: 'user',
};

export const WebcamCapture = ({
  setFaceDescription,
  title,
  subtitle,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'upload'
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const {
    webcamRef,
    image,
    isCaptured,
    modelsReady,
    isAnalyzing,
    error,
    feedback,
    cameraError,
    capture,
    analyzeImage,
    uploadImage,
    retake,
    handleCameraError,
  } = useFaceRecognition({
    onDescriptorExtracted: (descriptor) => {
      if (setFaceDescription) {
        setFaceDescription(descriptor);
      }
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  return (
    <div className="w-full mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex-shrink-0">
            <ScanFace className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {title || t('face.defaultTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle || t('face.defaultSubtitle')}</p>
          </div>
        </div>
      </div>

      {/* Segmented Mode Switcher Tabs with Generous Width & Padding */}
      {!isCaptured && (
        <div className="flex flex-col sm:flex-row gap-2.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-4 border border-slate-200/70 dark:border-slate-700/70 w-full">
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-5 sm:px-6 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer !m-0 !box-border ${
              activeTab === 'camera'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25 transform scale-[1.01]'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 border border-slate-200/70 dark:border-slate-600/60'
            }`}
          >
            <Camera className="w-4.5 h-4.5 flex-shrink-0" />
            <span>{t('face.cameraTab')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-5 sm:px-6 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer !m-0 !box-border ${
              activeTab === 'upload'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25 transform scale-[1.01]'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 border border-slate-200/70 dark:border-slate-600/60'
            }`}
          >
            <Upload className="w-4.5 h-4.5 flex-shrink-0" />
            <span>{t('face.uploadTab')}</span>
          </button>
        </div>
      )}

      {/* Model Loading Status Banner */}
      {!modelsReady && (
        <div className="w-full mb-4 flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 text-xs sm:text-sm rounded-xl border border-amber-200/80 dark:border-amber-800/60">
          <Loader2 className="w-4 h-4 animate-spin text-amber-600 flex-shrink-0" />
          <span className="font-medium">{t('face.loadingModel')}</span>
        </div>
      )}

      {/* Camera Access Error Banner */}
      {cameraError && activeTab === 'camera' && !isCaptured && (
        <div className="w-full mb-4 p-4 bg-amber-50/90 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs sm:text-sm rounded-2xl border border-amber-300 dark:border-amber-800/80 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
          <div className="space-y-1.5">
            <p className="font-bold leading-tight">{t('face.cameraUnavailable')}</p>
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              {t(cameraError.key, cameraError.values)}
            </p>
            <div>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer !m-0 !box-border"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{t('face.switchToUpload')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Error Banner */}
      {error && (
        <div className="w-full mb-4 flex items-start gap-2.5 p-3.5 bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 text-xs sm:text-sm rounded-2xl border border-rose-200 dark:border-rose-800 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
          <span className="leading-snug">{t(error.key, {
            ...error.values,
            detail: error.values?.detail || t('face.unknownError'),
          })}</span>
        </div>
      )}

      {/* Success Feedback Banner */}
      {feedback?.success && (
        <div className="w-full mb-4 flex items-center gap-2.5 p-3.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm rounded-2xl border border-emerald-300 dark:border-emerald-800 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span className="font-medium leading-snug">{t(feedback.key, feedback.values)}</span>
        </div>
      )}

      {/* Main Viewport Container */}
      <div className="relative w-full aspect-[4/3] max-w-full bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-slate-800 flex items-center justify-center">
        {/* State 1: Live Webcam View */}
        {!isCaptured && activeTab === 'camera' && (
          <div className="relative w-full h-full flex items-center justify-center">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMediaError={handleCameraError}
              className="w-full h-full object-cover"
            />
            {/* Live Facial Guide Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              <div className="w-44 h-56 border-2 border-dashed border-emerald-400/70 rounded-[3rem] animate-pulse flex items-center justify-center">
                <div className="w-full h-0.5 bg-emerald-400/40 relative">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-400/80" />
                </div>
              </div>
              <span className="mt-3 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-[11px] text-emerald-300 font-medium">
                {t('face.alignFace')}
              </span>
            </div>
          </div>
        )}

        {/* State 2: Upload Dropzone View */}
        {!isCaptured && activeTab === 'upload' && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              name="face_image"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileChange}
              className="hidden"
              aria-label={t('face.choosePortrait')}
            />

            <button
              type="button"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex h-full w-full cursor-pointer flex-col items-center justify-center p-6 text-center transition-[background-color,border-color] ${
                isDragging
                  ? 'border-2 border-dashed border-emerald-500 bg-emerald-950/40'
                  : 'border-2 border-dashed border-slate-700 bg-slate-900/90 hover:border-emerald-500/60 hover:bg-slate-900'
              }`}
            >

            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3 border border-emerald-500/30 group-hover:scale-105 transition-transform">
              <FolderOpen className="w-8 h-8" />
            </div>

            <h4 className="text-sm sm:text-base font-bold text-white mb-1">
              {t('face.dropTitle')}
            </h4>
            <p className="text-xs text-slate-400 max-w-xs mb-3">
              {t('face.fileHelp')}
            </p>

            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md transition-all pointer-events-none">
              <Upload className="w-3.5 h-3.5" />
              <span>{t('face.chooseDevice')}</span>
            </span>
            </button>
          </>
        )}

        {/* State 3: Captured / Uploaded Image Preview */}
        {isCaptured && image && (
          <div className="relative w-full h-full">
            <img
              src={image}
              width="640"
              height="480"
              alt={t('face.previewAlt')}
              className="w-full h-full object-cover"
            />

            {/* Radar scanner sweep line animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] radar-line opacity-75" />
            </div>
          </div>
        )}

        {/* Live Analyzing Radar Overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/30 animate-ping" />
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
            </div>
            <span className="text-white text-xs sm:text-sm font-bold tracking-wide drop-shadow">
              {t('face.processing')}
            </span>
          </div>
        )}
      </div>

      {/* Control Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-5 w-full">
        {!isCaptured ? (
          activeTab === 'camera' ? (
            <button
              type="button"
              onClick={capture}
              disabled={!modelsReady}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-7 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm !m-0 !box-border cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{t('face.capture')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={!modelsReady}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-7 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all transform active:scale-95 disabled:opacity-50 text-sm !m-0 !box-border cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>{t('face.browse')}</span>
            </button>
          )
        ) : (
          <>
            <button
              type="button"
              onClick={analyzeImage}
              disabled={isAnalyzing}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition-all transform active:scale-95 disabled:opacity-50 text-xs sm:text-sm !m-0 !box-border cursor-pointer"
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ScanFace className="w-4 h-4" />
              )}
              <span>{t('face.analyzeAgain')}</span>
            </button>

            <button
              type="button"
              onClick={retake}
              disabled={isAnalyzing}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-300/80 dark:border-slate-700 transition-all transform active:scale-95 text-xs sm:text-sm !m-0 !box-border cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t('face.replace')}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default WebcamCapture;
