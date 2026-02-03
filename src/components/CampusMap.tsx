import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { campusLocations, campusCenter, categoryColors, CampusLocation } from '@/data/campusLocations';
import { CAMPUS_BOUNDS } from '@/data/campusGraph';
import { RouteResult } from '@/utils/dijkstra';
import { GeolocationState } from '@/hooks/useGeolocation';

interface CampusMapProps {
  route: RouteResult | null;
  sourceId: string | null;
  destinationId: string | null;
  onLocationClick?: (location: CampusLocation) => void;
  isNavigating?: boolean;
  userLocation?: GeolocationState;
  onRecenter?: () => void;
}

// Custom marker icons like Google Maps
const createLocationMarker = (category: CampusLocation['category'], isSource: boolean, isDestination: boolean) => {
  if (isSource) {
    return L.divIcon({
      html: `
        <div class="relative">
          <div class="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <div class="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div class="absolute -inset-2 bg-blue-500/30 rounded-full animate-ping"></div>
        </div>
      `,
      className: 'custom-source-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  }
  
  if (isDestination) {
    return L.divIcon({
      html: `
        <div class="flex flex-col items-center">
          <div class="w-8 h-8 bg-red-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center transform -translate-y-4">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="w-2 h-2 bg-red-500 rounded-full shadow-md -mt-3"></div>
        </div>
      `,
      className: 'custom-dest-marker',
      iconSize: [32, 48],
      iconAnchor: [16, 48],
    });
  }

  const color = categoryColors[category];
  return L.divIcon({
    html: `
      <div class="w-4 h-4 rounded-full border-2 border-white shadow-lg transition-transform hover:scale-125" 
           style="background-color: ${color}"></div>
    `,
    className: 'custom-poi-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

// Create a label marker for location names
const createLabelMarker = (name: string, category: CampusLocation['category']) => {
  const color = categoryColors[category];
  return L.divIcon({
    html: `
      <div class="pointer-events-none whitespace-nowrap">
        <div class="px-2 py-0.5 rounded text-xs font-semibold shadow-lg border border-white/50"
             style="background-color: ${color}; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
          ${name}
        </div>
      </div>
    `,
    className: 'location-label',
    iconSize: [0, 0],
    iconAnchor: [-10, 8],
  });
};

// Create user location marker (blue dot with accuracy circle)
const createUserLocationMarker = () => {
  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-10 h-10 bg-blue-500/20 rounded-full animate-pulse"></div>
        <div class="w-5 h-5 bg-blue-600 rounded-full border-3 border-white shadow-lg z-10">
          <div class="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-50"></div>
        </div>
      </div>
    `,
    className: 'user-location-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

export function CampusMap({ route, sourceId, destinationId, onLocationClick, isNavigating, userLocation }: CampusMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLayersRef = useRef<L.Layer[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map with satellite view and campus bounds
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Campus boundary for restriction
    const bounds = L.latLngBounds(
      [CAMPUS_BOUNDS.south, CAMPUS_BOUNDS.west],
      [CAMPUS_BOUNDS.north, CAMPUS_BOUNDS.east]
    );

    const map = L.map(mapRef.current, {
      center: [campusCenter.lat, campusCenter.lng],
      zoom: 18,
      minZoom: 16,
      maxZoom: 20,
      zoomControl: false,
      attributionControl: false,
      maxBounds: bounds.pad(0.1), // Allow slight overflow
      maxBoundsViscosity: 1.0, // Strict boundary enforcement
    });

    // Add zoom control to bottom right (like Google Maps)
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    
    // Add attribution to bottom left
    L.control.attribution({ position: 'bottomleft', prefix: '' }).addTo(map);

    // ESRI Satellite imagery (high quality, free)
    const satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles © Esri',
        maxZoom: 20,
      }
    );

    // Add satellite as base
    satelliteLayer.addTo(map);

    // Add labels overlay on top of satellite
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 20,
        opacity: 0.8,
      }
    ).addTo(map);

    // Add campus boundary outline
    const boundaryRect = L.rectangle(bounds, {
      color: '#4285f4',
      weight: 3,
      fill: false,
      dashArray: '10, 5',
      opacity: 0.6,
    });
    boundaryRect.addTo(map);

    mapInstanceRef.current = map;
    setMapReady(true);

    // Force fit to campus on load
    setTimeout(() => {
      map.fitBounds(bounds, { padding: [20, 20] });
      map.invalidateSize();
    }, 100);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update user location marker
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;
    const map = mapInstanceRef.current;

    // Remove existing user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
    if (accuracyCircleRef.current) {
      accuracyCircleRef.current.remove();
      accuracyCircleRef.current = null;
    }

    if (userLocation?.latitude && userLocation?.longitude) {
      // Add accuracy circle
      if (userLocation.accuracy) {
        accuracyCircleRef.current = L.circle(
          [userLocation.latitude, userLocation.longitude],
          {
            radius: userLocation.accuracy,
            color: '#4285f4',
            fillColor: '#4285f4',
            fillOpacity: 0.1,
            weight: 1,
          }
        );
        accuracyCircleRef.current.addTo(map);
      }

      // Add user marker
      userMarkerRef.current = L.marker(
        [userLocation.latitude, userLocation.longitude],
        {
          icon: createUserLocationMarker(),
          zIndexOffset: 2000,
        }
      );
      userMarkerRef.current.addTo(map);

      // If navigating, follow user
      if (isNavigating) {
        map.setView([userLocation.latitude, userLocation.longitude], 19, { animate: true });
      }
    }
  }, [userLocation, mapReady, isNavigating]);

  // Add markers
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each location
    campusLocations.forEach(location => {
      const isSource = location.id === sourceId;
      const isDestination = location.id === destinationId;
      
      const marker = L.marker([location.lat, location.lng], {
        icon: createLocationMarker(location.category, isSource, isDestination),
        zIndexOffset: isSource || isDestination ? 1000 : 0,
      });

      // Google Maps-like popup
      marker.bindPopup(`
        <div class="p-2 min-w-[200px]">
          <h3 class="font-bold text-gray-900 text-sm mb-1">${location.name}</h3>
          <p class="text-xs text-gray-600 mb-3">${location.description || ''}</p>
          <div class="flex gap-2">
            <button onclick="window.setNavSource('${location.id}')" 
                    class="flex-1 px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-full hover:bg-blue-600 transition-colors">
              Start here
            </button>
            <button onclick="window.setNavDest('${location.id}')"
                    class="flex-1 px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-full hover:bg-green-600 transition-colors">
              Go here
            </button>
          </div>
        </div>
      `, { 
        className: 'custom-popup',
        closeButton: true,
        autoPan: true,
      });

      marker.on('click', () => {
        onLocationClick?.(location);
      });

      marker.addTo(map);
      markersRef.current.push(marker);

      // Add label marker for each location (visible name on map)
      const labelMarker = L.marker([location.lat, location.lng], {
        icon: createLabelMarker(location.name, location.category),
        interactive: false,
        zIndexOffset: -100,
      });
      labelMarker.addTo(map);
      markersRef.current.push(labelMarker);
    });
  }, [mapReady, sourceId, destinationId, onLocationClick]);

  // Draw route like Google Maps
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;

    const map = mapInstanceRef.current;

    // Remove existing route layers
    routeLayersRef.current.forEach(layer => {
      if (map.hasLayer(layer)) {
        layer.remove();
      }
    });
    routeLayersRef.current = [];

    if (!route) return;

    const latlngs: L.LatLngExpression[] = route.coordinates.map(coord => [coord.lat, coord.lng]);

    // Outer glow/shadow (like Google Maps route shadow)
    const routeShadow = L.polyline(latlngs, {
      color: '#000000',
      weight: 12,
      opacity: 0.3,
      lineCap: 'round',
      lineJoin: 'round',
    });
    routeShadow.addTo(map);
    routeLayersRef.current.push(routeShadow);

    // Main route line (Google Maps blue)
    const routeLine = L.polyline(latlngs, {
      color: '#4285f4',
      weight: 7,
      opacity: 1,
      lineCap: 'round',
      lineJoin: 'round',
    });
    routeLine.addTo(map);
    routeLayersRef.current.push(routeLine);

    // Inner highlight line
    const routeHighlight = L.polyline(latlngs, {
      color: '#88b4f5',
      weight: 3,
      opacity: 0.8,
      lineCap: 'round',
      lineJoin: 'round',
    });
    routeHighlight.addTo(map);
    routeLayersRef.current.push(routeHighlight);

    // Add direction arrows along the route
    const addDirectionArrows = () => {
      for (let i = 0; i < route.coordinates.length - 1; i++) {
        const start = route.coordinates[i];
        const end = route.coordinates[i + 1];
        
        // Calculate midpoint
        const midLat = (start.lat + end.lat) / 2;
        const midLng = (start.lng + end.lng) / 2;
        
        // Calculate angle
        const angle = Math.atan2(end.lng - start.lng, end.lat - start.lat) * 180 / Math.PI;
        
        const arrowIcon = L.divIcon({
          html: `
            <div class="flex items-center justify-center" style="transform: rotate(${angle}deg)">
              <svg class="w-5 h-5 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </div>
          `,
          className: 'direction-arrow',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
        
        const arrowMarker = L.marker([midLat, midLng], { icon: arrowIcon, interactive: false });
        arrowMarker.addTo(map);
        routeLayersRef.current.push(arrowMarker);
      }
    };
    
    addDirectionArrows();

    // Fit bounds with padding (only if not navigating)
    if (!isNavigating) {
      const bounds = L.latLngBounds(latlngs);
      map.fitBounds(bounds, { 
        padding: [100, 100],
        maxZoom: 19,
      });
    }

  }, [route, mapReady, isNavigating]);

  // Handle navigation mode - follow source/user location
  useEffect(() => {
    if (!mapInstanceRef.current || !isNavigating) return;
    
    // If we have user location, center on that
    if (userLocation?.latitude && userLocation?.longitude) {
      mapInstanceRef.current.setView(
        [userLocation.latitude, userLocation.longitude], 
        19, 
        { animate: true }
      );
    } else if (sourceId) {
      // Otherwise center on source
      const source = campusLocations.find(l => l.id === sourceId);
      if (source) {
        mapInstanceRef.current.setView([source.lat, source.lng], 19, { animate: true });
      }
    }
  }, [isNavigating, sourceId, userLocation?.latitude, userLocation?.longitude]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full min-h-screen"
      style={{ height: '100%', width: '100%' }}
    />
  );
}
