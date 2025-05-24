import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';

export function useCamera() {
  const webcamRef = useRef<Webcam | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set up video constraints - prefer environment camera on mobile
  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'environment',
  };

  // Request camera permissions
  const requestCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      
      // Clean up the stream immediately - we just needed to request permission
      stream.getTracks().forEach((track) => track.stop());
      
      setHasPermission(true);
      setError(null);
    } catch (err) {
      console.error('Error requesting camera permission:', err);
      setHasPermission(false);
      setError('Camera permission denied');
    }
  }, []);

  // Start camera
  const startCamera = useCallback(() => {
    if (!hasPermission) {
      requestCameraPermission();
      return;
    }
    
    setIsCameraActive(true);
  }, [hasPermission, requestCameraPermission]);

  // Stop camera
  const stopCamera = useCallback(() => {
    setIsCameraActive(false);
    
    // Make sure to stop all tracks
    if (webcamRef.current?.video?.srcObject) {
      const tracks = (webcamRef.current.video.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  }, []);

  // Take a photo
  const capturePhoto = useCallback(() => {
    if (!webcamRef.current) {
      setError('Camera not ready');
      return null;
    }
    
    const imageSrc = webcamRef.current.getScreenshot();
    return imageSrc;
  }, []);

  // Handle camera ready state
  const handleCameraReady = useCallback(() => {
    setIsCameraReady(true);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    webcamRef,
    hasPermission,
    isCameraActive,
    isCameraReady,
    error,
    videoConstraints,
    requestCameraPermission,
    startCamera,
    stopCamera,
    capturePhoto,
    handleCameraReady,
  };
}
