import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam'
import * as faceapi from 'face-api.js';

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [faceDescription, setFaceDescription] = useState(null);
  const [isCaptured, setIsCaptured] = useState(false);

  // Load models for face-api.js
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    };
    loadModels();
  }, []);

  // Capture the photo from webcam
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setIsCaptured(true);
  };

  // Analyze the captured image for face description
  const analyzeImage = async () => {
    const img = document.getElementById('captured-image');
    const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
    
    if (detections.length > 0) {
      const descriptions = detections.map(d => d.descriptor);
      setFaceDescription(JSON.stringify(descriptions[0]));
    } else {
      setFaceDescription('No face detected.');
    }
  };

  // Retake the photo
  const retake = () => {
    setImage(null);
    setIsCaptured(false);
    setFaceDescription(null);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {!isCaptured ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={400}
            height={300}
          />
          <br />
          <button onClick={capture}>Chụp ảnh</button>
        </>
      ) : (
        <>
          <img id="captured-image" src={image} alt="Captured" width={400} height={300} />
          <br />
          <button onClick={analyzeImage}>Phân tích khuôn mặt</button>
          <button onClick={retake}>Chụp lại</button>
        </>
      )}
      {faceDescription && (
        <div>
          <h3>Mô tả khuôn mặt:</h3>
          <p>{faceDescription}</p>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
