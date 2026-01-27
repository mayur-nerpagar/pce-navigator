// Campus pathway graph for Dijkstra's algorithm
// Each edge represents a walkable path between two locations following actual campus roads

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

// Waypoints along actual campus roads (intersections and turns)
export const pathWaypoints: PathNode[] = [
  // Main Road from Gate
  { id: 'road-1', lat: 21.103063, lng: 79.004250 }, // Just inside main gate
  { id: 'road-2', lat: 21.103100, lng: 79.004600 }, // Main road turn
  { id: 'road-3', lat: 21.103200, lng: 79.004900 }, // Near FY junction
  
  // FY Area Roads
  { id: 'road-4', lat: 21.103500, lng: 79.005050 }, // FY building junction
  { id: 'road-5', lat: 21.103700, lng: 79.005250 }, // FY to Civil road
  
  // Sports Area Path
  { id: 'road-6', lat: 21.102500, lng: 79.004400 }, // Road to sports
  { id: 'road-7', lat: 21.102300, lng: 79.004600 }, // Sports junction
  
  // Central Campus Road
  { id: 'road-8', lat: 21.103000, lng: 79.005400 }, // Central road
  { id: 'road-9', lat: 21.102800, lng: 79.005800 }, // Towards lake
  { id: 'road-10', lat: 21.103200, lng: 79.006000 }, // Pool junction
  
  // Lake Area Path  
  { id: 'road-11', lat: 21.102500, lng: 79.006200 }, // Lake approach
  { id: 'road-12', lat: 21.102200, lng: 79.006400 }, // IT Garden path
  
  // IT Department Road
  { id: 'road-13', lat: 21.101900, lng: 79.006300 }, // Temple junction
  { id: 'road-14', lat: 21.101700, lng: 79.006600 }, // IT dept approach
  { id: 'road-15', lat: 21.101500, lng: 79.006500 }, // IT Auditorium path
  
  // Library Road
  { id: 'road-16', lat: 21.101600, lng: 79.007200 }, // AIDS junction
  { id: 'road-17', lat: 21.101500, lng: 79.007600 }, // Library approach
  
  // Main Canteen Road
  { id: 'road-18', lat: 21.102000, lng: 79.007400 }, // EE junction
  { id: 'road-19', lat: 21.102300, lng: 79.007600 }, // Canteen road
  
  // Mahadev Temple Road
  { id: 'road-20', lat: 21.103300, lng: 79.006600 }, // From pool to temple
  { id: 'road-21', lat: 21.103400, lng: 79.007000 }, // Temple approach
  
  // MBA/Admin Road
  { id: 'road-22', lat: 21.102100, lng: 79.007900 }, // MBA approach
  { id: 'road-23', lat: 21.101900, lng: 79.008400 }, // Towards mechanical
  { id: 'road-24', lat: 21.101800, lng: 79.008800 }, // Mechanical junction
];

// Define all campus paths following actual roads (edges in the graph)
export const campusPaths: PathEdge[] = [
  // Main Gate Road
  { from: 'main-gate', to: 'road-1', distance: 25 },
  { from: 'road-1', to: 'road-2', distance: 40 },
  { from: 'road-2', to: 'road-3', distance: 35 },
  { from: 'road-2', to: 'road-6', distance: 70 }, // Branch to sports
  
  // FY Area
  { from: 'road-3', to: 'road-4', distance: 35 },
  { from: 'road-3', to: 'fy-building', distance: 25 },
  { from: 'road-4', to: 'fy-building', distance: 20 },
  { from: 'road-4', to: 'fy-canteen', distance: 45 },
  { from: 'road-4', to: 'road-5', distance: 30 },
  { from: 'road-5', to: 'civil-electrical', distance: 20 },
  { from: 'road-5', to: 'road-8', distance: 25 },
  
  // Sports Area
  { from: 'road-6', to: 'sports-building', distance: 50 },
  { from: 'road-6', to: 'road-7', distance: 30 },
  { from: 'road-7', to: 'first-ground', distance: 25 },
  { from: 'road-7', to: 'road-8', distance: 90 },
  
  // Central Road
  { from: 'road-8', to: 'road-9', distance: 50 },
  { from: 'road-8', to: 'civil-electrical', distance: 40 },
  { from: 'road-9', to: 'road-10', distance: 50 },
  { from: 'road-9', to: 'road-11', distance: 45 },
  
  // Pool Area
  { from: 'road-10', to: 'swimming-pool', distance: 30 },
  { from: 'road-10', to: 'road-20', distance: 65 },
  
  // Lake and IT Garden
  { from: 'road-11', to: 'pce-lake', distance: 20 },
  { from: 'road-11', to: 'road-12', distance: 40 },
  { from: 'road-12', to: 'it-garden', distance: 45 },
  { from: 'road-12', to: 'road-13', distance: 35 },
  
  // Temple and IT Area
  { from: 'road-13', to: 'saraswati-temple', distance: 30 },
  { from: 'road-13', to: 'road-14', distance: 40 },
  { from: 'road-13', to: 'road-15', distance: 50 },
  { from: 'road-14', to: 'it-cs-ct', distance: 25 },
  { from: 'road-14', to: 'it-garden', distance: 30 },
  { from: 'road-15', to: 'it-auditorium', distance: 35 },
  { from: 'road-15', to: 'saraswati-temple', distance: 40 },
  
  // Library Road
  { from: 'road-14', to: 'road-16', distance: 55 },
  { from: 'road-16', to: 'aids-iot-robotics', distance: 25 },
  { from: 'road-16', to: 'road-17', distance: 45 },
  { from: 'road-17', to: 'library', distance: 25 },
  { from: 'road-17', to: 'aids-iot-robotics', distance: 30 },
  
  // Main Canteen Road
  { from: 'road-16', to: 'road-18', distance: 45 },
  { from: 'road-18', to: 'ee-etc-aero', distance: 30 },
  { from: 'road-18', to: 'road-19', distance: 35 },
  { from: 'road-19', to: 'main-canteen', distance: 20 },
  { from: 'road-19', to: 'ee-etc-aero', distance: 25 },
  
  // Mahadev Temple Road
  { from: 'road-20', to: 'road-21', distance: 45 },
  { from: 'road-21', to: 'mahadev-temple', distance: 45 },
  { from: 'road-21', to: 'main-canteen', distance: 90 }, // Long path
  
  // MBA/Admin Road
  { from: 'road-19', to: 'road-22', distance: 40 },
  { from: 'road-22', to: 'mba-bba', distance: 30 },
  { from: 'road-22', to: 'road-23', distance: 55 },
  { from: 'road-23', to: 'road-24', distance: 45 },
  { from: 'road-24', to: 'mechanical-tnp', distance: 25 },
  { from: 'road-24', to: 'mechanical-ground', distance: 20 },
  { from: 'mechanical-tnp', to: 'admin-section', distance: 45 },
  
  // Cross connections for better routing
  { from: 'pce-lake', to: 'road-20', distance: 80 },
  { from: 'swimming-pool', to: 'road-9', distance: 50 },
  { from: 'mba-bba', to: 'main-canteen', distance: 55 },
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

// Campus boundary for map restriction
export const CAMPUS_BOUNDS = {
  north: 21.1050,
  south: 21.1000,
  east: 79.0105,
  west: 79.0025,
};
