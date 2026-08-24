import React from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, ScanFace, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useFaceRecognition } from '../hooks/useFaceRecognition';

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: 'user',
};

export const WebcamCapture = ({ setFaceDescription, title = 'Facial Recognition Capture' }) => {
  const {
    webcamRef,
    image,
    isCaptured,
    modelsReady,
    isAnalyzing,
    error,
    feedback,
    capture,
    analyzeImage,
    retake,
  } = useFaceRecognition({
    onDescriptorExtracted: (descriptor) => {
      if (setFaceDescription) {
        setFaceDescription(descriptor);
      }
    },
  });

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <ScanFace className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
      </div>

      {/* Model Loading Status */}
      {!modelsReady && (
        <div className="w-full mb-4 flex items-center justify-center gap-2 py-2 px-4 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-sm rounded-lg border border-amber-200 dark:border-amber-800">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading neural face detection models...</span>
        </div>
      )}

      {/* Error & Feedback Banners */}
      {error && (
        <div className="w-full mb-4 flex items-start gap-2 p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-sm rounded-xl border border-rose-200 dark:border-rose-800 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {feedback?.success && (
        <div className="w-full mb-4 flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-sm rounded-xl border border-emerald-200 dark:border-emerald-800 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Camera / Snapshot Viewport */}
      <div className="relative w-full aspect-[4/3] max-w-[480px] bg-slate-950 rounded-xl overflow-hidden shadow-inner border border-slate-700 flex items-center justify-center">
        {!isCaptured ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={image}
            alt="Captured face preview"
            className="w-full h-full object-cover"
          />
        )}

        {/* Live scanning overlay effect */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px] flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
            <span className="text-white text-sm font-semibold tracking-wide drop-shadow">Extracting 128D Face Descriptors...</span>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6 w-full">
        {!isCaptured ? (
          <button
            type="button"
            onClick={capture}
            disabled={!modelsReady}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl shadow-md transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera className="w-5 h-5" />
            <span>Take Photo</span>
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={analyzeImage}
              disabled={isAnalyzing}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold rounded-xl shadow-md transition-all transform active:scale-95 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ScanFace className="w-5 h-5" />
              )}
              <span>Analyze Face</span>
            </button>
            <button
              type="button"
              onClick={retake}
              disabled={isAnalyzing}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-all transform active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retake</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default WebcamCapture;
