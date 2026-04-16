import { filterCategories, categoryColors, CampusLocation } from '@/data/campusLocations';

interface MapFiltersProps {
  activeFilters: CampusLocation['category'][];
  onToggleFilter: (category: CampusLocation['category']) => void;
}

export function MapFilters({ activeFilters, onToggleFilter }: MapFiltersProps) {
  const allActive = activeFilters.length === 0; // empty = show all

  return (
    <div className="absolute top-[140px] left-4 right-16 z-[900] overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 pb-1">
        {filterCategories.map(({ key, label, icon }) => {
          const isActive = allActive || activeFilters.includes(key);
          const color = categoryColors[key];
          
          return (
            <button
              key={key}
              onClick={() => onToggleFilter(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shadow-md border ${
                isActive
                  ? 'bg-white text-gray-900 border-gray-200'
                  : 'bg-gray-200/80 text-gray-500 border-gray-300/50'
              }`}
              style={isActive ? { borderColor: color, boxShadow: `0 2px 8px ${color}30` } : {}}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
