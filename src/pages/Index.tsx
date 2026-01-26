import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Navigation2, Compass, MapPinned } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CampusMap } from '@/components/CampusMap';
import { LocationSelector } from '@/components/LocationSelector';
import { DirectionsPanel } from '@/components/DirectionsPanel';
import { QRScanner } from '@/components/QRScanner';
import { Header } from '@/components/Header';
import { LocationLegend } from '@/components/LocationLegend';
import { findShortestPath, RouteResult } from '@/utils/dijkstra';
import { CampusLocation } from '@/data/campusLocations';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [sourceId, setSourceId] = useState<string>('');
  const [destinationId, setDestinationId] = useState<string>('');
  const [route, setRoute] = useState<RouteResult | null>(null);
  const { toast } = useToast();

  const handleCalculateRoute = useCallback(() => {
    if (!sourceId || !destinationId) {
      toast({
        title: "Missing Selection",
        description: "Please select both source and destination locations",
        variant: "destructive",
      });
      return;
    }

    if (sourceId === destinationId) {
      toast({
        title: "Same Location",
        description: "Source and destination cannot be the same",
        variant: "destructive",
      });
      return;
    }

    const result = findShortestPath(sourceId, destinationId);
    if (result) {
      setRoute(result);
      toast({
        title: "Route Found!",
        description: `Distance: ${result.totalDistance}m • ${result.directions.length - 1} steps`,
      });
    } else {
      toast({
        title: "No Route Found",
        description: "Unable to find a path between these locations",
        variant: "destructive",
      });
    }
  }, [sourceId, destinationId, toast]);

  const handleSwapLocations = useCallback(() => {
    setSourceId(destinationId);
    setDestinationId(sourceId);
    setRoute(null);
  }, [sourceId, destinationId]);

  const handleLocationClick = useCallback((location: CampusLocation) => {
    if (!sourceId) {
      setSourceId(location.id);
      toast({
        title: "Source Set",
        description: `Starting from ${location.name}`,
      });
    } else if (!destinationId) {
      setDestinationId(location.id);
      toast({
        title: "Destination Set",
        description: `Going to ${location.name}`,
      });
    }
  }, [sourceId, destinationId, toast]);

  const handleQRScan = useCallback((locationId: string) => {
    setSourceId(locationId);
    setRoute(null);
  }, []);

  const handleClearRoute = useCallback(() => {
    setSourceId('');
    setDestinationId('');
    setRoute(null);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Navigation Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-4 md:p-6 mb-6 shadow-card"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Compass className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Find Your Way</h2>
              <p className="text-sm text-muted-foreground">Select locations or scan a QR code</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto] items-end">
            {/* Source */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapPinned className="w-4 h-4" />
                From (Source)
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <LocationSelector
                    value={sourceId}
                    onChange={(id) => { setSourceId(id); setRoute(null); }}
                    placeholder="Select starting point..."
                    icon="source"
                  />
                </div>
                <QRScanner onScan={handleQRScan} />
              </div>
            </div>

            {/* Swap Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapLocations}
              className="h-12 w-12 rounded-full border-border bg-card hover:bg-muted/50 hidden md:flex"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>

            {/* Destination */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Navigation2 className="w-4 h-4" />
                To (Destination)
              </label>
              <LocationSelector
                value={destinationId}
                onChange={(id) => { setDestinationId(id); setRoute(null); }}
                placeholder="Select destination..."
                icon="destination"
              />
            </div>

            {/* Calculate Button */}
            <Button
              onClick={handleCalculateRoute}
              className="h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-glow"
              disabled={!sourceId || !destinationId}
            >
              <Navigation2 className="w-4 h-4 mr-2" />
              Navigate
            </Button>
          </div>

          {/* Mobile Swap Button */}
          <div className="flex justify-center mt-4 md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSwapLocations}
              className="text-muted-foreground"
            >
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Swap Locations
            </Button>
          </div>

          {route && (
            <div className="mt-4 pt-4 border-t border-border flex justify-end">
              <Button variant="outline" size="sm" onClick={handleClearRoute}>
                Clear Route
              </Button>
            </div>
          )}
        </motion.div>

        {/* Map and Directions Grid */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Map */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <div className="bg-card rounded-xl border border-border p-2 shadow-card">
              <div className="h-[500px] lg:h-[600px]">
                <CampusMap
                  route={route}
                  sourceId={sourceId || null}
                  destinationId={destinationId || null}
                  onLocationClick={handleLocationClick}
                />
              </div>
            </div>
            
            {/* Legend */}
            <div className="mt-4">
              <LocationLegend />
            </div>
          </motion.div>

          {/* Directions Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="order-1 lg:order-2"
          >
            <DirectionsPanel
              route={route}
              sourceId={sourceId || null}
              destinationId={destinationId || null}
            />

            {/* Quick Tips */}
            <div className="mt-4 bg-muted/50 rounded-xl p-4 border border-border">
              <h4 className="font-medium text-foreground mb-2 text-sm">💡 Quick Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Scan a campus QR code to set your location</li>
                <li>• Click on any marker to select it</li>
                <li>• Route shows the shortest walking path</li>
                <li>• Walking time is estimated at 80m/min</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center py-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            🎓 CampusQR Navigation System • Priyadarshini College of Engineering, Nagpur
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Final Year Project • Information Technology Department
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
