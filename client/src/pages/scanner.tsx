import { useState } from "react";
import { CameraView } from "@/components/camera/camera-view";
import { useItemRecognition } from "@/hooks/use-item-recognition";
import { useLocation } from "wouter";
import { Spinner } from "@/components/ui/spinner";

export default function Scanner() {
  const [isCaptured, setIsCaptured] = useState(false);
  const { isAnalyzing, recognizeItem, createdScan } = useItemRecognition();
  const [, navigate] = useLocation();

  const handleCapture = async (imageSrc: string) => {
    setIsCaptured(true);
    
    try {
      const result = await recognizeItem(imageSrc);
      
      if (result && result.scan) {
        // Navigate to the result page with the scan ID
        navigate(`/result/${result.scan.id}`);
      } else {
        // Handle error
        throw new Error("Failed to process image");
      }
    } catch (error) {
      console.error("Error during recognition:", error);
      setIsCaptured(false);
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="h-full flex flex-col">
      {isCaptured && isAnalyzing ? (
        <div className="absolute inset-0 bg-black bg-opacity-80 z-30 flex flex-col items-center justify-center">
          <Spinner className="w-16 h-16 text-[#00AA13]" />
          <p className="text-white mt-4 text-center">
            Analyzing item...
            <br />
            <span className="text-sm opacity-70">
              Identifying material and recyclability
            </span>
          </p>
        </div>
      ) : (
        <CameraView onCapture={handleCapture} onClose={handleClose} />
      )}
    </div>
  );
}
