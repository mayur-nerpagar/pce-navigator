import { useState, useEffect, useCallback } from 'react';
import { campusCenter } from '@/data/campusLocations';

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  heading: number | null;
  speed: number | null;
  error: string | null;
  isLoading: boolean;
  isInsideCampus: boolean;
}

// Campus boundary (approximate)
const CAMPUS_BOUNDS = {
  north: 21.1050,
  south: 21.1005,
  east: 79.0105,
  west: 79.0030,
};

export function useGeolocation(enabled: boolean = false) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    heading: null,
    speed: null,
    error: null,
    isLoading: false,
    isInsideCampus: false,
  });

  const isInsideCampusBounds = useCallback((lat: number, lng: number): boolean => {
    return (
      lat >= CAMPUS_BOUNDS.south &&
      lat <= CAMPUS_BOUNDS.north &&
      lng >= CAMPUS_BOUNDS.west &&
      lng <= CAMPUS_BOUNDS.east
    );
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (!navigator.geolocation) {
      setState(prev => ({ 
        ...prev, 
        error: 'Geolocation is not supported by your browser',
        isLoading: false 
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy, heading, speed } = position.coords;
      
      setState({
        latitude,
        longitude,
        accuracy,
        heading: heading ?? null,
        speed: speed ?? null,
        error: null,
        isLoading: false,
        isInsideCampus: isInsideCampusBounds(latitude, longitude),
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = 'Unable to get your location';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location permission denied. Please enable location access.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out.';
          break;
      }
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
    };

    // Get initial position
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);

    // Watch position for real-time updates
    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [enabled, isInsideCampusBounds]);

  const recenter = useCallback(() => {
    if (state.latitude && state.longitude) {
      return { lat: state.latitude, lng: state.longitude };
    }
    return campusCenter;
  }, [state.latitude, state.longitude]);

  return { ...state, recenter };
}
