import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { campusLocations, campusCenter, categoryColors, CampusLocation } from '@/data/campusLocations';
import { RouteResult } from '@/utils/dijkstra';

interface CampusMapProps {
  route: RouteResult | null;
  sourceId: string | null;
  destinationId: string | null;
  onLocationClick?: (location: CampusLocation) => void;
  isNavigating?: boolean;
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
      <div class="w-3 h-3 rounded-full border-2 border-white shadow-md transition-transform hover:scale-125" 
           style="background-color: ${color}"></div>
    `,
    className: 'custom-poi-marker',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

export function CampusMap({ route, sourceId, destinationId, onLocationClick, isNavigating }: CampusMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLayersRef = useRef<L.Layer[]>([]);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [campusCenter.lat, campusCenter.lng],
      zoom: 17,
      zoomControl: false,
      attributionControl: false,
    });

    // Add zoom control to bottom right (like Google Maps)
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    
    // Add attribution to bottom left
    L.control.attribution({ position: 'bottomleft', prefix: '' }).addTo(map);

    // Google Maps-like tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    mapInstanceRef.current = map;
    setMapReady(true);

    // Force map to invalidate size after render
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

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
        <div class="p-1 min-w-[180px]">
          <h3 class="font-semibold text-gray-900 text-sm mb-1">${location.name}</h3>
          <p class="text-xs text-gray-600 mb-2">${location.description || ''}</p>
          <div class="flex gap-2">
            <button onclick="window.setNavSource('${location.id}')" 
                    class="flex-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
              Start here
            </button>
            <button onclick="window.setNavDest('${location.id}')"
                    class="flex-1 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors">
              Go here
            </button>
          </div>
        </div>
      `, { className: 'custom-popup' });

      marker.on('click', () => {
        onLocationClick?.(location);
      });

      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [mapReady, sourceId, destinationId, onLocationClick]);

  // Draw route like Google Maps
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;

    const map = mapInstanceRef.current;

    // Remove existing route layers
    routeLayersRef.current.forEach(layer => layer.remove());
    routeLayersRef.current = [];

    if (!route) return;

    const latlngs: L.LatLngExpression[] = route.coordinates.map(coord => [coord.lat, coord.lng]);

    // Outer glow/shadow (like Google Maps route shadow)
    const routeShadow = L.polyline(latlngs, {
      color: '#1a73e8',
      weight: 10,
      opacity: 0.3,
      lineCap: 'round',
      lineJoin: 'round',
    });
    routeShadow.addTo(map);
    routeLayersRef.current.push(routeShadow);

    // Main route line (Google Maps blue)
    const routeLine = L.polyline(latlngs, {
      color: '#4285f4',
      weight: 6,
      opacity: 1,
      lineCap: 'round',
      lineJoin: 'round',
    });
    routeLine.addTo(map);
    routeLayersRef.current.push(routeLine);

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
              <svg class="w-4 h-4 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </div>
          `,
          className: 'direction-arrow',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        
        const arrowMarker = L.marker([midLat, midLng], { icon: arrowIcon, interactive: false });
        arrowMarker.addTo(map);
        routeLayersRef.current.push(arrowMarker);
      }
    };
    
    addDirectionArrows();

    // Fit bounds with padding
    const bounds = L.latLngBounds(latlngs);
    map.fitBounds(bounds, { 
      padding: [80, 80],
      maxZoom: 18,
    });

  }, [route, mapReady]);

  // Handle navigation mode - tilt and focus
  useEffect(() => {
    if (!mapInstanceRef.current || !isNavigating || !sourceId) return;
    
    const source = campusLocations.find(l => l.id === sourceId);
    if (source) {
      mapInstanceRef.current.setView([source.lat, source.lng], 19, { animate: true });
    }
  }, [isNavigating, sourceId]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full min-h-screen"
      style={{ height: '100%', width: '100%' }}
    />
  );
}
