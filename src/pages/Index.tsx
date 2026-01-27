import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CampusMap } from '@/components/CampusMap';
import { SearchPanel } from '@/components/SearchPanel';
import { DirectionsSheet } from '@/components/DirectionsSheet';
import { findShortestPath, RouteResult } from '@/utils/dijkstra';
import { CampusLocation, campusLocations } from '@/data/campusLocations';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useToast } from '@/hooks/use-toast';
import { Navigation2, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [sourceId, setSourceId] = useState<string>('');
  const [destinationId, setDestinationId] = useState<string>('');
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const { toast } = useToast();

  // GPS tracking
  const userLocation = useGeolocation(gpsEnabled || isNavigating);

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
    setGpsEnabled(true); // Enable GPS when navigation starts
    toast({
      title: "Navigation started",
      description: "Follow the blue route. GPS tracking enabled.",
    });
  }, [toast]);

  const handleClearRoute = useCallback(() => {
    setSourceId('');
    setDestinationId('');
    setRoute(null);
    setIsNavigating(false);
  }, []);

  const handleToggleGps = useCallback(() => {
    setGpsEnabled(prev => !prev);
    if (!gpsEnabled) {
      toast({
        title: "GPS Tracking Enabled",
        description: "Your live location will be shown on the map.",
      });
    }
  }, [gpsEnabled, toast]);

  // Use current location as source
  const handleUseMyLocation = useCallback(() => {
    if (userLocation.latitude && userLocation.longitude && userLocation.isInsideCampus) {
      // Find nearest location to user
      let nearestId = '';
      let nearestDist = Infinity;
      
      campusLocations.forEach(loc => {
        const dist = Math.sqrt(
          Math.pow(loc.lat - userLocation.latitude!, 2) + 
          Math.pow(loc.lng - userLocation.longitude!, 2)
        );
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestId = loc.id;
        }
      });
      
      if (nearestId) {
        setSourceId(nearestId);
        toast({
          title: "Location detected",
          description: `Nearest: ${campusLocations.find(l => l.id === nearestId)?.name}`,
        });
      }
    } else if (!userLocation.isInsideCampus && userLocation.latitude) {
      toast({
        title: "Outside campus",
        description: "GPS shows you're outside the campus boundary.",
        variant: "destructive",
      });
    } else if (userLocation.error) {
      toast({
        title: "Location Error",
        description: userLocation.error,
        variant: "destructive",
      });
    } else {
      setGpsEnabled(true);
      toast({
        title: "Getting location...",
        description: "Please wait while we detect your location.",
      });
    }
  }, [userLocation, toast]);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Full Screen Satellite Map */}
      <div className="absolute inset-0">
        <CampusMap
          route={route}
          sourceId={sourceId || null}
          destinationId={destinationId || null}
          onLocationClick={handleLocationClick}
          isNavigating={isNavigating}
          userLocation={gpsEnabled ? userLocation : undefined}
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
        onUseMyLocation={handleUseMyLocation}
        gpsEnabled={gpsEnabled}
        userLocation={userLocation}
      />

      {/* GPS Toggle Button */}
      <div className="absolute top-4 right-4 z-[600]">
        <Button
          variant={gpsEnabled ? "default" : "secondary"}
          size="icon"
          className={`h-12 w-12 rounded-full shadow-lg ${
            gpsEnabled 
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
              : 'bg-card hover:bg-accent text-foreground'
          }`}
          onClick={handleToggleGps}
        >
          {userLocation.isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Navigation2 className={`h-5 w-5 ${gpsEnabled ? 'fill-current' : ''}`} />
          )}
        </Button>
      </div>

      {/* GPS Status Indicator */}
      {gpsEnabled && userLocation.latitude && (
        <div className="absolute top-20 right-4 z-[600] bg-card/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${userLocation.isInsideCampus ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`} />
            <span className="text-xs font-medium text-foreground">
              {userLocation.isInsideCampus ? 'Inside Campus' : 'Outside Campus'}
            </span>
          </div>
          {userLocation.accuracy && (
            <div className="text-[10px] text-muted-foreground mt-0.5">
              Accuracy: ±{Math.round(userLocation.accuracy)}m
            </div>
          )}
        </div>
      )}

      {/* Bottom Directions Sheet */}
      <AnimatePresence>
        {isNavigating && route && (
          <DirectionsSheet
            route={route}
            sourceId={sourceId || null}
            destinationId={destinationId || null}
            onClose={handleClearRoute}
            isNavigating={isNavigating}
            userLocation={gpsEnabled ? userLocation : undefined}
          />
        )}
      </AnimatePresence>

      {/* College Branding - Bottom Left */}
      <div className="absolute bottom-4 left-4 z-[500] bg-card/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <div>
            <div className="text-xs font-bold text-foreground">PCE Nagpur</div>
            <div className="text-[10px] text-muted-foreground">Campus Navigator</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
