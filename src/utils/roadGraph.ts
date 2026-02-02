// Road-accurate graph builder for Dijkstra's algorithm
// Uses actual road geometry from GeoJSON for precise routing

import { roadSegments, geoJsonLocations, haversineDistance, RoadCoordinate } from '@/data/campusRoads';

interface GraphNode {
  id: string;
  lat: number;
  lng: number;
  isLocation: boolean;
  locationId?: string;
}

interface GraphEdge {
  to: string;
  distance: number;
  pathCoordinates: RoadCoordinate[];
}

type Graph = Map<string, GraphEdge[]>;

// Create a unique ID for a coordinate point
function coordToId(lat: number, lng: number): string {
  return `${lat.toFixed(8)}_${lng.toFixed(8)}`;
}

// Tolerance for matching coordinates (in degrees, roughly 1-2 meters)
const COORD_TOLERANCE = 0.00002;

function coordsMatch(lat1: number, lng1: number, lat2: number, lng2: number): boolean {
  return Math.abs(lat1 - lat2) < COORD_TOLERANCE && Math.abs(lng1 - lng2) < COORD_TOLERANCE;
}

// Build the road graph from segments
export function buildRoadGraph(): { graph: Graph; nodes: Map<string, GraphNode> } {
  const graph: Graph = new Map();
  const nodes: Map<string, GraphNode> = new Map();
  
  // First, add all road segment vertices as nodes
  for (const segment of roadSegments) {
    for (let i = 0; i < segment.coordinates.length; i++) {
      const coord = segment.coordinates[i];
      const nodeId = coordToId(coord.lat, coord.lng);
      
      if (!nodes.has(nodeId)) {
        nodes.set(nodeId, {
          id: nodeId,
          lat: coord.lat,
          lng: coord.lng,
          isLocation: false,
        });
        graph.set(nodeId, []);
      }
    }
    
    // Add edges between consecutive points in the segment
    for (let i = 0; i < segment.coordinates.length - 1; i++) {
      const from = segment.coordinates[i];
      const to = segment.coordinates[i + 1];
      const fromId = coordToId(from.lat, from.lng);
      const toId = coordToId(to.lat, to.lng);
      
      const distance = haversineDistance(from.lat, from.lng, to.lat, to.lng);
      
      // Add bidirectional edges
      const fromEdges = graph.get(fromId) || [];
      fromEdges.push({
        to: toId,
        distance,
        pathCoordinates: [from, to],
      });
      graph.set(fromId, fromEdges);
      
      const toEdges = graph.get(toId) || [];
      toEdges.push({
        to: fromId,
        distance,
        pathCoordinates: [to, from],
      });
      graph.set(toId, toEdges);
    }
  }
  
  // Now add location points and connect them to nearest road points
  for (const location of geoJsonLocations) {
    const locationNodeId = `loc_${location.id}`;
    
    nodes.set(locationNodeId, {
      id: locationNodeId,
      lat: location.lat,
      lng: location.lng,
      isLocation: true,
      locationId: location.id,
    });
    graph.set(locationNodeId, []);
    
    // Find the nearest road point to connect to
    let nearestRoadNodeId: string | null = null;
    let nearestDistance = Infinity;
    
    nodes.forEach((node, nodeId) => {
      if (!node.isLocation) {
        const dist = haversineDistance(location.lat, location.lng, node.lat, node.lng);
        if (dist < nearestDistance) {
          nearestDistance = dist;
          nearestRoadNodeId = nodeId;
        }
      }
    });
    
    // Connect location to nearest road point (bidirectional)
    if (nearestRoadNodeId && nearestDistance < 200) { // Max 200m connection
      const nearestNode = nodes.get(nearestRoadNodeId)!;
      
      const locEdges = graph.get(locationNodeId) || [];
      locEdges.push({
        to: nearestRoadNodeId,
        distance: nearestDistance,
        pathCoordinates: [
          { lat: location.lat, lng: location.lng },
          { lat: nearestNode.lat, lng: nearestNode.lng },
        ],
      });
      graph.set(locationNodeId, locEdges);
      
      const roadEdges = graph.get(nearestRoadNodeId) || [];
      roadEdges.push({
        to: locationNodeId,
        distance: nearestDistance,
        pathCoordinates: [
          { lat: nearestNode.lat, lng: nearestNode.lng },
          { lat: location.lat, lng: location.lng },
        ],
      });
      graph.set(nearestRoadNodeId, roadEdges);
    }
  }
  
  // Connect road segments at intersection points
  const allPoints: { nodeId: string; lat: number; lng: number }[] = [];
  nodes.forEach((node, nodeId) => {
    if (!node.isLocation) {
      allPoints.push({ nodeId, lat: node.lat, lng: node.lng });
    }
  });
  
  // Find and connect nearby points (intersections)
  for (let i = 0; i < allPoints.length; i++) {
    for (let j = i + 1; j < allPoints.length; j++) {
      const p1 = allPoints[i];
      const p2 = allPoints[j];
      
      if (p1.nodeId !== p2.nodeId && coordsMatch(p1.lat, p1.lng, p2.lat, p2.lng)) {
        // These are the same physical point, connect them
        const dist = haversineDistance(p1.lat, p1.lng, p2.lat, p2.lng);
        
        // Check if edge already exists
        const p1Edges = graph.get(p1.nodeId) || [];
        const exists = p1Edges.some(e => e.to === p2.nodeId);
        
        if (!exists) {
          p1Edges.push({
            to: p2.nodeId,
            distance: Math.max(dist, 0.5), // Minimum 0.5m
            pathCoordinates: [
              { lat: p1.lat, lng: p1.lng },
              { lat: p2.lat, lng: p2.lng },
            ],
          });
          graph.set(p1.nodeId, p1Edges);
          
          const p2Edges = graph.get(p2.nodeId) || [];
          p2Edges.push({
            to: p1.nodeId,
            distance: Math.max(dist, 0.5),
            pathCoordinates: [
              { lat: p2.lat, lng: p2.lng },
              { lat: p1.lat, lng: p1.lng },
            ],
          });
          graph.set(p2.nodeId, p2Edges);
        }
      }
    }
  }
  
  return { graph, nodes };
}

// Get the location node ID for a location
export function getLocationNodeId(locationId: string): string {
  return `loc_${locationId}`;
}
