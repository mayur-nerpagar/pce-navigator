export interface CampusLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: 'gate' | 'academic' | 'amenity' | 'recreation' | 'religious' | 'admin';
  description?: string;
  icon?: string;
}

export const campusLocations: CampusLocation[] = [
  { id: 'main-gate', name: 'PCE Main Gate', lat: 21.103063, lng: 79.004020, category: 'gate', description: 'Main entrance to the campus' },
  { id: 'fy-canteen', name: 'First Year Canteen', lat: 21.103954, lng: 79.005062, category: 'amenity', description: 'Canteen for first year students' },
  { id: 'civil-electrical', name: 'Civil/Electrical', lat: 21.103659, lng: 79.005430, category: 'academic', description: 'Civil and Electrical Engineering Department' },
  { id: 'fy-building', name: 'First Year Building', lat: 21.103415, lng: 79.005001, category: 'academic', description: 'First Year classrooms and labs' },
  { id: 'swimming-pool', name: 'Swimming Pool', lat: 21.103705, lng: 79.006245, category: 'recreation', description: 'Campus swimming pool' },
  { id: 'sports-building', name: 'Sports Building', lat: 21.102051, lng: 79.004304, category: 'recreation', description: 'Indoor sports facility' },
  { id: 'first-ground', name: 'First Ground', lat: 21.102249, lng: 79.004838, category: 'recreation', description: 'Main sports ground' },
  { id: 'pce-lake', name: 'PCE Lake', lat: 21.102662, lng: 79.006276, category: 'recreation', description: 'Beautiful campus lake' },
  { id: 'it-garden', name: 'IT Garden', lat: 21.101866, lng: 79.006795, category: 'recreation', description: 'Garden near IT department' },
  { id: 'it-auditorium', name: 'IT Auditorium', lat: 21.101265, lng: 79.005897, category: 'academic', description: 'IT Department Auditorium' },
  { id: 'it-cs-ct', name: 'IT/CS/CT Department', lat: 21.101590, lng: 79.006817, category: 'academic', description: 'Information Technology, Computer Science & Computer Technology' },
  { id: 'saraswati-temple', name: 'Saraswati Temple', lat: 21.101881, lng: 79.005989, category: 'religious', description: 'Campus Saraswati Temple' },
  { id: 'library', name: 'Library', lat: 21.101417, lng: 79.007840, category: 'academic', description: 'Central Library' },
  { id: 'aids-iot-robotics', name: 'AIDS/IOT/Robotics', lat: 21.101714, lng: 79.007636, category: 'academic', description: 'AI & Data Science, IoT, Robotics Department' },
  { id: 'main-canteen', name: 'Main Canteen', lat: 21.102479, lng: 79.007738, category: 'amenity', description: 'Main campus canteen' },
  { id: 'ee-etc-aero', name: 'EE/ETC/AERO', lat: 21.102353, lng: 79.007597, category: 'academic', description: 'Electronics, ETC & Aerospace Engineering' },
  { id: 'mahadev-temple', name: 'Mahadev Temple', lat: 21.103592, lng: 79.007413, category: 'religious', description: 'Campus Mahadev Temple' },
  { id: 'mechanical-tnp', name: 'Mechanical & T&P', lat: 21.101812, lng: 79.009012, category: 'academic', description: 'Mechanical Engineering & Training and Placement' },
  { id: 'admin-section', name: 'Admin Section', lat: 21.101874, lng: 79.009377, category: 'admin', description: 'Administrative offices' },
  { id: 'mechanical-ground', name: 'Mechanical Ground', lat: 21.101601, lng: 79.009004, category: 'recreation', description: 'Ground near Mechanical department' },
  { id: 'mba-bba', name: 'MBA/BBA', lat: 21.102040, lng: 79.008184, category: 'academic', description: 'MBA and BBA Department' },
];

export const campusCenter = { lat: 21.102400, lng: 79.006500 };

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
