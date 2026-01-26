// Campus pathway graph for Dijkstra's algorithm
// Each edge represents a walkable path between two locations

export interface PathNode {
  id: string;
  lat: number;
  lng: number;
}

export interface PathEdge {
  from: string;
  to: string;
  distance: number; // in meters
}

// Additional waypoints for realistic paths (not actual locations, just path intersections)
export const pathWaypoints: PathNode[] = [
  { id: 'wp-1', lat: 21.103200, lng: 79.004500 }, // Near main gate path
  { id: 'wp-2', lat: 21.103500, lng: 79.004800 }, // Junction near FY building
  { id: 'wp-3', lat: 21.102800, lng: 79.005200 }, // Central junction
  { id: 'wp-4', lat: 21.102500, lng: 79.005800 }, // Path to lake
  { id: 'wp-5', lat: 21.102200, lng: 79.006400 }, // Near IT Garden
  { id: 'wp-6', lat: 21.101800, lng: 79.006200 }, // Near temple
  { id: 'wp-7', lat: 21.101600, lng: 79.007200 }, // Library path
  { id: 'wp-8', lat: 21.102100, lng: 79.007800 }, // Canteen junction
  { id: 'wp-9', lat: 21.101900, lng: 79.008500 }, // Towards admin
  { id: 'wp-10', lat: 21.103300, lng: 79.006800 }, // Near Mahadev temple path
];

// Define all campus paths (edges in the graph)
export const campusPaths: PathEdge[] = [
  // Main Gate connections
  { from: 'main-gate', to: 'wp-1', distance: 60 },
  { from: 'wp-1', to: 'wp-2', distance: 45 },
  { from: 'wp-1', to: 'sports-building', distance: 120 },
  
  // First Year area
  { from: 'wp-2', to: 'fy-building', distance: 25 },
  { from: 'wp-2', to: 'fy-canteen', distance: 55 },
  { from: 'fy-canteen', to: 'civil-electrical', distance: 45 },
  { from: 'fy-building', to: 'civil-electrical', distance: 50 },
  
  // Sports area connections
  { from: 'sports-building', to: 'first-ground', distance: 65 },
  { from: 'first-ground', to: 'wp-3', distance: 50 },
  
  // Central area
  { from: 'wp-2', to: 'wp-3', distance: 80 },
  { from: 'wp-3', to: 'wp-4', distance: 70 },
  { from: 'civil-electrical', to: 'swimming-pool', distance: 95 },
  { from: 'swimming-pool', to: 'wp-4', distance: 55 },
  
  // Lake and IT Garden area
  { from: 'wp-4', to: 'pce-lake', distance: 50 },
  { from: 'wp-4', to: 'wp-5', distance: 75 },
  { from: 'wp-5', to: 'it-garden', distance: 45 },
  { from: 'pce-lake', to: 'wp-5', distance: 65 },
  
  // Temple and IT Department area
  { from: 'wp-5', to: 'wp-6', distance: 50 },
  { from: 'wp-6', to: 'saraswati-temple', distance: 25 },
  { from: 'wp-6', to: 'it-auditorium', distance: 70 },
  { from: 'it-garden', to: 'it-cs-ct', distance: 35 },
  { from: 'saraswati-temple', to: 'it-auditorium', distance: 55 },
  
  // Library and central academic area
  { from: 'wp-6', to: 'wp-7', distance: 85 },
  { from: 'it-cs-ct', to: 'wp-7', distance: 50 },
  { from: 'wp-7', to: 'library', distance: 40 },
  { from: 'wp-7', to: 'aids-iot-robotics', distance: 35 },
  { from: 'library', to: 'aids-iot-robotics', distance: 30 },
  
  // Canteen area
  { from: 'wp-7', to: 'wp-8', distance: 70 },
  { from: 'wp-8', to: 'main-canteen', distance: 25 },
  { from: 'wp-8', to: 'ee-etc-aero', distance: 30 },
  { from: 'main-canteen', to: 'ee-etc-aero', distance: 20 },
  { from: 'aids-iot-robotics', to: 'main-canteen', distance: 50 },
  
  // Mahadev Temple area
  { from: 'swimming-pool', to: 'wp-10', distance: 130 },
  { from: 'wp-10', to: 'mahadev-temple', distance: 40 },
  { from: 'pce-lake', to: 'wp-10', distance: 120 },
  
  // MBA and Admin area
  { from: 'wp-8', to: 'mba-bba', distance: 50 },
  { from: 'wp-8', to: 'wp-9', distance: 85 },
  { from: 'mba-bba', to: 'wp-9', distance: 45 },
  { from: 'wp-9', to: 'mechanical-tnp', distance: 55 },
  { from: 'wp-9', to: 'admin-section', distance: 45 },
  { from: 'mechanical-tnp', to: 'admin-section', distance: 40 },
  { from: 'mechanical-tnp', to: 'mechanical-ground', distance: 25 },
  
  // Cross connections for better routing
  { from: 'mahadev-temple', to: 'main-canteen', distance: 125 },
  { from: 'ee-etc-aero', to: 'mba-bba', distance: 70 },
];

// Calculate Haversine distance between two coordinates
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
