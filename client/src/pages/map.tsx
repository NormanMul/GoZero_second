import { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { useLocation } from "wouter";
import { MapView } from "@/components/map/map-view";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RecyclingCenter } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function Map() {
  const [, navigate] = useLocation();
  const [location, setLocation] = useLocation();
  const [selectedCenter, setSelectedCenter] = useState<RecyclingCenter | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // Extract center ID from URL if present
  const params = new URLSearchParams(location.split('?')[1]);
  const centerIdFromUrl = params.get('centerId');

  // Fetch all recycling centers
  const { data: centers } = useQuery<RecyclingCenter[]>({
    queryKey: ['/api/recycling-centers'],
  });

  // Set selected center from URL param if present
  useEffect(() => {
    if (centerIdFromUrl && centers) {
      const center = centers.find(c => c.id.toString() === centerIdFromUrl);
      if (center) {
        setSelectedCenter(center);
        setIsBottomSheetOpen(true);
      }
    }
  }, [centerIdFromUrl, centers]);

  const handleBack = () => {
    navigate("/");
  };

  const handleCenterSelect = (center: RecyclingCenter) => {
    setSelectedCenter(center);
    setIsBottomSheetOpen(true);
  };

  const handleRequestPickup = () => {
    navigate("/pickup");
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <AppHeader 
        title="Recycling Centers" 
        showBackButton 
        onBackClick={handleBack}
        showUserIcon={false}
      >
        <button className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
          <FontAwesomeIcon icon="filter" className="text-[#757575]" />
        </button>
      </AppHeader>
      
      <div className="flex-1 relative">
        <MapView 
          selectedCenterId={selectedCenter?.id}
          onSelectCenter={handleCenterSelect}
        />
        
        {/* Bottom sheet with facility details */}
        {isBottomSheetOpen && selectedCenter && (
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg p-4">
            <div className="w-16 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="flex items-start mb-4">
              <div className="w-16 h-16 rounded-lg bg-[#F5F5F5] flex items-center justify-center mr-3">
                <img 
                  src={selectedCenter.imageUrl || "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b"}
                  alt={selectedCenter.name}
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b';
                  }}
                />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-base">{selectedCenter.name}</h2>
                <div className="flex items-center mt-1">
                  <FontAwesomeIcon icon="map-marker-alt" className="text-xs text-[#757575] mr-1" />
                  <span className="text-xs text-[#757575]">{selectedCenter.address}</span>
                </div>
                <div className="flex items-center mt-1">
                  <FontAwesomeIcon icon="clock" className="text-xs text-[#757575] mr-1" />
                  <span className="text-xs text-[#757575]">Open: {selectedCenter.openingHours || "8AM - 6PM"}</span>
                </div>
              </div>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCenter.latitude},${selectedCenter.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#00AA13] text-white rounded-full w-10 h-10 flex items-center justify-center"
              >
                <FontAwesomeIcon icon="directions" />
              </a>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-4">
              {getMaterialTypes(selectedCenter).map((material, index) => (
                <div key={index} className="bg-[#F5F5F5] rounded-lg p-2 text-center">
                  <p className="text-xs text-[#757575] mb-1">{material.name}</p>
                  {material.accepted ? (
                    <FontAwesomeIcon icon="check" className="text-[#4CAF50] text-xs" />
                  ) : (
                    <FontAwesomeIcon icon="times" className="text-[#F44336] text-xs" />
                  )}
                </div>
              ))}
            </div>
            
            <Button
              className="w-full bg-[#00AA13] text-white font-medium py-3 rounded-xl flex items-center justify-center"
              onClick={handleRequestPickup}
            >
              <FontAwesomeIcon icon="motorcycle" className="mr-2" />
              <span>Request Pickup Instead</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get materials accepted by the center
function getMaterialTypes(center: RecyclingCenter) {
  const allMaterials = ["Plastic", "Paper", "Metal", "E-Waste"];
  
  return allMaterials.map(material => ({
    name: material,
    accepted: center.acceptedMaterials 
      ? center.acceptedMaterials.some(m => m.toLowerCase().includes(material.toLowerCase()))
      : false
  }));
}
