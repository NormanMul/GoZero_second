import { AppHeader } from "@/components/layout/app-header";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Pickup } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function PickupConfirmation() {
  const [, params] = useRoute("/pickup-confirmation/:pickupId?");
  const pickupId = params?.pickupId;
  const [, navigate] = useLocation();

  // Fetch pickup data
  const { data: pickup, isLoading } = useQuery<Pickup>({
    queryKey: [`/api/pickups/${pickupId}`],
    enabled: !!pickupId,
  });

  // If we have no pickup ID, redirect to home
  if (!pickupId) {
    navigate("/");
    return null;
  }

  const handleBackToHome = () => {
    navigate("/");
  };

  // Placeholder for pickup impact metrics
  const impactMetrics = {
    co2Saved: pickup?.scanIds?.length ? pickup.scanIds.length * 0.5 : 0.5,
    pointsEarned: pickup?.scanIds?.length ? pickup.scanIds.length * 25 : 25,
    level: 2
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
          <Skeleton className="w-20 h-20 rounded-full mb-4" />
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-4 w-60 mb-4" />
          <Skeleton className="h-32 w-full mb-6" />
          <Skeleton className="h-32 w-full mb-6" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[#4CAF50] bg-opacity-10 flex items-center justify-center mb-4">
          <FontAwesomeIcon icon="check" className="text-[#4CAF50] text-2xl" />
        </div>
        <h2 className="text-xl font-bold mb-2">Pickup Scheduled!</h2>
        <p className="text-[#757575] mb-4">
          Your recycling pickup has been scheduled for {pickup?.pickupDate} between {
            pickupTimeSlots[pickup?.pickupTimeSlot]
          }.
        </p>
        
        <div className="bg-white gozero-shadow rounded-xl p-4 w-full mb-6">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center mr-3">
              <img 
                src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                alt="GoZero pickup agent" 
                className="w-10 h-10 object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=Driver';
                }}
              />
            </div>
            <div>
              <p className="text-sm font-medium">{pickup?.driverName || 'Alex'} will pick up your recycling</p>
              <p className="text-xs text-[#757575]">GoZero Agent • {pickup?.driverRating || '4.9'} ★</p>
            </div>
          </div>
          <div className="rounded-lg bg-[#F5F5F5] p-3 flex items-center justify-between">
            <div className="flex items-center">
              <FontAwesomeIcon icon="receipt" className="text-[#00AA13] mr-2" />
              <p className="text-xs">Order #{pickup?.orderCode || 'GZ12345'}</p>
            </div>
            <button 
              onClick={() => navigate(`/pickup/${pickupId}/details`)}
              className="text-xs text-[#00AA13] font-medium"
            >
              Details
            </button>
          </div>
        </div>

        <div className="bg-white gozero-shadow rounded-xl p-4 w-full mb-6">
          <h3 className="font-bold text-sm mb-2">Environmental Impact</h3>
          <p className="text-xs text-[#757575] mb-3">By recycling these items, you're making a difference:</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#F5F5F5] p-2 rounded-lg">
              <p className="text-xs text-[#757575]">CO2 Saved</p>
              <p className="font-bold text-sm">{impactMetrics.co2Saved}kg</p>
            </div>
            <div className="bg-[#F5F5F5] p-2 rounded-lg">
              <p className="text-xs text-[#757575]">Points Earned</p>
              <p className="font-bold text-sm">{impactMetrics.pointsEarned}</p>
            </div>
            <div className="bg-[#F5F5F5] p-2 rounded-lg">
              <p className="text-xs text-[#757575]">GoZero Level</p>
              <div className="flex items-center">
                <FontAwesomeIcon icon="leaf" className="text-[#4CAF50] mr-1" />
                <p className="font-bold text-sm">Level {impactMetrics.level}</p>
              </div>
            </div>
          </div>
        </div>

        <Button
          className="w-full bg-[#00AA13] text-white font-medium py-3 rounded-xl"
          onClick={handleBackToHome}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}

// Helper function to format time slot display
function pickupTimeSlots(timeSlot?: string): string {
  switch(timeSlot) {
    case 'morning':
      return '9AM - 12PM';
    case 'afternoon':
      return '1PM - 5PM';
    case 'evening':
      return '6PM - 9PM';
    default:
      return '9AM - 12PM';
  }
}
