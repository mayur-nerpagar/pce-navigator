export interface CampusLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: 'gate' | 'academic' | 'amenity' | 'recreation' | 'religious' | 'admin';
  description?: string;
  icon?: string;
}

// Updated with exact coordinates from GeoJSON
export const campusLocations: CampusLocation[] = [
  { id: 'main-gate', name: 'PCE Main Gate', lat: 21.103110911291367, lng: 79.00396776638746, category: 'gate', description: 'Main entrance to the campus' },
  { id: 'fy-canteen', name: 'First Year Canteen', lat: 21.103592922116718, lng: 79.00497359929443, category: 'amenity', description: 'Canteen for first year students' },
  { id: 'fy-building', name: 'First Year/Electrical', lat: 21.103568136555268, lng: 79.00550028461976, category: 'academic', description: 'First Year and Electrical Engineering' },
  { id: 'swimming-pool', name: 'Swimming Pool', lat: 21.103691514560182, lng: 79.00621597841439, category: 'recreation', description: 'Campus swimming pool' },
  { id: 'first-ground', name: 'PCE Ground', lat: 21.10212606112998, lng: 79.00475485989352, category: 'recreation', description: 'Main sports ground' },
  { id: 'pce-lake', name: 'PCE Lake', lat: 21.10260251067298, lng: 79.00628834818463, category: 'recreation', description: 'Beautiful campus lake' },
  { id: 'saraswati-temple', name: 'Saraswati Temple', lat: 21.101862982198668, lng: 79.00590154936697, category: 'religious', description: 'Campus Saraswati Temple' },
  { id: 'it-auditorium', name: 'IT Auditorium', lat: 21.101254904551723, lng: 79.00602560741709, category: 'academic', description: 'IT Department Auditorium' },
  { id: 'it-cs-ct', name: 'IT/CS/CT Department', lat: 21.10133279965447, lng: 79.00681498300474, category: 'academic', description: 'Information Technology, Computer Science & Computer Technology' },
  { id: 'library', name: 'Library', lat: 21.101448921880618, lng: 79.00760069032157, category: 'academic', description: 'Central Library' },
  { id: 'aids-iot-robotics', name: 'AIDS/IOT/Robotics', lat: 21.10188370173887, lng: 79.00761304644965, category: 'academic', description: 'AI & Data Science, IoT, Robotics Department' },
  { id: 'ee-etc-aero', name: 'EE/ETC/AERO', lat: 21.10220816542497, lng: 79.00765651969704, category: 'academic', description: 'Electronics, ETC & Aerospace Engineering' },
  { id: 'main-canteen', name: 'PCE Canteen', lat: 21.10267168374763, lng: 79.00759441505727, category: 'amenity', description: 'Main campus canteen' },
  { id: 'mba-bba', name: 'MBA/BBA', lat: 21.102029629915833, lng: 79.00835969483671, category: 'academic', description: 'MBA and BBA Department' },
  { id: 'mechanical-tnp', name: 'Mechanical/T&P/Admin', lat: 21.10192817022464, lng: 79.00895179186142, category: 'academic', description: 'Mechanical Engineering, Training & Placement, Admin' },
  { id: 'mechanical-ground', name: 'Mechanical Ground', lat: 21.101611730007008, lng: 79.00906472024741, category: 'recreation', description: 'Ground near Mechanical department' },
  { id: 'architecture', name: 'Architecture Building', lat: 21.101015444452983, lng: 79.01330949015278, category: 'academic', description: 'Architecture Department' },
  { id: 'pce-auditorium', name: 'PCE Auditorium', lat: 21.0993197482492, lng: 79.01483767658368, category: 'academic', description: 'Main college auditorium' },
  { id: 'chemical', name: 'Chemical Department', lat: 21.099370478994345, lng: 79.01587686728067, category: 'academic', description: 'Chemical Engineering Department' },
  { id: 'back-gate', name: 'PCE Back Gate', lat: 21.099566542721902, lng: 79.01908506102444, category: 'gate', description: 'Back entrance to the campus' },
];

export const campusCenter = { lat: 21.1015, lng: 79.0100 };

export const categoryColors: Record<CampusLocation['category'], string> = {
  gate: '#1e3a5f',
  academic: '#2563eb',
  amenity: '#f59e0b',
  recreation: '#10b981',
  religious: '#8b5cf6',
  admin: '#64748b',
};

export const categoryLabels: Record<CampusLocation['category'], string> = {
  gate: 'Entrance',
  academic: 'Academic',
  amenity: 'Amenities',
  recreation: 'Recreation',
  religious: 'Religious',
  admin: 'Administration',
};
