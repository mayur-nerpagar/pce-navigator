import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { campusLocations, campusCenter, categoryColors, CampusLocation } from '@/data/campusLocations';
import { RouteResult } from '@/utils/dijkstra';

interface CampusMapProps {
  route: RouteResult | null;
  sourceId: string | null;
  destinationId: string | null;
  onLocationClick?: (location: CampusLocation) => void;
}

const createMarkerIcon = (color: string, isHighlighted: boolean = false, isSource: boolean = false, isDestination: boolean = false) => {
  let symbol = '📍';
  let size = 28;
  
  if (isSource) {
    symbol = '🚀';
    size = 32;
  } else if (isDestination) {
    symbol = '🎯';
    size = 32;
  }
  
  return L.divIcon({
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${size}px;
        height: ${size}px;
        background: ${isHighlighted ? '#f59e0b' : color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        font-size: ${size * 0.5}px;
        ${isHighlighted || isSource || isDestination ? 'animation: pulse 2s infinite;' : ''}
      ">
        <span>${symbol}</span>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 2px 10px rgba(0,0,0,0.3); }
          50% { transform: scale(1.1); box-shadow: 0 4px 20px rgba(245, 158, 11, 0.5); }
        }
      </style>
    `,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

export function CampusMap({ route, sourceId, destinationId, onLocationClick }: CampusMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [campusCenter.lat, campusCenter.lng],
      zoom: 17,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Add OpenStreetMap tiles with custom styling
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    setMapReady(true);

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
      const isHighlighted = isSource || isDestination;
      
      const marker = L.marker([location.lat, location.lng], {
        icon: createMarkerIcon(
          categoryColors[location.category],
          isHighlighted,
          isSource,
          isDestination
        ),
      });

      marker.bindPopup(`
        <div style="text-align: center; min-width: 150px;">
          <h3 style="margin: 0 0 8px 0; font-weight: 600; color: #1e3a5f;">${location.name}</h3>
          <p style="margin: 0; color: #64748b; font-size: 12px;">${location.description || ''}</p>
          <span style="
            display: inline-block;
            margin-top: 8px;
            padding: 2px 8px;
            background: ${categoryColors[location.category]}20;
            color: ${categoryColors[location.category]};
            border-radius: 4px;
            font-size: 11px;
            text-transform: capitalize;
          ">${location.category}</span>
        </div>
      `);

      marker.on('click', () => {
        onLocationClick?.(location);
      });

      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [mapReady, sourceId, destinationId, onLocationClick]);

  // Draw route
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;

    const map = mapInstanceRef.current;

    // Remove existing route
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    if (!route) return;

    // Draw the route with animation
    const latlngs: L.LatLngExpression[] = route.coordinates.map(coord => [coord.lat, coord.lng]);

    // Create animated route line
    const routeLine = L.polyline(latlngs, {
      color: '#f59e0b',
      weight: 5,
      opacity: 1,
      lineCap: 'round',
      lineJoin: 'round',
    });

    // Add glow effect
    const routeGlow = L.polyline(latlngs, {
      color: '#fbbf24',
      weight: 12,
      opacity: 0.3,
      lineCap: 'round',
      lineJoin: 'round',
    });

    routeGlow.addTo(map);
    routeLine.addTo(map);
    routeLayerRef.current = routeLine;

    // Fit bounds to show entire route
    const bounds = L.latLngBounds(latlngs);
    map.fitBounds(bounds, { padding: [50, 50] });

  }, [route, mapReady]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-xl overflow-hidden shadow-lg"
      style={{ minHeight: '400px' }}
    />
  );
}
