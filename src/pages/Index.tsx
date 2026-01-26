import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CampusMap } from '@/components/CampusMap';
import { SearchPanel } from '@/components/SearchPanel';
import { DirectionsSheet } from '@/components/DirectionsSheet';
import { findShortestPath, RouteResult } from '@/utils/dijkstra';
import { CampusLocation, campusLocations } from '@/data/campusLocations';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [sourceId, setSourceId] = useState<string>('');
  const [destinationId, setDestinationId] = useState<string>('');
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { toast } = useToast();

  // Calculate route whenever both locations are set
  useEffect(() => {
    if (sourceId && destinationId && sourceId !== destinationId) {
      const result = findShortestPath(sourceId, destinationId);
      setRoute(result);
    } else {
      setRoute(null);
    }
  }, [sourceId, destinationId]);

  // Global functions for map popup buttons
  useEffect(() => {
    (window as any).setNavSource = (id: string) => {
      setSourceId(id);
      toast({
        title: "Starting point set",
        description: campusLocations.find(l => l.id === id)?.name,
      });
    };
    (window as any).setNavDest = (id: string) => {
      setDestinationId(id);
      toast({
        title: "Destination set", 
        description: campusLocations.find(l => l.id === id)?.name,
      });
    };
    
    return () => {
      delete (window as any).setNavSource;
      delete (window as any).setNavDest;
    };
  }, [toast]);

  const handleSwapLocations = useCallback(() => {
    setSourceId(destinationId);
    setDestinationId(sourceId);
  }, [sourceId, destinationId]);

  const handleLocationClick = useCallback((location: CampusLocation) => {
    // Smart selection - if no source, set source; if source but no dest, set dest
    if (!sourceId) {
      setSourceId(location.id);
    } else if (!destinationId) {
      setDestinationId(location.id);
    }
  }, [sourceId, destinationId]);

  const handleStartNavigation = useCallback(() => {
    setIsNavigating(true);
    toast({
      title: "Navigation started",
      description: "Follow the blue route on the map",
    });
  }, [toast]);

  const handleClearRoute = useCallback(() => {
    setSourceId('');
    setDestinationId('');
    setRoute(null);
    setIsNavigating(false);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Full Screen Map */}
      <div className="absolute inset-0">
        <CampusMap
          route={route}
          sourceId={sourceId || null}
          destinationId={destinationId || null}
          onLocationClick={handleLocationClick}
          isNavigating={isNavigating}
        />
      </div>

      {/* Search Panel - Google Maps style floating card */}
      <SearchPanel
        sourceId={sourceId}
        destinationId={destinationId}
        onSourceChange={setSourceId}
        onDestinationChange={setDestinationId}
        onSwap={handleSwapLocations}
        onNavigate={handleStartNavigation}
        onClear={handleClearRoute}
        route={route}
        isExpanded={isSearchExpanded}
        onExpandedChange={setIsSearchExpanded}
      />

      {/* Bottom Directions Sheet */}
      <AnimatePresence>
        {isNavigating && route && (
          <DirectionsSheet
            route={route}
            sourceId={sourceId || null}
            destinationId={destinationId || null}
            onClose={handleClearRoute}
            isNavigating={isNavigating}
          />
        )}
      </AnimatePresence>

      {/* College Branding - Bottom Left */}
      <div className="absolute bottom-4 left-4 z-[500] bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
        <div className="text-xs font-semibold text-foreground">PCE Nagpur</div>
        <div className="text-[10px] text-muted-foreground">Campus Navigator</div>
      </div>
    </div>
  );
};

export default Index;
