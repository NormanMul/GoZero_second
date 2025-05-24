import { RecyclingCenter } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";

interface CenterDetailProps {
  center: RecyclingCenter;
  onRequestPickup: () => void;
}

export function CenterDetail({ center, onRequestPickup }: CenterDetailProps) {
  // Generate list of materials and whether they're accepted
  const materialTypes = [
    { name: "Plastic", accepted: isMaterialAccepted("Plastic", center) },
    { name: "Paper", accepted: isMaterialAccepted("Paper", center) },
    { name: "Metal", accepted: isMaterialAccepted("Metal", center) },
    { name: "E-Waste", accepted: isMaterialAccepted("E-Waste", center) }
  ];

  return (
    <div className="bg-white rounded-t-2xl shadow-lg p-4">
      <div className="w-16 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
      
      <div className="flex items-start mb-4">
        <div className="w-16 h-16 rounded-lg bg-[#F5F5F5] flex items-center justify-center mr-3">
          <img 
            src={center.imageUrl || "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b"}
            alt={center.name}
            className="w-16 h-16 object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b';
            }}
          />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-base">{center.name}</h2>
          <div className="flex items-center mt-1">
            <FontAwesomeIcon icon="map-marker-alt" className="text-xs text-[#757575] mr-1" />
            <span className="text-xs text-[#757575]">{center.address}</span>
          </div>
          <div className="flex items-center mt-1">
            <FontAwesomeIcon icon="clock" className="text-xs text-[#757575] mr-1" />
            <span className="text-xs text-[#757575]">Open: {center.openingHours || "8AM - 6PM"}</span>
          </div>
        </div>
        <a 
          href={`https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#00AA13] text-white rounded-full w-10 h-10 flex items-center justify-center"
        >
          <FontAwesomeIcon icon="directions" />
        </a>
      </div>
      
      <div className="grid grid-cols-4 gap-2 mb-4">
        {materialTypes.map((material, index) => (
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
        onClick={onRequestPickup}
      >
        <FontAwesomeIcon icon="motorcycle" className="mr-2" />
        <span>Request Pickup Instead</span>
      </Button>
    </div>
  );
}

// Helper function to check if a material is accepted
function isMaterialAccepted(materialType: string, center: RecyclingCenter): boolean {
  if (!center.acceptedMaterials || center.acceptedMaterials.length === 0) {
    return false;
  }
  
  return center.acceptedMaterials.some(material => 
    material.toLowerCase().includes(materialType.toLowerCase())
  );
}
