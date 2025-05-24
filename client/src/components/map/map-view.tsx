import { useQuery } from '@tanstack/react-query';
import { RecyclingCenter } from '@/lib/types';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { recyclingCenters as defaultCenters } from '@/lib/recycling-data';
import { Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';

// Import Leaflet
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  selectedCenterId?: number;
  onSelectCenter?: (center: RecyclingCenter) => void;
}

export function MapView({ selectedCenterId, onSelectCenter }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: number]: L.Marker }>({});
  
  const { latitude, longitude, loading: locationLoading, getPosition } = useGeolocation();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [mapInitialized, setMapInitialized] = useState(false);
  
  // Fetch recycling centers
  const { data: centers, isLoading } = useQuery<RecyclingCenter[]>({
    queryKey: [`/api/recycling-centers${latitude && longitude ? `?lat=${latitude}&lng=${longitude}&radius=10` : ''}`],
    enabled: !!latitude && !!longitude,
  });

  // Use default centers or fetched centers
  const displayCenters = centers || defaultCenters;
  
  // Initialize map once we have location data
  useEffect(() => {
    if (!mapRef.current || mapInitialized || !latitude || !longitude) return;
    
    // Create the map
    const map = L.map(mapRef.current).setView([latitude, longitude], 13);
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add user location marker
    const userIcon = L.divIcon({
      html: `<div class="w-6 h-6 rounded-full bg-[#00AA13] border-2 border-white flex items-center justify-center">
              <div class="w-2 h-2 rounded-full bg-white"></div>
            </div>`,
      className: 'custom-div-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    
    L.marker([latitude, longitude], { icon: userIcon }).addTo(map)
      .bindPopup('Your Location')
      .openPopup();
    
    // Store the map reference
    leafletMapRef.current = map;
    setMapInitialized(true);
    
  }, [latitude, longitude, mapInitialized]);
  
  // Add markers for recycling centers
  useEffect(() => {
    if (!leafletMapRef.current || !displayCenters || displayCenters.length === 0) return;
    
    const map = leafletMapRef.current;
    
    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      map.removeLayer(marker);
    });
    markersRef.current = {};
    
    // Filter centers based on selected filter
    const filteredCenters = selectedFilter === 'All' 
      ? displayCenters 
      : displayCenters.filter(center => 
          center.acceptedMaterials?.some(material => 
            material.toLowerCase().includes(selectedFilter.toLowerCase())
          )
        );
    
    // Add markers for each center
    filteredCenters.forEach(center => {
      const icon = L.divIcon({
        html: `<div class="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-[#3D7CF4]">
                <i class="fas fa-recycle"></i>
              </div>`,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      
      const marker = L.marker([center.latitude, center.longitude], { icon })
        .addTo(map)
        .bindPopup(center.name)
        .on('click', () => {
          if (onSelectCenter) onSelectCenter(center);
        });
      
      markersRef.current[center.id] = marker;
      
      // If this is the selected center, highlight it
      if (center.id === selectedCenterId && marker) {
        marker.openPopup();
        map.setView([center.latitude, center.longitude], 15);
      }
    });
    
  }, [displayCenters, selectedFilter, selectedCenterId, onSelectCenter]);
  
  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };
  
  // Handle map controls
  const handleZoomIn = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomIn();
    }
  };
  
  const handleZoomOut = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomOut();
    }
  };
  
  const handleRecenter = () => {
    if (leafletMapRef.current && latitude && longitude) {
      leafletMapRef.current.setView([latitude, longitude], 13);
    }
  };
  
  return (
    <div className="relative h-full">
      {(isLoading || locationLoading) && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
          <div className="text-center">
            <Skeleton className="h-8 w-24 mx-auto mb-2" />
            <p className="text-sm text-[#757575]">Loading map data...</p>
          </div>
        </div>
      )}
      
      {/* Map container */}
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ height: 'calc(100vh - 160px)' }}
      ></div>
      
      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button 
          onClick={handleZoomIn}
          className="w-10 h-10 rounded-lg bg-white shadow-lg flex items-center justify-center"
        >
          <FontAwesomeIcon icon="plus" className="text-[#757575]" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-10 h-10 rounded-lg bg-white shadow-lg flex items-center justify-center"
        >
          <FontAwesomeIcon icon="minus" className="text-[#757575]" />
        </button>
        <button 
          onClick={handleRecenter}
          className="w-10 h-10 rounded-lg bg-white shadow-lg flex items-center justify-center"
        >
          <FontAwesomeIcon icon="location-arrow" className="text-[#3D7CF4]" />
        </button>
      </div>
      
      {/* Facility filters */}
      <div className="absolute top-4 left-4 flex space-x-2 overflow-x-auto hide-scrollbar">
        <button 
          onClick={() => handleFilterChange('All')}
          className={`bg-white shadow-lg rounded-full px-3 py-1.5 text-xs font-medium flex items-center ${selectedFilter === 'All' ? 'text-[#00AA13]' : 'text-[#757575]'}`}
        >
          <span className={`w-2 h-2 rounded-full ${selectedFilter === 'All' ? 'bg-[#4CAF50]' : 'bg-[#757575]'} mr-1`}></span>
          All
        </button>
        <button 
          onClick={() => handleFilterChange('Plastic')}
          className={`bg-white shadow-lg rounded-full px-3 py-1.5 text-xs font-medium flex items-center ${selectedFilter === 'Plastic' ? 'text-[#00AA13]' : 'text-[#757575]'}`}
        >
          <span className={`w-2 h-2 rounded-full ${selectedFilter === 'Plastic' ? 'bg-[#3D7CF4]' : 'bg-[#757575]'} mr-1`}></span>
          Plastic
        </button>
        <button 
          onClick={() => handleFilterChange('Electronic')}
          className={`bg-white shadow-lg rounded-full px-3 py-1.5 text-xs font-medium flex items-center ${selectedFilter === 'Electronic' ? 'text-[#00AA13]' : 'text-[#757575]'}`}
        >
          <span className={`w-2 h-2 rounded-full ${selectedFilter === 'Electronic' ? 'bg-[#FF5252]' : 'bg-[#757575]'} mr-1`}></span>
          E-Waste
        </button>
      </div>
    </div>
  );
}
