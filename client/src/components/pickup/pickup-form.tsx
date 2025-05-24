import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getPickupDates, pickupTimeSlots } from "@/lib/recycling-data";
import { Scan } from "@/lib/types";
import { useGeolocation } from "@/hooks/use-geolocation";
import { Button } from "@/components/ui/button";

interface PickupFormProps {
  selectedScan?: Scan;
  onSubmit: (formData: {
    scanIds: number[];
    pickupDate: string;
    pickupTimeSlot: string;
    address: string;
    notes: string;
  }) => void;
  isSubmitting: boolean;
}

export function PickupForm({ selectedScan, onSubmit, isSubmitting }: PickupFormProps) {
  const { latitude, longitude } = useGeolocation();
  
  // Form state
  const [selectedScans, setSelectedScans] = useState<number[]>(
    selectedScan ? [selectedScan.id] : []
  );
  const [selectedDate, setSelectedDate] = useState(getPickupDates()[0].value);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(pickupTimeSlots[0].value);
  const [address, setAddress] = useState("Current Location");
  const [notes, setNotes] = useState("");

  // Remove scan from selection
  const handleRemoveScan = (scanId: number) => {
    setSelectedScans(selectedScans.filter(id => id !== scanId));
  };

  // Handle form submission
  const handleSubmit = () => {
    onSubmit({
      scanIds: selectedScans,
      pickupDate: selectedDate,
      pickupTimeSlot: selectedTimeSlot,
      address,
      notes,
    });
  };

  return (
    <div className="space-y-4">
      {/* Items for Pickup */}
      <div className="bg-white gozero-shadow rounded-xl p-4">
        <h3 className="font-bold text-sm mb-3">Items for Pickup</h3>
        
        {selectedScan ? (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] flex items-center justify-center mr-3">
                {selectedScan.imageUrl ? (
                  <img 
                    src={selectedScan.imageUrl}
                    alt={selectedScan.itemName}
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
                <p className="text-sm font-medium">{selectedScan.itemName}</p>
                <p className="text-xs text-[#757575]">
                  {selectedScan.recyclable ? 'Recyclable' : 'Non-recyclable'}
                </p>
              </div>
            </div>
            <div>
              <button
                onClick={() => handleRemoveScan(selectedScan.id)}
                className="text-[#FF5252]"
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
          <button className="text-xs text-[#00AA13] font-medium">
            Add more items
          </button>
        </div>
      </div>

      {/* Pickup Location */}
      <div className="bg-white gozero-shadow rounded-xl p-4">
        <h3 className="font-bold text-sm mb-3">Pickup Location</h3>
        <div className="bg-[#F5F5F5] rounded-lg h-32 mb-3 relative overflow-hidden">
          {latitude && longitude ? (
            <img 
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=400x200&markers=color:red|${latitude},${longitude}&key=`}
              alt="Map showing pickup location"
              className="w-full h-full object-cover"
              onError={(e) => {
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
      <div className="bg-white gozero-shadow rounded-xl p-4">
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
      <div className="bg-white gozero-shadow rounded-xl p-4">
        <h3 className="font-bold text-sm mb-3">Notes for Driver</h3>
        <textarea
          className="w-full h-20 bg-[#F5F5F5] rounded-lg p-3 text-sm"
          placeholder="Add any special instructions..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || selectedScans.length === 0}
        className={`w-full bg-[#00AA13] text-white font-medium py-3 rounded-xl flex items-center justify-center ${
          isSubmitting || selectedScans.length === 0 ? "opacity-70" : ""
        }`}
      >
        {isSubmitting ? (
          <>
            <span className="mr-2">Processing...</span>
          </>
        ) : (
          <>
            <FontAwesomeIcon icon="motorcycle" className="mr-2" />
            <span>Confirm Pickup Request</span>
          </>
        )}
      </Button>
    </div>
  );
}
