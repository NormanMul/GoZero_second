import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { useLocation } from "wouter";
import { ItemDetail } from "@/components/result/item-detail";
import { EnvironmentalImpact } from "@/components/result/environmental-impact";
import { DisposalGuide } from "@/components/result/disposal-guide";
import { useQuery } from "@tanstack/react-query";
import { Scan, RecognitionResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Chatbot } from "@/components/chatbot/chatbot";

export default function Result() {
  const [location, navigate] = useLocation();
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | undefined>(undefined);
  
  // Extract scan ID from the URL
  const scanId = location.split("/").pop();
  
  // Fetch the scan data
  const { data: scan, isLoading } = useQuery<Scan>({
    queryKey: [`/api/scans/${scanId}`],
    enabled: !!scanId && scanId !== "result"
  });
  
  // Process scan data when it changes
  useEffect(() => {
    if (scan) {
      try {
        // Try to parse the AI response if it exists
        let result;
        if (scan.aiResponse) {
          result = typeof scan.aiResponse === 'string' 
            ? JSON.parse(scan.aiResponse) 
            : scan.aiResponse;
        }
        
        // Create a recognition result object, using scan data as fallback
        const recognitionData: RecognitionResult = {
          itemName: scan.itemName || 'Unknown Item',
          category: result?.category || 'Unknown',
          recyclable: result?.recyclable === true || scan.recyclable === 1,
          reusable: result?.reusable === true || scan.reusable === 1,
          materialType: result?.materialType || 'Unknown Material',
          disposalInstructions: result?.disposalInstructions || 'Dispose according to local regulations for this material type.',
          environmentalImpact: {
            co2Saved: scan.co2Saved || result?.environmentalImpact?.co2Saved || 0.5,
            waterSaved: scan.waterSaved || result?.environmentalImpact?.waterSaved || 2.0,
            energySaved: scan.energySaved || result?.environmentalImpact?.energySaved || 1.5,
            description: result?.environmentalImpact?.description || 
              'Recycling this item helps reduce landfill waste and conserves natural resources.'
          }
        };
        
        console.log("Setting recognition result:", recognitionData);
        setRecognitionResult(recognitionData);
      } catch (error) {
        console.error('Error processing scan data:', error);
        
        // Create fallback data even if parsing failed
        const fallbackData: RecognitionResult = {
          itemName: scan.itemName || 'Unknown Item',
          category: 'Unknown',
          recyclable: scan.recyclable === 1,
          reusable: scan.reusable === 1, 
          materialType: 'Unknown Material',
          disposalInstructions: 'Check local recycling guidelines for this item.',
          environmentalImpact: {
            co2Saved: scan.co2Saved || 0.5,
            waterSaved: scan.waterSaved || 2.0,
            energySaved: scan.energySaved || 1.5,
            description: 'Proper disposal of waste items helps protect our environment.'
          }
        };
        
        setRecognitionResult(fallbackData);
      }
    }
  }, [scan]);
  
  // If no scanId in URL and scan was provided via navigation state, redirect
  useEffect(() => {
    if (!scanId || scanId === "result") {
      // If we somehow ended up here without a scan ID, go back to home
      navigate("/");
    }
  }, [scanId, navigate]);

  const handleBack = () => {
    navigate("/");
  };

  const handleGoToPickup = () => {
    if (scan) {
      navigate(`/pickup/${scan.id}`);
    }
  };

  const handleGoToMap = () => {
    navigate("/map");
  };
  
  const handleOpenChat = () => {
    setChatbotOpen(true);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppHeader 
        title="Scan Result" 
        showBackButton 
        onBackClick={handleBack}
        showUserIcon={false} 
        showNotification={false}
      />
      
      <div className="flex-1 overflow-y-auto p-4 pb-4">
        <ItemDetail scan={scan} recognitionResult={recognitionResult} isLoading={isLoading} />
        <EnvironmentalImpact scan={scan} recognitionResult={recognitionResult} isLoading={isLoading} />
        <DisposalGuide scan={scan} recognitionResult={recognitionResult} isLoading={isLoading} />

        <div className="grid grid-cols-3 gap-4 mb-4">
          <Button
            variant="outline"
            className="bg-white gozero-shadow rounded-xl p-4 flex items-center justify-center"
            onClick={handleGoToMap}
          >
            <FontAwesomeIcon icon="map-marker-alt" className="text-[#00AA13] mr-2" />
            <span className="text-sm font-medium">Find Drop-off</span>
          </Button>
          
          <Button
            className="bg-[#00AA13] rounded-xl p-4 flex items-center justify-center text-white"
            onClick={handleGoToPickup}
          >
            <FontAwesomeIcon icon="motorcycle" className="mr-2" />
            <span className="text-sm font-medium">Request Pickup</span>
          </Button>
          
          <Button
            variant="outline"
            className="bg-white gozero-shadow rounded-xl p-4 flex items-center justify-center"
            onClick={handleOpenChat}
          >
            <FontAwesomeIcon icon="comment-alt" className="text-[#9C27B0] mr-2" />
            <span className="text-sm font-medium">Ask GoZero</span>
          </Button>
        </div>
        
        {/* Chatbot Component */}
        <Chatbot 
          isOpen={chatbotOpen} 
          onClose={() => setChatbotOpen(false)} 
          scanContext={recognitionResult}
          initialMessage={`Hi there! I see you've scanned a ${scan?.itemName || 'waste item'}. How can I help you with recycling this item?`}
        />
      </div>
    </div>
  );
}
