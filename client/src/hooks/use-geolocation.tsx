import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: true,
  });
  const { toast } = useToast();

  const getPosition = useCallback(() => {
    setState(prev => ({ ...prev, loading: true }));

    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      }));
      
      toast({
        title: 'Location Error',
        description: 'Geolocation is not supported by your browser',
        variant: 'destructive',
      });
      
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          loading: false,
        });
      },
      (error) => {
        setState(prev => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
        
        toast({
          title: 'Location Error',
          description: error.message,
          variant: 'destructive',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [toast]);

  useEffect(() => {
    getPosition();
  }, [getPosition]);

  return {
    ...state,
    getPosition,
  };
}
