import { campusLocations, categoryLabels, categoryColors, CampusLocation } from '@/data/campusLocations';
import { Badge } from '@/components/ui/badge';

interface LocationLegendProps {
  onCategoryClick?: (category: CampusLocation['category']) => void;
}

export function LocationLegend({ onCategoryClick }: LocationLegendProps) {
  const categories = Object.entries(categoryLabels) as [CampusLocation['category'], string][];
  
  const getCategoryCount = (category: CampusLocation['category']) => 
    campusLocations.filter(loc => loc.category === category).length;

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Map Legend</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map(([category, label]) => {
          const count = getCategoryCount(category);
          if (count === 0) return null;
          
          return (
            <button
              key={category}
              onClick={() => onCategoryClick?.(category)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
              style={{ 
                backgroundColor: `${categoryColors[category]}15`,
                color: categoryColors[category],
                border: `1px solid ${categoryColors[category]}30`
              }}
            >
              <span 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: categoryColors[category] }}
              />
              {label}
              <span className="opacity-70">({count})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
