import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Clock } from 'lucide-react';
import { campusLocations, CampusLocation } from '@/data/campusLocations';
import { Button } from '@/components/ui/button';

interface HeaderSearchProps {
  onLocationSelect: (location: CampusLocation) => void;
  currentDestination?: string | null;
  isOpen?: boolean;
}

export function HeaderSearch({ onLocationSelect, currentDestination, isOpen = false }: HeaderSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(isOpen);
  const [filteredLocations, setFilteredLocations] = useState<CampusLocation[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter locations based on search query
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setFilteredLocations([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = campusLocations.filter(
      loc =>
        loc.name.toLowerCase().includes(query) ||
        loc.category.toLowerCase().includes(query)
    );
    setFilteredLocations(filtered);
  }, [searchQuery]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isExpanded]);

  const handleLocationClick = (location: CampusLocation) => {
    onLocationSelect(location);
    setSearchQuery('');
    setIsExpanded(false);
  };

  const handleClear = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="fixed top-0 left-0 right-0 z-[800] pointer-events-none flex justify-center pt-4"
    >
      <div className="pointer-events-auto w-full max-w-md px-4 md:max-w-lg">
        {/* Search Input Container */}
        <motion.div
          animate={{ scale: isExpanded ? 1 : 0.95 }}
          className="relative"
        >
          <div className="flex items-center gap-2 bg-white rounded-full shadow-xl border border-gray-200 px-4 py-2.5 hover:shadow-2xl transition-shadow">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for another location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dropdown Results */}
          <AnimatePresence>
            {isExpanded && (searchQuery.length > 0 || true) && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
              >
                {filteredLocations.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto">
                    {filteredLocations.map((location, index) => (
                      <motion.button
                        key={location.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => handleLocationClick(location)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left border-b border-gray-50 last:border-0"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {location.name}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {location.category}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 flex-shrink-0">
                          →
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : searchQuery.length > 0 ? (
                  <div className="px-4 py-8 text-center">
                    <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No locations found</p>
                    <p className="text-xs text-gray-400 mt-1">Try searching by name or category</p>
                  </div>
                ) : (
                  // Show popular/recent locations when search is empty
                  <div className="max-h-80 overflow-y-auto">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 sticky top-0">
                      POPULAR DESTINATIONS
                    </div>
                    {campusLocations.slice(0, 6).map((location, index) => (
                      <motion.button
                        key={location.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => handleLocationClick(location)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left border-b border-gray-50 last:border-0"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {location.name}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {location.category}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Click outside to close */}
        {isExpanded && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </div>
    </motion.div>
  );
}
