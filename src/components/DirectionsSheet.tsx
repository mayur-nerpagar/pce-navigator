import { useState } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { ChevronUp, ChevronDown, Navigation, Clock, Route, MapPin, ArrowUp, ArrowUpRight, ArrowRight, ArrowDownRight, ArrowDown, ArrowDownLeft, ArrowLeft, ArrowUpLeft, X } from 'lucide-react';
import { RouteResult } from '@/utils/dijkstra';
import { campusLocations } from '@/data/campusLocations';

interface DirectionsSheetProps {
  route: RouteResult | null;
  sourceId: string | null;
  destinationId: string | null;
  onClose: () => void;
  isNavigating: boolean;
}

const getDirectionIcon = (instruction: string) => {
  const lower = instruction.toLowerCase();
  if (lower.includes('north') && lower.includes('east')) return ArrowUpRight;
  if (lower.includes('north') && lower.includes('west')) return ArrowUpLeft;
  if (lower.includes('south') && lower.includes('east')) return ArrowDownRight;
  if (lower.includes('south') && lower.includes('west')) return ArrowDownLeft;
  if (lower.includes('north')) return ArrowUp;
  if (lower.includes('south')) return ArrowDown;
  if (lower.includes('east')) return ArrowRight;
  if (lower.includes('west')) return ArrowLeft;
  return Navigation;
};

export function DirectionsSheet({ route, sourceId, destinationId, onClose, isNavigating }: DirectionsSheetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const sourceName = campusLocations.find(l => l.id === sourceId)?.name;
  const destName = campusLocations.find(l => l.id === destinationId)?.name;
  const estimatedTime = route ? Math.ceil(route.totalDistance / 80) : 0;

  if (!route) return null;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-3xl shadow-2xl"
      style={{ maxHeight: isExpanded ? '80vh' : 'auto' }}
    >
      {/* Drag Handle */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors"
      />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>

      {/* Summary Header */}
      <div className="pt-8 pb-4 px-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">{estimatedTime} min</span>
          </div>
          <div className="text-gray-400">•</div>
          <div className="flex items-center gap-2 text-gray-600">
            <Route className="w-4 h-4" />
            <span>{route.totalDistance}m</span>
          </div>
          <div className="flex-1" />
          <span className="text-sm text-green-600 font-medium">Fastest route</span>
        </div>

        {/* Route Preview */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">{sourceName}</span>
          <span>→</span>
          <span className="font-medium">{destName}</span>
        </div>
      </div>

      {/* Current Direction Card (when navigating) */}
      {isNavigating && route.directions.length > 0 && (
        <div className="mx-4 mb-4 p-4 bg-blue-500 rounded-xl text-white">
          <div className="flex items-center gap-4">
            {(() => {
              const Icon = getDirectionIcon(route.directions[0].instruction);
              return <Icon className="w-8 h-8" />;
            })()}
            <div>
              <div className="font-semibold text-lg">{route.directions[0].instruction}</div>
              {route.directions[0].distance > 0 && (
                <div className="text-blue-100 text-sm">{route.directions[0].distance}m</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center gap-2 py-3 text-blue-500 font-medium hover:bg-gray-50 transition-colors border-t border-gray-100"
      >
        {isExpanded ? (
          <>
            <ChevronDown className="w-5 h-5" />
            Hide steps
          </>
        ) : (
          <>
            <ChevronUp className="w-5 h-5" />
            {route.directions.length - 1} steps
          </>
        )}
      </button>

      {/* Expanded Directions */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="max-h-[50vh] overflow-y-auto pb-safe">
              {route.directions.map((step, index) => {
                const Icon = getDirectionIcon(step.instruction);
                const isLast = index === route.directions.length - 1;
                
                return (
                  <div
                    key={index}
                    className={`flex gap-4 px-6 py-4 ${!isLast ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center shrink-0
                      ${isLast ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}
                    `}>
                      {isLast ? (
                        <MapPin className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="font-medium text-gray-900">{step.instruction}</div>
                      {step.distance > 0 && (
                        <div className="text-sm text-gray-500 mt-1">
                          Walk {step.distance}m
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
