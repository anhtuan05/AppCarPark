import * as faceapi from 'face-api.js';

let loadPromise = null;
let modelsLoaded = false;

/**
 * Loads face-api.js neural network models using a singleton cached promise.
 * Avoids duplicate network calls and redundant memory allocation.
 */
export const loadFaceModels = async (modelsPath = '/models') => {
  if (modelsLoaded) {
    return true;
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    try {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(modelsPath),
        faceapi.nets.faceLandmark68Net.loadFromUri(modelsPath),
        faceapi.nets.faceRecognitionNet.loadFromUri(modelsPath),
      ]);
      modelsLoaded = true;
      return true;
    } catch (error) {
      loadPromise = null;
      modelsLoaded = false;
      console.error('Failed to load face-api neural models:', error);
      throw error;
    }
  })();

  return loadPromise;
};

export const areModelsLoaded = () => modelsLoaded;

export default loadFaceModels;
