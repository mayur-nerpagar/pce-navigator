export interface CampusLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: 'gate' | 'academic' | 'parking' | 'recreation' | 'religious' | 'admin' | 'food' | 'facility';
  description?: string;
  icon?: string;
}

// Updated with exact coordinates from GeoJSON map_2
export const campusLocations: CampusLocation[] = [
  // Gates
  { id: 'main-gate', name: 'PCE Main Gate', lat: 21.103110911291367, lng: 79.00396776638746, category: 'gate', description: 'Main entrance to the campus' },
  { id: 'back-gate', name: 'PCE Back Gate', lat: 21.099566542721902, lng: 79.01908506102444, category: 'gate', description: 'Back entrance to the campus' },

  // Academic Buildings
  { id: 'fy-building', name: 'First Year / Electrical / Civil', lat: 21.103568136555268, lng: 79.00550028461976, category: 'academic', description: 'First Year, Electrical & Civil Engineering' },
  { id: 'it-auditorium', name: 'IT Auditorium', lat: 21.101254904551723, lng: 79.00602560741709, category: 'academic', description: 'IT Department Auditorium' },
  { id: 'it-cs-ct', name: 'IT / CS / CT Department', lat: 21.10133279965447, lng: 79.00681498300474, category: 'academic', description: 'Information Technology, Computer Science & Computer Technology' },
  { id: 'library', name: 'Library', lat: 21.101400, lng: 79.007654, category: 'academic', description: 'Central Library' },
  { id: 'aids', name: 'AIDS Department', lat: 21.10188370173887, lng: 79.00761304644965, category: 'academic', description: 'AI & Data Science Department' },
  { id: 'ee-etc-aero', name: 'AERO / ETC / EC', lat: 21.10220816542497, lng: 79.00765651969704, category: 'academic', description: 'Aerospace, Electronics & Telecommunication, Electronics & Communication' },
  { id: 'mba-bba', name: 'BBA / MBA', lat: 21.102029629915833, lng: 79.00835969483671, category: 'academic', description: 'BBA and MBA Department' },
  { id: 'mechanical-tnp', name: 'Mechanical / T&P / Admin Block', lat: 21.101920, lng: 79.009033, category: 'academic', description: 'Mechanical Engineering, Training & Placement, Admin Block' },
  { id: 'architecture', name: 'Architecture Building', lat: 21.101015444452983, lng: 79.01330949015278, category: 'academic', description: 'Architecture Department' },
  { id: 'pce-auditorium', name: 'PCE Auditorium', lat: 21.0993197482492, lng: 79.01483767658368, category: 'academic', description: 'Main college auditorium' },
  { id: 'chemical', name: 'Chemical / BioTechnology', lat: 21.099251, lng: 79.015930, category: 'academic', description: 'Chemical Engineering & BioTechnology Department' },

  // Food
  { id: 'fy-canteen', name: 'PCE 1st Year Canteen', lat: 21.103592922116718, lng: 79.00497359929443, category: 'food', description: 'Canteen for first year students' },
  { id: 'main-canteen', name: 'PCE Canteen', lat: 21.10267168374763, lng: 79.00759441505727, category: 'food', description: 'Main campus canteen' },

  // Recreation
  { id: 'swimming-pool', name: 'Swimming Pool', lat: 21.103691514560182, lng: 79.00621597841439, category: 'recreation', description: 'Campus swimming pool' },
  { id: 'first-ground', name: 'PCE Ground', lat: 21.10212606112998, lng: 79.00475485989352, category: 'recreation', description: 'Main sports ground' },
  { id: 'pce-lake', name: 'PCE Lake', lat: 21.10260251067298, lng: 79.00628834818463, category: 'recreation', description: 'Beautiful campus lake' },
  { id: 'it-garden', name: 'IT Garden', lat: 21.10189072362425, lng: 79.00661863445288, category: 'recreation', description: 'Garden near IT Department' },
  { id: 'mechanical-ground', name: 'Mechanical Ground', lat: 21.101611730007008, lng: 79.00906472024741, category: 'recreation', description: 'Ground near Mechanical department' },

  // Religious
  { id: 'saraswati-temple', name: 'Saraswati Temple', lat: 21.101862982198668, lng: 79.00590154936697, category: 'religious', description: 'Campus Saraswati Temple' },

  // Parking
  { id: 'parking-fy', name: 'FY Building Parking', lat: 21.103450, lng: 79.005650, category: 'parking', description: 'Parking near First Year Building' },
  { id: 'parking-it', name: 'IT Building Parking', lat: 21.101450, lng: 79.006500, category: 'parking', description: 'Parking near IT/CS/CT Department' },
  { id: 'parking-mechanical', name: 'Mechanical/Admin Parking', lat: 21.101750, lng: 79.009100, category: 'parking', description: 'Parking near Mechanical & Admin Block' },
  { id: 'parking-architecture', name: 'Architecture Parking', lat: 21.101150, lng: 79.013200, category: 'parking', description: 'Parking near Architecture Building' },
  { id: 'parking-auditorium', name: 'Auditorium Parking', lat: 21.099500, lng: 79.014700, category: 'parking', description: 'Parking near PCE Auditorium' },
  { id: 'parking-mba', name: 'BBA/MBA Parking', lat: 21.102150, lng: 79.008250, category: 'parking', description: 'Parking near BBA/MBA Department' },
  { id: 'parking-aero', name: 'AERO/ETC/EC Parking', lat: 21.102350, lng: 79.007550, category: 'parking', description: 'Parking near AERO/ETC/EC Building' },
  { id: 'parking-aids', name: 'AIDS Building Parking', lat: 21.101750, lng: 79.007700, category: 'parking', description: 'Parking near AIDS Department' },
  { id: 'parking-chemical', name: 'Chemical/BioTech Parking', lat: 21.099400, lng: 79.015800, category: 'parking', description: 'Parking near Chemical & BioTechnology' },
];

export const campusCenter = { lat: 21.1015, lng: 79.0100 };

export const categoryColors: Record<CampusLocation['category'], string> = {
  gate: '#1e3a5f',
  academic: '#2563eb',
  food: '#f59e0b',
  recreation: '#10b981',
  religious: '#8b5cf6',
  admin: '#64748b',
  parking: '#ec4899',
  facility: '#06b6d4',
};

export const categoryLabels: Record<CampusLocation['category'], string> = {
  gate: 'Gates',
  academic: 'Academics',
  food: 'Food',
  recreation: 'Recreation',
  religious: 'Religious',
  admin: 'Admin',
  parking: 'Parking',
  facility: 'Facilities',
};

// Filter categories for the UI
export const filterCategories = [
  { key: 'academic' as const, label: 'Academics', icon: '🎓' },
  { key: 'facility' as const, label: 'Facilities', icon: '🏗️' },
  { key: 'recreation' as const, label: 'Recreation', icon: '⚽' },
  { key: 'religious' as const, label: 'Religious', icon: '🛕' },
  { key: 'food' as const, label: 'Food', icon: '🍽️' },
  { key: 'admin' as const, label: 'Admin', icon: '🏢' },
  { key: 'parking' as const, label: 'Parking', icon: '🅿️' },
  { key: 'gate' as const, label: 'Gates', icon: '🚪' },
];
