import { useQuery } from '@tanstack/react-query';
import { RecyclingCenter } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'wouter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { recyclingCenters as defaultCenters } from '@/lib/recycling-data';

export function RecyclingCenters() {
  const { latitude, longitude, loading: locationLoading } = useGeolocation();
  
  const { data: centers, isLoading, refetch } = useQuery<RecyclingCenter[]>({
    queryKey: [`/api/recycling-centers${latitude && longitude ? `?lat=${latitude}&lng=${longitude}&radius=10` : ''}`],
    enabled: !!latitude && !!longitude,
  });

  // Refetch centers when location changes
  useEffect(() => {
    if (latitude && longitude) {
      refetch();
    }
  }, [latitude, longitude, refetch]);

  // Use default centers or fetched centers
  const displayCenters = centers || defaultCenters;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base font-bold">Nearby Recycling Centers</h2>
        <Link href="/map">
          <a className="text-[#00AA13] text-sm font-medium">View Map</a>
        </Link>
      </div>
      <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
        <div className="flex space-x-3 pb-2 w-max">
          {isLoading || locationLoading ? (
            // Skeleton loaders
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white gozero-shadow rounded-xl w-64 flex-shrink-0">
                <Skeleton className="w-full h-32 rounded-t-xl" />
                <div className="p-3">
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-3 w-24 mb-2" />
                  <div className="flex justify-between mt-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            ))
          ) : displayCenters && displayCenters.length > 0 ? (
            // Display recycling centers
            displayCenters.map(center => (
              <div key={center.id} className="bg-white gozero-shadow rounded-xl w-64 flex-shrink-0">
                <img 
                  src={center.imageUrl || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b'} 
                  alt={center.name} 
                  className="w-full h-32 object-cover rounded-t-xl"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b';
                  }}
                />
                <div className="p-3">
                  <h3 className="font-medium text-sm">{center.name}</h3>
                  <div className="flex items-center mt-1">
                    <FontAwesomeIcon icon="map-marker-alt" className="text-xs text-[#757575] mr-1" />
                    <span className="text-xs text-[#757575]">{center.distance?.toFixed(1)} km away</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs bg-[#F5F5F5] rounded-full px-2 py-1">
                      {center.acceptedMaterials && center.acceptedMaterials.length > 0 
                        ? (center.acceptedMaterials.length > 1 ? 'All Materials' : center.acceptedMaterials[0])
                        : 'Mixed Materials'
                      }
                    </span>
                    <Link href={`/map?centerId=${center.id}`}>
                      <a className="text-xs text-[#00AA13] font-medium">Directions</a>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // No data state
            <div className="bg-white gozero-shadow rounded-xl p-5 w-full text-center">
              <p className="text-sm text-[#757575]">No recycling centers found nearby.</p>
              <Button 
                variant="link" 
                className="text-[#00AA13] p-0 h-auto mt-2"
                onClick={() => refetch()}
              >
                Refresh
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
