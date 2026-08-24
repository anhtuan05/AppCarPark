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

  // Initialize face recognition models once
  useEffect(() => {
    let mounted = true;
    if (!areModelsLoaded()) {
      loadFaceModels()
        .then(() => {
          if (mounted) setModelsReady(true);
        })
        .catch((err) => {
          if (mounted) setError('Failed to load face detection neural models. Please check network/assets.');
        });
    } else {
      setModelsReady(true);
    }
    return () => {
      mounted = false;
    };
  }, []);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (webcamRef.current?.video?.srcObject) {
        const stream = webcamRef.current.video.srcObject;
        if (stream && typeof stream.getTracks === 'function') {
          stream.getTracks().forEach((track) => track.stop());
        }
      }
    };
  }, []);

  // Capture photo from webcam
  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    const screenshot = webcamRef.current.getScreenshot();
    if (screenshot) {
      setImage(screenshot);
      setIsCaptured(true);
      setError(null);
      setFeedback(null);
    }
  }, []);

  // Analyze captured image using face-api.js (in-memory Image, avoiding fragile DOM queries)
  const analyzeImage = useCallback(async () => {
    if (!image) {
      setError('Please capture a photo first.');
      return null;
    }

    setIsAnalyzing(true);
    setError(null);
    setFeedback(null);

    try {
      if (!areModelsLoaded()) {
        await loadFaceModels();
      }

      // Create an in-memory HTMLImageElement
      const imgElement = new Image();
      imgElement.src = image;
      await new Promise((resolve, reject) => {
        imgElement.onload = resolve;
        imgElement.onerror = reject;
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
          message: `Face successfully detected (${detections.length} face${detections.length > 1 ? 's' : ''} found).`,
        });
        if (onDescriptorExtracted) {
          onDescriptorExtracted(serialized);
        }
        return serialized;
      } else {
        setError('No face detected in the image. Please ensure good lighting and face the camera directly.');
        if (onDescriptorExtracted) {
          onDescriptorExtracted(null);
        }
        return null;
      }
    } catch (err) {
      console.error('Error during face analysis:', err);
      setError('An error occurred during facial analysis: ' + (err.message || 'Unknown error'));
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [image, onDescriptorExtracted]);

  // Retake photo
  const retake = useCallback(() => {
    setImage(null);
    setIsCaptured(false);
    setError(null);
    setFeedback(null);
    if (onDescriptorExtracted) {
      onDescriptorExtracted(null);
    }
  }, [onDescriptorExtracted]);

  return {
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
  };
};

export default useFaceRecognition;
