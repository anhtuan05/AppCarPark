import { useState, useRef, useEffect, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { loadFaceModels, areModelsLoaded } from '../services/faceModelLoader';
import { serializeDescriptor } from '../utils/descriptorUtils';

export const useFaceRecognition = ({ onDescriptorExtracted } = {}) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [isCaptured, setIsCaptured] = useState(false);
  const [modelsReady, setModelsReady] = useState(areModelsLoaded());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  // Initialize face recognition models once
  useEffect(() => {
    let mounted = true;
    if (!areModelsLoaded()) {
      loadFaceModels()
        .then(() => {
          if (mounted) setModelsReady(true);
        })
        .catch((err) => {
          console.error('Model loader error:', err);
          if (mounted) {
            setError({ key: 'face.modelError' });
          }
        });
    }
    return () => {
      mounted = false;
    };
  }, []);

  // Cleanup camera stream on unmount
  useEffect(() => {
    const webcam = webcamRef.current;
    return () => {
      if (webcam?.video?.srcObject) {
        const stream = webcam.video.srcObject;
        if (stream && typeof stream.getTracks === 'function') {
          stream.getTracks().forEach((track) => track.stop());
        }
      }
    };
  }, []);

  // Core face analysis routine on a given image source (dataUrl / URL / image state)
  const analyzeImageSrc = useCallback(
    async (srcToAnalyze) => {
      const targetSrc = srcToAnalyze || image;
      if (!targetSrc) {
        setError({ key: 'face.photoRequired' });
        return null;
      }

      setIsAnalyzing(true);
      setError(null);
      setFeedback(null);

      try {
        if (!areModelsLoaded()) {
          await loadFaceModels();
        }

        // Create an in-memory HTMLImageElement to detect faces cleanly
        const imgElement = new Image();
        imgElement.crossOrigin = 'anonymous';
        imgElement.src = targetSrc;

        await new Promise((resolve, reject) => {
          imgElement.onload = resolve;
          imgElement.onerror = () =>
            reject(new Error('IMAGE_DECODE_ERROR'));
        });

        const detections = await faceapi
          .detectAllFaces(imgElement)
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (detections && detections.length > 0) {
          const primaryDescriptor = detections[0].descriptor;
          const serialized = serializeDescriptor(primaryDescriptor);
          setFeedback({
            success: true,
            key: 'face.success',
            values: { count: detections.length },
          });
          if (onDescriptorExtracted) {
            onDescriptorExtracted(serialized);
          }
          return serialized;
        } else {
          setError({ key: 'face.noFace' });
          if (onDescriptorExtracted) {
            onDescriptorExtracted(null);
          }
          return null;
        }
      } catch (err) {
        console.error('Error during face analysis:', err);
        setError(
          err.message === 'IMAGE_DECODE_ERROR'
            ? { key: 'face.imageDecodeError' }
            : { key: 'face.analysisError', values: { detail: err.message || undefined } },
        );
        if (onDescriptorExtracted) {
          onDescriptorExtracted(null);
        }
        return null;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [image, onDescriptorExtracted]
  );

  // Capture photo from webcam
  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    const screenshot = webcamRef.current.getScreenshot();
    if (screenshot) {
      setImage(screenshot);
      setIsCaptured(true);
      setError(null);
      setFeedback(null);
      // Auto-analyze immediately after capture for better UX
      analyzeImageSrc(screenshot);
    }
  }, [analyzeImageSrc]);

  // Upload an image from local file or sample data URL
  const uploadImage = useCallback(
    (fileOrDataUrl) => {
      setError(null);
      setFeedback(null);

      if (!fileOrDataUrl) return;

      if (typeof fileOrDataUrl === 'string') {
        setImage(fileOrDataUrl);
        setIsCaptured(true);
        analyzeImageSrc(fileOrDataUrl);
        return;
      }

      if (fileOrDataUrl instanceof File || fileOrDataUrl instanceof Blob) {
        if (fileOrDataUrl.type && !fileOrDataUrl.type.startsWith('image/')) {
          setError({ key: 'face.fileTypeError' });
          return;
        }

        // Limit size to 10MB
        if (fileOrDataUrl.size > 10 * 1024 * 1024) {
          setError({ key: 'face.fileSizeError' });
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target.result;
          setImage(dataUrl);
          setIsCaptured(true);
          analyzeImageSrc(dataUrl);
        };
        reader.onerror = () => {
          setError({ key: 'face.fileReadError' });
        };
        reader.readAsDataURL(fileOrDataUrl);
      }
    },
    [analyzeImageSrc]
  );

  // Retake or reset photo
  const retake = useCallback(() => {
    setImage(null);
    setIsCaptured(false);
    setError(null);
    setFeedback(null);
    if (onDescriptorExtracted) {
      onDescriptorExtracted(null);
    }
  }, [onDescriptorExtracted]);

  // Handle camera access failure
  const handleCameraError = useCallback((err) => {
    console.warn('Webcam camera error:', err);
    setCameraError({ key: 'face.webcamError' });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    webcamRef,
    image,
    isCaptured,
    modelsReady,
    isAnalyzing,
    error,
    feedback,
    cameraError,
    capture,
    analyzeImage: () => analyzeImageSrc(),
    uploadImage,
    retake,
    handleCameraError,
    clearError,
  };
};

export default useFaceRecognition;
