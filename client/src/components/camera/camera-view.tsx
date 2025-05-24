import { useCamera } from '@/hooks/use-camera';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Webcam from 'react-webcam';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

interface CameraViewProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

export function CameraView({ onCapture, onClose }: CameraViewProps) {
  const { 
    webcamRef, 
    hasPermission, 
    isCameraActive,
    error, 
    videoConstraints,
    requestCameraPermission,
    startCamera,
    stopCamera,
    capturePhoto,
    handleCameraReady
  } = useCamera();
  
  const [isCapturing, setIsCapturing] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Start camera when component mounts
  useEffect(() => {
    startCamera();
    
    // Cleanup function
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Handle permissions
  useEffect(() => {
    if (hasPermission === false) {
      toast({
        title: 'Camera Access Denied',
        description: 'Please allow camera access to scan items.',
        variant: 'destructive',
      });
    }
  }, [hasPermission, toast]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: 'Camera Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const handleTakePhoto = () => {
    setIsCapturing(true);
    
    // Add a small delay for visual feedback
    setTimeout(() => {
      const imageSrc = capturePhoto();
      
      if (imageSrc) {
        onCapture(imageSrc);
      } else {
        toast({
          title: 'Capture Failed',
          description: 'Failed to capture image. Please try again.',
          variant: 'destructive',
        });
      }
      
      setIsCapturing(false);
    }, 500);
  };

  // Handle file upload as alternative to camera
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageSrc = e.target?.result as string;
      if (imageSrc) {
        onCapture(imageSrc);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="absolute inset-0 bg-black z-20">
      <div className="relative h-full w-full">
        {/* Camera viewfinder */}
        {hasPermission === true && isCameraActive ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMedia={handleCameraReady}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-black flex items-center justify-center">
            {hasPermission === false ? (
              <div className="text-center p-4">
                <p className="text-white mb-4">Camera access is required to scan items.</p>
                <button 
                  onClick={requestCameraPermission}
                  className="bg-[#00AA13] text-white rounded-lg px-4 py-2"
                >
                  Allow Camera Access
                </button>
              </div>
            ) : (
              <p className="text-white">Loading camera...</p>
            )}
          </div>
        )}
        
        {/* Scanning overlay */}
        <div className="absolute inset-0 scanner-overlay flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border-2 border-white rounded-lg relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white"></div>
          </div>
        </div>
        
        {/* Scanner controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50">
          <div className="flex justify-between items-center">
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center"
            >
              <FontAwesomeIcon icon="times" className="text-[#212121]" />
            </button>
            <button 
              onClick={handleTakePhoto}
              disabled={!isCameraActive || isCapturing}
              className={`w-16 h-16 rounded-full ${isCapturing ? 'bg-gray-400' : 'bg-white'} flex items-center justify-center transition-colors`}
            >
              <FontAwesomeIcon 
                icon="camera" 
                className={`text-xl ${isCapturing ? 'text-gray-600' : 'text-[#00AA13]'}`} 
                spin={isCapturing}
              />
            </button>
            <label className="w-12 h-12 rounded-full bg-white flex items-center justify-center cursor-pointer">
              <FontAwesomeIcon icon="image" className="text-[#212121]" />
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileUpload}
              />
            </label>
          </div>
          <p className="text-white text-center text-sm mt-4">
            Position item in the frame to scan
          </p>
        </div>
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white"
        >
          <FontAwesomeIcon icon="arrow-left" />
        </button>
      </div>
    </div>
  );
}
