// Campus road network extracted from GeoJSON
// Each road segment is a LineString with precise coordinates

export interface RoadCoordinate {
  lat: number;
  lng: number;
}

export interface RoadSegment {
  id: string;
  coordinates: RoadCoordinate[];
}

// All road segments from the uploaded GeoJSON
export const roadSegments: RoadSegment[] = [
  // Main road from gate through central campus
  {
    id: 'road-main-1',
    coordinates: [
      { lng: 79.00397260470749, lat: 21.103110853305353 },
      { lng: 79.0040696831112, lat: 21.103119344031313 },
      { lng: 79.00412125601332, lat: 21.103065569426604 },
      { lng: 79.00431541282222, lat: 21.103096702095 },
      { lng: 79.0043791205253, lat: 21.1031391 },
      { lng: 79.00484934404778, lat: 21.10319576053992 },
      { lng: 79.00490091694991, lat: 21.103167458133996 },
      { lng: 79.00514057926188, lat: 21.103088211367705 },
      { lng: 79.00530136536872, lat: 21.102975001628394 },
      { lng: 79.00539541007294, lat: 21.102839149827815 },
      { lng: 79.00549248847807, lat: 21.102646692896627 },
      { lng: 79.0056047353824, lat: 21.102261778286447 },
      { lng: 79.00567311630454, lat: 21.101834314561287 },
      { lng: 79.00575902900914, lat: 21.101726271476394 },
      { lng: 79.00593037869271, lat: 21.10162174796386 },
      { lng: 79.00721247073267, lat: 21.1016185928315 },
      { lng: 79.00728166891241, lat: 21.101667780630905 },
      { lng: 79.00780889870845, lat: 21.101698522838404 },
      { lng: 79.00783855538316, lat: 21.10166163218834 },
      { lng: 79.007871498302, lat: 21.101099052128248 },
      { lng: 79.00826691467739, lat: 21.10115131815124 },
    ],
  },
  // Branch road towards ground/sports
  {
    id: 'road-ground-1',
    coordinates: [
      { lng: 79.00431525974932, lat: 21.103096148882244 },
      { lng: 79.00416624762994, lat: 21.102921382685324 },
      { lng: 79.0040449091914, lat: 21.102635401191534 },
      { lng: 79.00403639947308, lat: 21.102480411514392 },
      { lng: 79.00442063128037, lat: 21.10142276020396 },
      { lng: 79.0047516032347, lat: 21.101071391155116 },
      { lng: 79.00572169344474, lat: 21.10103235009862 },
      { lng: 79.00615157655773, lat: 21.10102880091104 },
      { lng: 79.00670319648032, lat: 21.101039448473614 },
      { lng: 79.00787345311807, lat: 21.101103339207313 },
    ],
  },
  // Road towards mechanical/admin
  {
    id: 'road-mechanical-1',
    coordinates: [
      { lng: 79.00826876898441, lat: 21.101151816102572 },
      { lng: 79.00867963072085, lat: 21.101183758760754 },
      { lng: 79.00895179186142, lat: 21.10192817022464 }, // Mechanical building exact
      { lng: 79.0096915679602, lat: 21.10151028331353 },
      { lng: 79.00998069288522, lat: 21.101570619293284 },
    ],
  },
  // Long road to architecture/auditorium/back gate
  {
    id: 'road-architecture-1',
    coordinates: [
      { lng: 79.00998023162055, lat: 21.10157777284175 },
      { lng: 79.01309973739353, lat: 21.1007472637083 },
      { lng: 79.01446585367461, lat: 21.100430858502534 },
      { lng: 79.01532942417515, lat: 21.10012562683208 },
      { lng: 79.01550449224993, lat: 21.100052733289928 },
      { lng: 79.0158582898552, lat: 21.09996400299204 },
      { lng: 79.01625393448978, lat: 21.09996400299204 },
      { lng: 79.0166115363715, lat: 21.09989301871549 },
      { lng: 79.01683598861621, lat: 21.099914314001893 },
      { lng: 79.01825884094796, lat: 21.09988237189704 },
      { lng: 79.01857079152398, lat: 21.099822035231284 },
      { lng: 79.018962631884, lat: 21.09965522196785 },
      { lng: 79.019095781521, lat: 21.099566491432483 },
    ],
  },
  // Chemical building branch
  {
    id: 'road-chemical-1',
    coordinates: [
      { lng: 79.01649687060757, lat: 21.099912749762424 },
      { lng: 79.01666328593797, lat: 21.099808693924714 },
      { lng: 79.0167199379656, lat: 21.09967655942279 },
      { lng: 79.01671285646194, lat: 21.099557638270937 },
      { lng: 79.01654290037897, lat: 21.099412290066937 },
      { lng: 79.01587686728067, lat: 21.099370478994345 }, // Chemical exact location
    ],
  },
  // Auditorium branch
  {
    id: 'road-auditorium-1',
    coordinates: [
      { lng: 79.01534217739066, lat: 21.100116025332554 },
      { lng: 79.01513681379095, lat: 21.099498296805194 },
      { lng: 79.0151562879256, lat: 21.099390937307362 },
      { lng: 79.01516691018031, lat: 21.09932486988521 },
      { lng: 79.01505891725395, lat: 21.09932321819886 },
    ],
  },
  // MBA/BBA branch
  {
    id: 'road-mba-1',
    coordinates: [
      { lng: 79.0097247067489, lat: 21.101517157201783 },
      { lng: 79.0095566808958, lat: 21.101744516990962 },
      { lng: 79.00944252594962, lat: 21.101781612495245 },
      { lng: 79.00851518154428, lat: 21.101862981402178 },
    ],
  },
  // Vertical road near library
  {
    id: 'road-library-1',
    coordinates: [
      { lng: 79.00732889714214, lat: 21.101670342744598 },
      { lng: 79.00732662244604, lat: 21.10240460875272 },
    ],
  },
  // Horizontal connection near AIDS
  {
    id: 'road-aids-1',
    coordinates: [
      { lng: 79.0073259344669, lat: 21.10240377028545 },
      { lng: 79.0076014631498, lat: 21.102409298269762 },
    ],
  },
  // Road towards canteen
  {
    id: 'road-canteen-1',
    coordinates: [
      { lng: 79.00760119489553, lat: 21.102408746231376 },
      { lng: 79.0078015663193, lat: 21.102422259546273 },
      { lng: 79.0078916932253, lat: 21.102417004368476 },
      { lng: 79.00793273315543, lat: 21.10238547329753 },
      { lng: 79.00797058084572, lat: 21.10208005537605 },
      { lng: 79.00813601716072, lat: 21.102001102100587 },
    ],
  },
  // Connection near library
  {
    id: 'road-library-2',
    coordinates: [
      { lng: 79.00797032772971, lat: 21.102079978598553 },
      { lng: 79.00800082141183, lat: 21.10177071239724 },
      { lng: 79.00782474498823, lat: 21.101679859592124 },
    ],
  },
  // Library horizontal connection
  {
    id: 'road-library-3',
    coordinates: [
      { lng: 79.00760069032157, lat: 21.101448921880618 }, // Library exact location
      { lng: 79.00785305084935, lat: 21.101401228988507 },
      { lng: 79.00855763412471, lat: 21.101442696480177 },
    ],
  },
  // Small connector road
  {
    id: 'road-connector-1',
    coordinates: [
      { lng: 79.00826665489859, lat: 21.101151227493077 },
      { lng: 79.00827000766014, lat: 21.10115185308311 },
    ],
  },
  // Vertical road to IT
  {
    id: 'road-it-1',
    coordinates: [
      { lng: 79.00732784427896, lat: 21.10167015707603 },
      { lng: 79.00734624546823, lat: 21.101072600688966 },
    ],
  },
  // Temple vertical road
  {
    id: 'road-temple-1',
    coordinates: [
      { lng: 79.00567266875538, lat: 21.101833966441106 },
      { lng: 79.00572373459977, lat: 21.101027880642135 },
    ],
  },
  // Road towards lake
  {
    id: 'road-lake-1',
    coordinates: [
      { lng: 79.0073267054475, lat: 21.102403934232854 },
      { lng: 79.00728430526351, lat: 21.102614209493197 },
      { lng: 79.0068558402582, lat: 21.103049332599966 },
      { lng: 79.00677550306864, lat: 21.103086807258094 },
      { lng: 79.0065211019712, lat: 21.103099298809 },
    ],
  },
  // Swimming pool approach
  {
    id: 'road-pool-1',
    coordinates: [
      { lng: 79.00652146141192, lat: 21.10309922870414 },
      { lng: 79.00647148557351, lat: 21.103101414211594 },
      { lng: 79.00628251443607, lat: 21.103277711714938 },
      { lng: 79.00620833342225, lat: 21.10329883813361 },
    ],
  },
  // Mechanical connector
  {
    id: 'road-mechanical-2',
    coordinates: [
      { lng: 79.00998070359668, lat: 21.101570336129228 },
      { lng: 79.00997995534607, lat: 21.101578014966478 },
    ],
  },
];

