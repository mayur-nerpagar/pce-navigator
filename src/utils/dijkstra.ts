// Dijkstra's algorithm implementation for road-accurate routing

import { buildRoadGraph, getLocationNodeId } from './roadGraph';
import { geoJsonLocations, haversineDistance, RoadCoordinate } from '@/data/campusRoads';

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
  coordinates?: { lat: number; lng: number };
}

// Cached graph
let cachedGraph: ReturnType<typeof buildRoadGraph> | null = null;

function getGraph() {
  if (!cachedGraph) {
    cachedGraph = buildRoadGraph();
  }
  return cachedGraph;
}

// Find shortest path using Dijkstra's algorithm
export function findShortestPath(startLocationId: string, endLocationId: string): RouteResult | null {
  const { graph, nodes } = getGraph();
  
  const startNodeId = getLocationNodeId(startLocationId);
  const endNodeId = getLocationNodeId(endLocationId);
  
  if (!graph.has(startNodeId) || !graph.has(endNodeId)) {
    console.warn('Start or end location not found in graph:', startLocationId, endLocationId);
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
  
  distances.set(startNodeId, 0);
  
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
      break;
    }
    
    if (currentNode === endNodeId) {
      break;
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
  let current: string | null = endNodeId;
  
  while (current !== null) {
    path.unshift(current);
    current = previous.get(current) || null;
  }
  
  if (path[0] !== startNodeId) {
    console.warn('No path found between locations');
    return null;
  }
  
  // Build detailed coordinates array following actual road geometry
  const coordinates: { lat: number; lng: number }[] = [];
  
  for (let i = 0; i < path.length - 1; i++) {
    const fromNodeId = path[i];
    const toNodeId = path[i + 1];
    const edges = graph.get(fromNodeId) || [];
    const edge = edges.find(e => e.to === toNodeId);
    
    if (edge) {
      // Add all intermediate path coordinates
      for (let j = 0; j < edge.pathCoordinates.length; j++) {
        const coord = edge.pathCoordinates[j];
        // Avoid duplicates
        if (coordinates.length === 0 || 
            coordinates[coordinates.length - 1].lat !== coord.lat ||
            coordinates[coordinates.length - 1].lng !== coord.lng) {
          coordinates.push({ lat: coord.lat, lng: coord.lng });
        }
      }
    } else {
      // Direct connection
      const fromNode = nodes.get(fromNodeId);
      const toNode = nodes.get(toNodeId);
      if (fromNode && toNode) {
        if (coordinates.length === 0 || 
            coordinates[coordinates.length - 1].lat !== fromNode.lat ||
            coordinates[coordinates.length - 1].lng !== fromNode.lng) {
          coordinates.push({ lat: fromNode.lat, lng: fromNode.lng });
        }
        coordinates.push({ lat: toNode.lat, lng: toNode.lng });
      }
    }
  }
  
  // Generate turn-by-turn directions
  const directions = generateDirections(path, coordinates, nodes, startLocationId, endLocationId);
  
  return {
    path,
    coordinates,
    totalDistance: distances.get(endNodeId)!,
    directions,
  };
}

// Find shortest path from a GPS position to a destination
export function findPathFromPosition(
  lat: number, 
  lng: number, 
  endLocationId: string
): RouteResult | null {
  const { graph, nodes } = getGraph();
  
  const endNodeId = getLocationNodeId(endLocationId);
  
  if (!graph.has(endNodeId)) {
    return null;
  }
  
  // Find nearest road node to current position
  let nearestNodeId: string | null = null;
  let nearestDistance = Infinity;
  
  nodes.forEach((node, nodeId) => {
    const dist = haversineDistance(lat, lng, node.lat, node.lng);
    if (dist < nearestDistance) {
      nearestDistance = dist;
      nearestNodeId = nodeId;
    }
  });
  
  if (!nearestNodeId) {
    return null;
  }
  
  // Create temporary node for current position
  const tempNodeId = `current_pos_${Date.now()}`;
  nodes.set(tempNodeId, {
    id: tempNodeId,
    lat,
    lng,
    isLocation: false,
  });
  
  // Connect temp node to nearest road node
  const tempEdges = [{
    to: nearestNodeId,
    distance: nearestDistance,
    pathCoordinates: [
      { lat, lng },
      { lat: nodes.get(nearestNodeId)!.lat, lng: nodes.get(nearestNodeId)!.lng },
    ],
  }];
  graph.set(tempNodeId, tempEdges);
  
  // Also add reverse edge
  const nearestEdges = graph.get(nearestNodeId) || [];
  nearestEdges.push({
    to: tempNodeId,
    distance: nearestDistance,
    pathCoordinates: [
      { lat: nodes.get(nearestNodeId)!.lat, lng: nodes.get(nearestNodeId)!.lng },
      { lat, lng },
    ],
  });
  graph.set(nearestNodeId, nearestEdges);
  
  // Run Dijkstra from temp node
  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const unvisited = new Set<string>();
  
  graph.forEach((_, nodeId) => {
    distances.set(nodeId, Infinity);
    previous.set(nodeId, null);
    unvisited.add(nodeId);
  });
  
  distances.set(tempNodeId, 0);
  
  while (unvisited.size > 0) {
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
      break;
    }
    
    if (currentNode === endNodeId) {
      break;
    }
    
    unvisited.delete(currentNode);
    
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
  let current: string | null = endNodeId;
  
  while (current !== null) {
    path.unshift(current);
    current = previous.get(current) || null;
  }
  
  // Clean up temp node
  graph.delete(tempNodeId);
  nodes.delete(tempNodeId);
  const cleanEdges = nearestEdges.filter(e => e.to !== tempNodeId);
  graph.set(nearestNodeId, cleanEdges);
  
  if (path[0] !== tempNodeId) {
    return null;
  }
  
  // Build coordinates
  const coordinates: { lat: number; lng: number }[] = [{ lat, lng }];
  
  for (let i = 0; i < path.length; i++) {
    const node = nodes.get(path[i]);
    if (node) {
      coordinates.push({ lat: node.lat, lng: node.lng });
    }
  }
  
  const directions = generateDirectionsFromPosition(coordinates, endLocationId);
  
  return {
    path,
    coordinates,
    totalDistance: distances.get(endNodeId)!,
    directions,
  };
}

function getLocationName(nodeId: string): string {
  if (nodeId.startsWith('loc_')) {
    const locId = nodeId.replace('loc_', '');
    const loc = geoJsonLocations.find(l => l.id === locId);
    return loc?.name || locId;
  }
  return 'Road junction';
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

function getTurnDirection(prevBearing: number, newBearing: number): string {
  let diff = newBearing - prevBearing;
  if (diff < -180) diff += 360;
  if (diff > 180) diff -= 360;
  
  if (Math.abs(diff) < 30) return 'Continue straight';
  if (diff > 0 && diff < 60) return 'Bear right';
  if (diff >= 60 && diff < 120) return 'Turn right';
  if (diff >= 120) return 'Sharp right';
  if (diff < 0 && diff > -60) return 'Bear left';
  if (diff <= -60 && diff > -120) return 'Turn left';
  return 'Sharp left';
}

function generateDirections(
  path: string[],
  coordinates: { lat: number; lng: number }[],
  nodes: Map<string, any>,
  startLocationId: string,
  endLocationId: string
): DirectionStep[] {
  const directions: DirectionStep[] = [];
  
  if (coordinates.length < 2) return directions;
  
  // Starting instruction
  const startLoc = geoJsonLocations.find(l => l.id === startLocationId);
  const endLoc = geoJsonLocations.find(l => l.id === endLocationId);
  
  const firstBearing = calculateBearing(
    coordinates[0].lat, coordinates[0].lng,
    coordinates[1].lat, coordinates[1].lng
  );
  
  directions.push({
    instruction: `Start from ${startLoc?.name || 'your location'} and head ${getDirectionWord(firstBearing)}`,
    distance: 0,
    fromLocation: startLoc?.name || 'Start',
    toLocation: 'Route',
    coordinates: coordinates[0],
  });
  
  // Simplify: group segments and detect significant turns
  let prevBearing = firstBearing;
  let accumulatedDistance = 0;
  
  for (let i = 1; i < coordinates.length - 1; i++) {
    const current = coordinates[i];
    const next = coordinates[i + 1];
    
    const segmentDistance = haversineDistance(current.lat, current.lng, next.lat, next.lng);
    const newBearing = calculateBearing(current.lat, current.lng, next.lat, next.lng);
    
    let bearingDiff = Math.abs(newBearing - prevBearing);
    if (bearingDiff > 180) bearingDiff = 360 - bearingDiff;
    
    accumulatedDistance += segmentDistance;
    
    // Only create a direction step for significant turns (>30 degrees)
    if (bearingDiff > 30) {
      const turnDirection = getTurnDirection(prevBearing, newBearing);
      
      directions.push({
        instruction: `${turnDirection} and continue ${getDirectionWord(newBearing)}`,
        distance: Math.round(accumulatedDistance),
        fromLocation: 'Route',
        toLocation: 'Route',
        coordinates: current,
      });
      
      accumulatedDistance = 0;
    }
    
    prevBearing = newBearing;
  }
  
  // Final arrival instruction
  const totalDistance = coordinates.reduce((sum, coord, i) => {
    if (i === 0) return 0;
    return sum + haversineDistance(
      coordinates[i - 1].lat, coordinates[i - 1].lng,
      coord.lat, coord.lng
    );
  }, 0);
  
  directions.push({
    instruction: `Arrive at ${endLoc?.name || 'your destination'}`,
    distance: Math.round(totalDistance),
    fromLocation: 'Route',
    toLocation: endLoc?.name || 'Destination',
    coordinates: coordinates[coordinates.length - 1],
  });
  
  return directions;
}

function generateDirectionsFromPosition(
  coordinates: { lat: number; lng: number }[],
  endLocationId: string
): DirectionStep[] {
  const directions: DirectionStep[] = [];
  
  if (coordinates.length < 2) return directions;
  
  const endLoc = geoJsonLocations.find(l => l.id === endLocationId);
  
  const firstBearing = calculateBearing(
    coordinates[0].lat, coordinates[0].lng,
    coordinates[1].lat, coordinates[1].lng
  );
  
  directions.push({
    instruction: `Head ${getDirectionWord(firstBearing)} towards ${endLoc?.name || 'destination'}`,
    distance: 0,
    fromLocation: 'Your location',
    toLocation: 'Route',
    coordinates: coordinates[0],
  });
  
  // Add turn directions for significant bearing changes
  let prevBearing = firstBearing;
  
  for (let i = 1; i < coordinates.length - 1; i++) {
    const current = coordinates[i];
    const next = coordinates[i + 1];
    
    const newBearing = calculateBearing(current.lat, current.lng, next.lat, next.lng);
    
    let bearingDiff = Math.abs(newBearing - prevBearing);
    if (bearingDiff > 180) bearingDiff = 360 - bearingDiff;
    
    if (bearingDiff > 30) {
      const turnDirection = getTurnDirection(prevBearing, newBearing);
      const distance = haversineDistance(
        coordinates[i - 1].lat, coordinates[i - 1].lng,
        current.lat, current.lng
      );
      
      directions.push({
        instruction: turnDirection,
        distance: Math.round(distance),
        fromLocation: 'Route',
        toLocation: 'Route',
        coordinates: current,
      });
    }
    
    prevBearing = newBearing;
  }
  
  const totalDistance = coordinates.reduce((sum, coord, i) => {
    if (i === 0) return 0;
    return sum + haversineDistance(
      coordinates[i - 1].lat, coordinates[i - 1].lng,
      coord.lat, coord.lng
    );
  }, 0);
  
  directions.push({
    instruction: `Arrive at ${endLoc?.name || 'destination'}`,
    distance: Math.round(totalDistance),
    fromLocation: 'Route',
    toLocation: endLoc?.name || 'Destination',
    coordinates: coordinates[coordinates.length - 1],
  });
  
  return directions;
}
