import { filterCategories, categoryColors, CampusLocation } from '@/data/campusLocations';

interface MapFiltersProps {
  activeFilters: CampusLocation['category'][];
  onToggleFilter: (category: CampusLocation['category']) => void;
}

export function MapFilters({ activeFilters, onToggleFilter }: MapFiltersProps) {
  const allActive = activeFilters.length === 0; // empty = show all

  return (
    <div className="absolute bottom-24 left-4 z-[900] w-full max-w-[420px]">
      <div className="bg-white/95 border border-slate-200 shadow-2xl rounded-[28px] p-4 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Filter locations</p>
            <p className="text-sm font-semibold text-slate-900">Show only what matters</p>
          </div>
          <span className="text-xs text-slate-400">
            {activeFilters.length === 0 ? 'All visible' : `${activeFilters.length} selected`}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterCategories.map(({ key, label, icon }) => {
            const isActive = allActive || activeFilters.includes(key);
            const color = categoryColors[key];

            return (
              <button
                key={key}
                onClick={() => onToggleFilter(key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-[11px] font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-950 text-white border border-slate-950'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
                style={isActive ? { boxShadow: `0 10px 30px ${color}20` } : {}}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