// Location points from GeoJSON with exact coordinates
export interface LocationPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export const geoJsonLocations: LocationPoint[] = [
  { id: 'it-auditorium', name: 'IT Auditorium', lat: 21.101254904551723, lng: 79.00602560741709 },
  { id: 'it-cs-ct', name: 'IT/CS/CT', lat: 21.10133279965447, lng: 79.00681498300474 },
  { id: 'fy-building', name: 'First Year/Electrical', lat: 21.103568136555268, lng: 79.00550028461976 },
  { id: 'swimming-pool', name: 'Swimming Pool', lat: 21.103691514560182, lng: 79.00621597841439 },
  { id: 'main-gate', name: 'PCE Main Gate', lat: 21.103110911291367, lng: 79.00396776638746 },
  { id: 'library', name: 'Library', lat: 21.101448921880618, lng: 79.00760069032157 },
  { id: 'aids-iot-robotics', name: 'AIDS', lat: 21.10188370173887, lng: 79.00761304644965 },
  { id: 'ee-etc-aero', name: 'AERO/ETC/EC', lat: 21.10220816542497, lng: 79.00765651969704 },
  { id: 'main-canteen', name: 'PCE Canteen', lat: 21.10267168374763, lng: 79.00759441505727 },
  { id: 'fy-canteen', name: '1st Year Canteen', lat: 21.103592922116718, lng: 79.00497359929443 },
  { id: 'first-ground', name: 'PCE Ground', lat: 21.10212606112998, lng: 79.00475485989352 },
  { id: 'mechanical-tnp', name: 'Mechanical/T&P/Admin', lat: 21.10192817022464, lng: 79.00895179186142 },
  { id: 'mba-bba', name: 'BBA/MBA', lat: 21.102029629915833, lng: 79.00835969483671 },
  { id: 'architecture', name: 'Architecture Building', lat: 21.101015444452983, lng: 79.01330949015278 },
  { id: 'back-gate', name: 'PCE Back Gate', lat: 21.099566542721902, lng: 79.01908506102444 },
  { id: 'pce-auditorium', name: 'PCE Auditorium', lat: 21.0993197482492, lng: 79.01483767658368 },
  { id: 'chemical', name: 'Chemical', lat: 21.099370478994345, lng: 79.01587686728067 },
  { id: 'pce-lake', name: 'PCE Lake', lat: 21.10260251067298, lng: 79.00628834818463 },
  { id: 'saraswati-temple', name: 'Saraswati Temple', lat: 21.101862982198668, lng: 79.00590154936697 },
  { id: 'mechanical-ground', name: 'Mechanical Ground', lat: 21.101611730007008, lng: 79.00906472024741 },
];

// Calculate haversine distance between two points in meters
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

// Find the nearest point on any road segment to a given location
export function findNearestRoadPoint(lat: number, lng: number): { lat: number; lng: number; distance: number; segmentId: string; pointIndex: number } | null {
  let nearest: { lat: number; lng: number; distance: number; segmentId: string; pointIndex: number } | null = null;
  
  for (const segment of roadSegments) {
    for (let i = 0; i < segment.coordinates.length; i++) {
      const point = segment.coordinates[i];
      const dist = haversineDistance(lat, lng, point.lat, point.lng);
      
      if (!nearest || dist < nearest.distance) {
        nearest = {
          lat: point.lat,
          lng: point.lng,
          distance: dist,
          segmentId: segment.id,
          pointIndex: i,
        };
      }
    }
  }
  
  return nearest;
}

// Campus bounds (extended for new locations)
export const CAMPUS_BOUNDS = {
  north: 21.1050,
  south: 21.0985,
  east: 79.0200,
  west: 79.0025,
};
