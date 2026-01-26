import { RouteResult } from '@/utils/dijkstra';
import { ArrowRight, MapPin, Navigation, Clock, Route } from 'lucide-react';
import { motion } from 'framer-motion';
import { campusLocations } from '@/data/campusLocations';

interface DirectionsPanelProps {
  route: RouteResult | null;
  sourceId: string | null;
  destinationId: string | null;
}

export function DirectionsPanel({ route, sourceId, destinationId }: DirectionsPanelProps) {
  const sourceName = campusLocations.find(l => l.id === sourceId)?.name;
  const destName = campusLocations.find(l => l.id === destinationId)?.name;

  if (!route) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-muted rounded-full">
            <Route className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">No Route Selected</h3>
            <p className="text-sm text-muted-foreground">
              Select your source and destination to get step-by-step directions
            </p>
          </div>
        </div>
      </div>
    );
  }

  const estimatedTime = Math.ceil(route.totalDistance / 80); // Assuming 80m/min walking speed

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border overflow-hidden"
    >
      {/* Route Summary Header */}
      <div className="bg-primary p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-primary-foreground text-lg">Route Details</h3>
          <div className="flex items-center gap-4 text-primary-foreground/90 text-sm">
            <div className="flex items-center gap-1">
              <Route className="w-4 h-4" />
              <span>{route.totalDistance}m</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>~{estimatedTime} min</span>
            </div>
          </div>
        </div>
        
        {/* Source to Destination */}
        <div className="flex items-center gap-3 text-primary-foreground">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate font-medium">{sourceName}</span>
          </div>
          <ArrowRight className="w-5 h-5 shrink-0" />
          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
            <span className="truncate font-medium">{destName}</span>
            <Navigation className="w-4 h-4 shrink-0" />
          </div>
        </div>
      </div>

      {/* Directions List */}
      <div className="p-4 max-h-[400px] overflow-y-auto">
        <h4 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
          Step-by-Step Directions
        </h4>
        <ol className="space-y-4">
          {route.directions.map((step, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4"
            >
              {/* Step Number */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold
                ${index === route.directions.length - 1 
                  ? 'bg-accent text-accent-foreground' 
                  : 'bg-muted text-muted-foreground'}
              `}>
                {index === route.directions.length - 1 ? '✓' : index + 1}
              </div>
              
              {/* Instruction */}
              <div className="flex-1 pt-1">
                <p className="text-foreground">{step.instruction}</p>
                {step.distance > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Walk approximately {step.distance}m
                  </p>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </motion.div>
  );
}
