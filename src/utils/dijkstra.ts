import { campusLocations } from '@/data/campusLocations';
import { campusPaths, pathWaypoints, PathNode } from '@/data/campusGraph';

interface GraphNode {
  id: string;
  lat: number;
  lng: number;
}

interface Edge {
  to: string;
  distance: number;
}

type Graph = Map<string, Edge[]>;

// Build the graph from campus data
function buildGraph(): Graph {
  const graph: Graph = new Map();
  
  // Add all location nodes
  campusLocations.forEach(loc => {
    graph.set(loc.id, []);
  });
  
  // Add all waypoints
  pathWaypoints.forEach(wp => {
    graph.set(wp.id, []);
  });
  
  // Add edges (bidirectional)
  campusPaths.forEach(path => {
    const fromEdges = graph.get(path.from) || [];
    fromEdges.push({ to: path.to, distance: path.distance });
    graph.set(path.from, fromEdges);
    
    const toEdges = graph.get(path.to) || [];
    toEdges.push({ to: path.from, distance: path.distance });
    graph.set(path.to, toEdges);
  });
  
  return graph;
}

// Get all nodes (locations + waypoints)
function getAllNodes(): Map<string, GraphNode> {
  const nodes = new Map<string, GraphNode>();
  
  campusLocations.forEach(loc => {
    nodes.set(loc.id, { id: loc.id, lat: loc.lat, lng: loc.lng });
  });
  
  pathWaypoints.forEach(wp => {
    nodes.set(wp.id, wp);
  });
  
  return nodes;
}

export interface RouteResult {
  path: string[];
  coordinates: { lat: number; lng: number }[];
  totalDistance: number;
  directions: DirectionStep[];
}

export interface DirectionStep {
  instruction: string;
  distance: number;
  fromLocation: string;
  toLocation: string;
}

// Dijkstra's algorithm implementation
export function findShortestPath(startId: string, endId: string): RouteResult | null {
  const graph = buildGraph();
  const nodes = getAllNodes();
  
  if (!graph.has(startId) || !graph.has(endId)) {
    return null;
  }
  
  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const unvisited = new Set<string>();
  
  // Initialize
  graph.forEach((_, nodeId) => {
    distances.set(nodeId, Infinity);
    previous.set(nodeId, null);
    unvisited.add(nodeId);
  });
  
  distances.set(startId, 0);
  
  while (unvisited.size > 0) {
    // Find node with minimum distance
    let currentNode: string | null = null;
    let minDistance = Infinity;
    
    unvisited.forEach(nodeId => {
      const dist = distances.get(nodeId)!;
      if (dist < minDistance) {
        minDistance = dist;
        currentNode = nodeId;
      }
    });
    
    if (currentNode === null || distances.get(currentNode) === Infinity) {
      break; // No reachable nodes left
    }
    
    if (currentNode === endId) {
      break; // Found the destination
    }
    
    unvisited.delete(currentNode);
    
    // Update neighbors
    const neighbors = graph.get(currentNode) || [];
    for (const edge of neighbors) {
      if (!unvisited.has(edge.to)) continue;
      
      const altDistance = distances.get(currentNode)! + edge.distance;
      if (altDistance < distances.get(edge.to)!) {
        distances.set(edge.to, altDistance);
        previous.set(edge.to, currentNode);
      }
    }
  }
  
  // Reconstruct path
  const path: string[] = [];
  let current: string | null = endId;
  
  while (current !== null) {
    path.unshift(current);
    current = previous.get(current) || null;
  }
  
  if (path[0] !== startId) {
    return null; // No path found
  }
  
  // Build coordinates array
  const coordinates = path.map(nodeId => {
    const node = nodes.get(nodeId)!;
    return { lat: node.lat, lng: node.lng };
  });
  
  // Generate directions
  const directions = generateDirections(path, nodes);
  
  return {
    path,
    coordinates,
    totalDistance: distances.get(endId)!,
    directions,
  };
}

function getLocationName(nodeId: string): string {
  const location = campusLocations.find(loc => loc.id === nodeId);
  if (location) return location.name;
  
  const waypoint = pathWaypoints.find(wp => wp.id === nodeId);
  if (waypoint) return 'Junction';
  
  return nodeId;
}

function calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const y = Math.sin(dLng) * Math.cos(lat2 * Math.PI / 180);
  const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
    Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLng);
  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
}

function getDirectionWord(bearing: number): string {
  if (bearing >= 337.5 || bearing < 22.5) return 'north';
  if (bearing >= 22.5 && bearing < 67.5) return 'northeast';
  if (bearing >= 67.5 && bearing < 112.5) return 'east';
  if (bearing >= 112.5 && bearing < 157.5) return 'southeast';
  if (bearing >= 157.5 && bearing < 202.5) return 'south';
  if (bearing >= 202.5 && bearing < 247.5) return 'southwest';
  if (bearing >= 247.5 && bearing < 292.5) return 'west';
  return 'northwest';
}

function generateDirections(path: string[], nodes: Map<string, GraphNode>): DirectionStep[] {
  const directions: DirectionStep[] = [];
  
  for (let i = 0; i < path.length - 1; i++) {
    const fromNode = nodes.get(path[i])!;
    const toNode = nodes.get(path[i + 1])!;
    
    const fromName = getLocationName(path[i]);
    const toName = getLocationName(path[i + 1]);
    
    const bearing = calculateBearing(fromNode.lat, fromNode.lng, toNode.lat, toNode.lng);
    const direction = getDirectionWord(bearing);
    
    // Estimate distance
    const edge = campusPaths.find(
      e => (e.from === path[i] && e.to === path[i + 1]) ||
           (e.from === path[i + 1] && e.to === path[i])
    );
    const distance = edge?.distance || 50;
    
    let instruction: string;
    if (i === 0) {
      instruction = `Start from ${fromName} and head ${direction} towards ${toName}`;
    } else if (toName !== 'Junction') {
      instruction = `Continue ${direction} to reach ${toName}`;
    } else {
      instruction = `Walk ${direction} through the campus pathway`;
    }
    
    directions.push({
      instruction,
      distance,
      fromLocation: fromName,
      toLocation: toName,
    });
  }
  
  // Add arrival message
  const lastLocation = getLocationName(path[path.length - 1]);
  directions.push({
    instruction: `You have arrived at ${lastLocation}`,
    distance: 0,
    fromLocation: lastLocation,
    toLocation: lastLocation,
  });
  
  return directions;
}
