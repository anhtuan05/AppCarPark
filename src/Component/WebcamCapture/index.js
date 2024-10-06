import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const WebcamCapture = ({ setFaceDescription }) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
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
      const faceDesc = JSON.stringify(Array.from(descriptions[0]));
      setFaceDescription(faceDesc); // Gọi hàm để cập nhật faceDescription ở Register
    } else {
      setFaceDescription(null);
    }
  };

  // Retake the photo
  const retake = () => {
    setImage(null);
    setIsCaptured(false);
    setFaceDescription(null); // Reset faceDescription khi chụp lại
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {!isCaptured ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={600}
            height={450}
          />
          <br />
          <button onClick={capture}>Take a photo</button>
        </>
      ) : (
        <>
          <img id="captured-image" src={image} alt="Captured" width={400} height={300} />
          <br />
          <button onClick={analyzeImage} style={{ marginRight: '20px' }}>Facial analysis</button>
          <button onClick={retake}>Retake</button>
        </>
      )}
    </div>
  );
};

export default WebcamCapture;
