import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Scan, RecyclingCenter } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getPickupDates, pickupTimeSlots } from "@/lib/recycling-data";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Pickup() {
  const [, params] = useRoute("/pickup/:scanId?");
  const scanId = params?.scanId;
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { latitude, longitude } = useGeolocation();

  // Form state
  const [selectedScans, setSelectedScans] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState(getPickupDates()[0].value);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(pickupTimeSlots[0].value);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch scan data if scanId is provided
  const { data: scan, isLoading: isLoadingScan } = useQuery<Scan>({
    queryKey: [`/api/scans/${scanId}`],
    enabled: !!scanId,
  });

  // Add scan to selected scans when loaded
  useEffect(() => {
    if (scan && !selectedScans.includes(scan.id)) {
      // Check if the item is recyclable before allowing pickup
      if (!scan.recyclable) {
        toast({
          title: "Pickup Not Available",
          description: "This item is not recyclable and cannot be scheduled for pickup. Please check disposal options instead.",
          variant: "destructive",
        });
        navigate(`/result/${scan.id}`);
        return;
      }
      setSelectedScans([...selectedScans, scan.id]);
    }
  }, [scan, navigate, toast]);

  // Create pickup mutation
  const createPickupMutation = useMutation({
    mutationFn: async (pickupData: any) => {
      const res = await apiRequest("POST", "/api/pickups", pickupData);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/pickups"] });
      queryClient.invalidateQueries({ queryKey: ["/api/scans"] });
      queryClient.invalidateQueries({ queryKey: ["/api/impact-summary"] });
      navigate(`/pickup-confirmation/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to schedule pickup. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle back button
  const handleBack = () => {
    if (scanId) {
      navigate(`/result/${scanId}`);
    } else {
      navigate("/");
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (selectedScans.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item for pickup",
        variant: "destructive",
      });
      return;
    }

    if (!address) {
      // Use current location if no address provided
      setAddress("Current Location");
    }

    const userId = parseInt(localStorage.getItem("currentUserId") || "1");
    const pickupData = {
      userId,
      scanIds: selectedScans,
      pickupDate: selectedDate,
      pickupTimeSlot: selectedTimeSlot,
      address,
      notes,
      status: "scheduled",
      driverName: "Alex", // Default driver for demo
      driverRating: 4.9,
    };

    createPickupMutation.mutate(pickupData);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <AppHeader 
        title="Schedule Pickup" 
        showBackButton 
        onBackClick={handleBack}
        showUserIcon={false} 
        showNotification={false}
      />
      
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {/* Items for Pickup */}
        <div className="bg-white gozero-shadow rounded-xl p-4 mb-4">
          <h3 className="font-bold text-sm mb-3">Items for Pickup</h3>
          
          {isLoadingScan ? (
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <Skeleton className="h-16 w-full" />
            </div>
          ) : scan ? (
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-light flex items-center justify-center mr-3">
                  {scan.imageUrl ? (
                    <img 
                      src={scan.imageUrl}
                      alt={scan.itemName}
                      className="w-10 h-10 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=Item';
                      }}
                    />
                  ) : (
                    <FontAwesomeIcon icon="bottle-water" className="text-[#00AA13]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{scan.itemName}</p>
                  <p className="text-xs text-[#757575]">
                    {scan.recyclable ? 'Recyclable' : 'Non-recyclable'}
                  </p>
                </div>
              </div>
              <div>
                <button
                  onClick={() => setSelectedScans(selectedScans.filter(id => id !== scan.id))}
                  className="text-red-500"
                >
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-[#757575]">
              No items selected for pickup
            </div>
          )}
          
          <div className="flex justify-end mt-2">
            <button 
              onClick={() => navigate("/scanner")}
              className="text-xs text-[#00AA13] font-medium"
            >
              Add more items
            </button>
          </div>
        </div>

        {/* Pickup Location */}
        <div className="bg-white gozero-shadow rounded-xl p-4 mb-4">
          <h3 className="font-bold text-sm mb-3">Pickup Location</h3>
          <div className="bg-[#F5F5F5] rounded-lg h-32 mb-3 relative overflow-hidden">
            {latitude && longitude ? (
              <img 
                src={`https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=400x200&markers=color:red|${latitude},${longitude}&key=`}
                alt="Map showing pickup location"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Use a fallback image if Google Maps fails
                  (e.target as HTMLImageElement).src = 'https://pixabay.com/get/g5b848e4aac8dbcff9db930d2eedf669b3fe26c18683c5fbd7be7ec2ffc38bbaed90fd0df43e7d22941c74422578080d86542fcd8fa8bfda52781972e761b16a3_1280.jpg';
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-[#757575]">Loading map...</p>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white p-2 rounded-lg shadow-lg">
                <FontAwesomeIcon icon="map-marker-alt" className="text-[#FF5252] mr-1" />
                <span className="text-xs font-medium">Current Location</span>
              </div>
            </div>
          </div>
          <div className="flex items-center mb-3">
            <FontAwesomeIcon icon="map-marker-alt" className="text-[#FF5252] mr-2" />
            <input
              type="text"
              placeholder="Enter pickup address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="text-sm flex-1 outline-none border-b border-gray-200 pb-1"
            />
          </div>
          <button 
            onClick={() => setAddress("Current Location")}
            className="text-xs text-[#00AA13] font-medium"
          >
            Use current location
          </button>
        </div>

        {/* Pickup Schedule */}
        <div className="bg-white gozero-shadow rounded-xl p-4 mb-4">
          <h3 className="font-bold text-sm mb-3">Pickup Schedule</h3>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {getPickupDates().map((date, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(date.value)}
                className={`p-2 rounded-lg text-center ${
                  selectedDate === date.value
                    ? "bg-[#00AA13] bg-opacity-10 text-[#00AA13]"
                    : "bg-[#F5F5F5] text-[#757575]"
                }`}
              >
                <p className={`text-xs ${selectedDate === date.value ? "font-medium" : ""}`}>
                  {date.label}
                </p>
                <p className="text-xs">{date.display}</p>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {pickupTimeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => setSelectedTimeSlot(slot.value)}
                className={`p-2 rounded-lg text-center ${
                  selectedTimeSlot === slot.value
                    ? "bg-[#00AA13] bg-opacity-10 text-[#00AA13]"
                    : "bg-[#F5F5F5] text-[#757575]"
                }`}
              >
                <p className={`text-xs ${selectedTimeSlot === slot.value ? "font-medium" : ""}`}>
                  {slot.label}
                </p>
                <p className="text-xs">{slot.display}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Notes for Driver */}
        <div className="bg-white gozero-shadow rounded-xl p-4 mb-4">
          <h3 className="font-bold text-sm mb-3">Notes for Driver</h3>
          <textarea
            className="w-full h-20 bg-[#F5F5F5] rounded-lg p-3 text-sm"
            placeholder="Add any special instructions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={handleSubmit}
          disabled={createPickupMutation.isPending}
          className={`w-full bg-[#00AA13] text-white font-medium py-3 rounded-xl flex items-center justify-center ${
            createPickupMutation.isPending ? "opacity-70" : ""
          }`}
        >
          {createPickupMutation.isPending ? (
            <>
              <span className="mr-2">Processing...</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon="motorcycle" className="mr-2" />
              <span>Confirm Pickup Request</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
