import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Navigation, Clock, Route, MapPin, ArrowUp, ArrowUpRight, ArrowRight, ArrowDownRight, ArrowDown, ArrowDownLeft, ArrowLeft, ArrowUpLeft, X, Navigation2 } from 'lucide-react';
import { RouteResult } from '@/utils/dijkstra';
import { campusLocations } from '@/data/campusLocations';
import { GeolocationState } from '@/hooks/useGeolocation';
import { useIsMobile } from '@/hooks/use-mobile';

interface DirectionsSheetProps {
  route: RouteResult | null;
  sourceId: string | null;
  destinationId: string | null;
  onClose: () => void;
  isNavigating: boolean;
  userLocation?: GeolocationState;
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

export function DirectionsSheet({ route, sourceId, destinationId, onClose, isNavigating, userLocation }: DirectionsSheetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();
  
  const sourceName = campusLocations.find(l => l.id === sourceId)?.name;
  const destName = campusLocations.find(l => l.id === destinationId)?.name;
  const estimatedTime = route ? Math.ceil(route.totalDistance / 80) : 0;

  // Auto-expand on mobile if navigating and not yet expanded
  useEffect(() => {
    if (isMobile && isNavigating && !isExpanded && route) {
      setIsExpanded(true);
    }
  }, [isNavigating, isMobile, isExpanded, route]);

  if (!route) return null;

  // Calculate dynamic max height
  const maxHeightClass = isMobile 
    ? isExpanded ? 'max-h-[85vh]' : 'max-h-[auto]'
    : isExpanded ? 'max-h-[80vh]' : 'max-h-[auto]';

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-3xl shadow-2xl ${maxHeightClass} flex flex-col`}
    >
      {/* Drag Handle */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex-shrink-0 mt-3 mx-auto w-12 h-1.5 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors"
      />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>

      {/* Summary Header - Compact on mobile */}
      <div className={`flex-shrink-0 ${isMobile ? 'pt-6 pb-3 px-4' : 'pt-8 pb-4 px-6'}`}>
        <div className={`flex items-center ${isMobile ? 'gap-2 mb-2' : 'gap-4 mb-4'}`}>
          <div className="flex items-center gap-2">
            <Clock className={`text-green-600 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            <span className={`font-bold text-green-600 ${isMobile ? 'text-lg' : 'text-2xl'}`}>{estimatedTime} min</span>
          </div>
          <div className="text-gray-400">•</div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Route className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
            <span className={isMobile ? 'text-xs' : ''}>{route.totalDistance}m</span>
          </div>
          <div className="flex-1" />
          <span className={`text-green-600 font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>Fastest route</span>
        </div>

        {/* Route Preview */}
        <div className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
          <span className="font-medium truncate">{sourceName}</span>
          <span className="flex-shrink-0">→</span>
          <span className="font-medium truncate">{destName}</span>
        </div>
      </div>

      {/* Current Direction Card (when navigating) */}
      {isNavigating && route.directions.length > 0 && (
        <div className={`flex-shrink-0 ${isMobile ? 'mx-3 mb-3 p-3' : 'mx-4 mb-4 p-4'} bg-primary rounded-xl text-primary-foreground`}>
          <div className="flex items-center gap-3">
            {(() => {
              const Icon = getDirectionIcon(route.directions[0].instruction);
              return <Icon className={isMobile ? 'w-6 h-6' : 'w-8 h-8'} />;
            })()}
            <div className="flex-1 min-w-0">
              <div className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>{route.directions[0].instruction}</div>
              {route.directions[0].distance > 0 && (
                <div className={`opacity-80 ${isMobile ? 'text-xs' : 'text-sm'}`}>{route.directions[0].distance}m</div>
              )}
            </div>
            {userLocation?.latitude && (
              <div className={`flex items-center gap-1 opacity-80 flex-shrink-0 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                <Navigation2 className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
                <span>Live</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex-shrink-0 w-full flex items-center justify-center gap-2 py-3 text-blue-500 font-medium hover:bg-gray-50 transition-colors border-t border-gray-100"
      >
        {isExpanded ? (
          <>
            <ChevronDown className="w-5 h-5" />
            <span className={isMobile ? 'text-sm' : ''}>Hide steps</span>
          </>
        ) : (
          <>
            <ChevronUp className="w-5 h-5" />
            <span className={isMobile ? 'text-sm' : ''}>{route.directions.length - 1} steps</span>
          </>
        )}
      </button>

      {/* Expanded Directions - Scrollable */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden flex-1"
          >
            <div className={`overflow-y-auto ${isMobile ? 'max-h-[calc(85vh-280px)]' : 'max-h-[50vh]'}`}>
              {route.directions.map((step, index) => {
                const Icon = getDirectionIcon(step.instruction);
                const isLast = index === route.directions.length - 1;
                
                return (
                  <div
                    key={index}
                    className={`flex gap-3 ${isMobile ? 'px-4 py-3' : 'px-6 py-4'} ${!isLast ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className={`
                      rounded-full flex items-center justify-center flex-shrink-0
                      ${isMobile ? 'w-9 h-9' : 'w-10 h-10'}
                      ${isLast ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}
                    `}>
                      {isLast ? (
                        <MapPin className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
                      ) : (
                        <Icon className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className={`font-medium text-gray-900 ${isMobile ? 'text-sm' : ''}`}>{step.instruction}</div>
                      {step.distance > 0 && (
                        <div className={`text-gray-500 mt-0.5 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          Walk {step.distance}m
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {/* Bottom padding for safe area */}
              <div className="h-6" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
