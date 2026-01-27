import { useState, useMemo } from 'react';
import { Search, X, MapPin, Navigation, ArrowLeft, Clock, Route, Locate, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { campusLocations, categoryLabels, CampusLocation } from '@/data/campusLocations';
import { RouteResult } from '@/utils/dijkstra';
import { GeolocationState } from '@/hooks/useGeolocation';

interface SearchPanelProps {
  sourceId: string;
  destinationId: string;
  onSourceChange: (id: string) => void;
  onDestinationChange: (id: string) => void;
  onSwap: () => void;
  onNavigate: () => void;
  onClear: () => void;
  route: RouteResult | null;
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  onUseMyLocation?: () => void;
  gpsEnabled?: boolean;
  userLocation?: GeolocationState;
}

export function SearchPanel({
  sourceId,
  destinationId,
  onSourceChange,
  onDestinationChange,
  onSwap,
  onNavigate,
  onClear,
  route,
  isExpanded,
  onExpandedChange,
  onUseMyLocation,
  gpsEnabled,
  userLocation,
}: SearchPanelProps) {
  const [activeInput, setActiveInput] = useState<'source' | 'destination' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const sourceName = campusLocations.find(l => l.id === sourceId)?.name || '';
  const destName = campusLocations.find(l => l.id === destinationId)?.name || '';

  const filteredLocations = useMemo(() => {
    if (!searchQuery) return campusLocations;
    const query = searchQuery.toLowerCase();
    return campusLocations.filter(
      loc => loc.name.toLowerCase().includes(query) || 
             loc.description?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleLocationSelect = (locationId: string) => {
    if (activeInput === 'source') {
      onSourceChange(locationId);
    } else if (activeInput === 'destination') {
      onDestinationChange(locationId);
    }
    setActiveInput(null);
    setSearchQuery('');
  };

  const estimatedTime = route ? Math.ceil(route.totalDistance / 80) : 0;

  return (
    <>
      {/* Main Search Card - Google Maps Style */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-4 left-4 right-4 md:right-auto md:w-[400px] z-[1000]"
      >
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header with inputs */}
          <div className="p-3">
            {/* Source Input */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 flex justify-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-blue-200"></div>
              </div>
              <button
                onClick={() => { setActiveInput('source'); onExpandedChange(true); }}
                className="flex-1 text-left px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
              >
                {sourceName || <span className="text-gray-500">Choose starting point</span>}
              </button>
              {sourceId && (
                <button onClick={() => onSourceChange('')} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Connecting line */}
            <div className="flex items-center gap-3">
              <div className="w-6 flex justify-center">
                <div className="w-0.5 h-4 bg-gray-300"></div>
              </div>
            </div>

            {/* Destination Input */}
            <div className="flex items-center gap-3 mt-2">
              <div className="w-6 flex justify-center">
                <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-red-200"></div>
              </div>
              <button
                onClick={() => { setActiveInput('destination'); onExpandedChange(true); }}
                className="flex-1 text-left px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
              >
                {destName || <span className="text-gray-500">Choose destination</span>}
              </button>
              {destinationId && (
                <button onClick={() => onDestinationChange('')} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Swap button */}
            {(sourceId || destinationId) && (
              <button
                onClick={onSwap}
                className="absolute right-14 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            )}
          </div>

          {/* Route Info - shows when route is calculated */}
          <AnimatePresence>
            {route && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-200"
              >
                <div className="p-4 bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-blue-700">
                        <Clock className="w-5 h-5" />
                        <span className="font-semibold text-lg">{estimatedTime} min</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Route className="w-4 h-4" />
                        <span className="text-sm">{route.totalDistance}m</span>
                      </div>
                    </div>
                    <button
                      onClick={onNavigate}
                      className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors shadow-md"
                    >
                      Start
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Location Search Overlay */}
      <AnimatePresence>
        {activeInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-[1001]"
          >
            {/* Search Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200">
              <button
                onClick={() => { setActiveInput(null); setSearchQuery(''); }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={activeInput === 'source' ? 'Search starting point...' : 'Search destination...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Use My Location Button */}
            {activeInput === 'source' && onUseMyLocation && (
              <button
                onClick={() => {
                  onUseMyLocation();
                  setActiveInput(null);
                }}
                className="w-full flex items-center gap-4 px-4 py-3 bg-primary/5 hover:bg-primary/10 transition-colors text-left border-b border-gray-200"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {userLocation?.isLoading ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : (
                    <Locate className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">Use my current location</div>
                  <div className="text-sm text-muted-foreground">
                    {userLocation?.isLoading ? 'Getting location...' : 'GPS-based detection'}
                  </div>
                </div>
              </button>
            )}

            {/* Location List */}
            <div className="overflow-y-auto h-[calc(100%-80px)]">
              {Object.entries(categoryLabels).map(([category, label]) => {
                const categoryLocations = filteredLocations.filter(l => l.category === category);
                if (categoryLocations.length === 0) return null;

                return (
                  <div key={category}>
                    <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {label}
                    </div>
                    {categoryLocations.map((location) => (
                      <button
                        key={location.id}
                        onClick={() => handleLocationSelect(location.id)}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{location.name}</div>
                          {location.description && (
                            <div className="text-sm text-gray-500">{location.description}</div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
