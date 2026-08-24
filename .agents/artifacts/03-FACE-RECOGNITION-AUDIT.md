# 03 - Face Recognition Pipeline & Neural Model Audit

**Audited By:** `face-recognition-auditor` (Frontend Computer Vision Specialist)  
**Date:** 2026-08-20  
**Library:** `face-api.js` (v0.22.2)  
**Model Directory:** `public/models`

---

## 1. Model Asset Inventory & Validation

| Model Network | Manifest File | Shard Files | Physical Presence | Loaded in Code? | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SSD MobileNet V1** | `ssd_mobilenetv1_model-weights_manifest.json` (26.5 KB) | `shard1` (4.19 MB), `shard2` (1.42 MB) | Verified | **YES** (`WebcamCapture`) | **ACTIVE** |
| **Face Landmark 68** | `face_landmark_68_model-weights_manifest.json` (7.8 KB) | `shard1` (356.8 KB) | Verified | **YES** (`WebcamCapture`) | **ACTIVE** |
| **Face Recognition Net** | `face_recognition_model-weights_manifest.json` (18.3 KB) | `shard1` (4.19 MB), `shard2` (2.25 MB) | Verified | **YES** (`WebcamCapture`) | **ACTIVE** |
| **Tiny Face Detector** | `tiny_face_detector_model-weights_manifest.json` (2.9 KB) | `shard1` (193.3 KB) | Verified | NO | UNUSED / AVAILABLE |
| **Face Landmark 68 Tiny** | `face_landmark_68_tiny_model-weights_manifest.json` (4.4 KB) | `shard1` (77.2 KB) | Verified | NO | UNUSED / AVAILABLE |
| **Age / Gender Net** | `age_gender_model-weights_manifest.json` (7.7 KB) | `shard1` (429.7 KB) | Verified | NO | UNUSED / AVAILABLE |
| **Face Expression Net** | `face_expression_model-weights_manifest.json` (6.3 KB) | `shard1` (329.4 KB) | Verified | NO | UNUSED / AVAILABLE |
| **MTCNN** | `mtcnn_model-weights_manifest.json` (3.1 KB) | `shard1` (1.98 MB) | Verified | NO | UNUSED / AVAILABLE |

> **Critical Safety Check:**
> All 8 model manifests and their corresponding binary weight shards exist with 100% integrity in `public/models/`.
> Under Vite, `public/models/*` maps directly to root URI `/models/*`.
> **DO NOT** delete, rename, or compress any shards.

---

## 2. Pipeline Analysis in Legacy Code

In `src/Component/WebcamCapture/index.js`:
1. **Model Loading:**
   ```javascript
   useEffect(() => {
     const loadModels = async () => {
       await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
       await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
       await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
     };
     loadModels();
   }, []);
   ```
   *Issue:* Models are reloaded from network/IndexedDB every time `WebcamCapture` mounts. If a user navigates away and back, redundant downloads or parse cycles execute.

2. **Image Capture & Detection:**
   ```javascript
   const capture = () => {
     const imageSrc = webcamRef.current.getScreenshot();
     setImage(imageSrc);
     setIsCaptured(true);
   };

   const analyzeImage = async () => {
     const img = document.getElementById('captured-image'); // Fragile DOM query
     const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
     if (detections.length > 0) {
       const descriptions = detections.map(d => d.descriptor);
       const faceDesc = JSON.stringify(Array.from(descriptions[0])); // 128-D Float32Array serialized as JSON array
       setFaceDescription(faceDesc);
     }
   };
   ```

3. **Descriptor Serialization Contract:**
   - 128-dimensional Float32Array serialized via `JSON.stringify(Array.from(descriptions[0]))`.
   - String format example: `"[0.12345, -0.6789, 0.4567, ...]"`
   - Backend `https://anhtuan05.pythonanywhere.com/user/login-with-face/` and `/user/` endpoint expect this exact format.
   - **DO NOT** alter the descriptor serialization format or dimensions.

---

## 3. Recommended Modernized Architecture

Refactor into a dedicated module: `src/features/face-recognition/`:

```
src/features/face-recognition/
├── services/
│   └── faceModelLoader.js     # Singleton model loader promise cache (loads once per app lifecycle)
├── hooks/
│   └── useFaceRecognition.js  # Clean hook managing webcam state, model load status, analysis & error states
├── components/
│   └── FaceCaptureModal.jsx   # UI component with modern camera controls & live visual feedback
└── types / utils/
    └── descriptorUtils.js     # Pure helper for descriptor serialization & validation
```

### Safety & Lifecycle Rules:
1. `faceModelLoader` must cache the loading promise so multiple components share a single initialization.
2. Web camera streams must stop all tracks (`MediaStreamTrack.stop()`) on component unmount to release camera hardware.
3. Replace DOM `document.getElementById` with direct Image object or React Ref.
4. Replace blocking `window.alert()` with non-blocking toasts or inline feedback.
