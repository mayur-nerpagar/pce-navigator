import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { campusLocations } from '@/data/campusLocations';
import { useToast } from '@/hooks/use-toast';

interface QRScannerProps {
  onScan: (locationId: string) => void;
}

export function QRScanner({ onScan }: QRScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && !isScanning) {
      setTimeout(() => {
        const scanner = new Html5QrcodeScanner(
          'qr-reader',
          { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
          },
          false
        );

        scanner.render(
          (decodedText) => {
            // Check if the scanned QR code matches a location
            const location = campusLocations.find(
              loc => loc.id === decodedText || loc.name.toLowerCase() === decodedText.toLowerCase()
            );

            if (location) {
              onScan(location.id);
              toast({
                title: "Location Scanned!",
                description: `You're at ${location.name}`,
              });
              scanner.clear();
              setIsOpen(false);
            } else {
              toast({
                title: "Unknown QR Code",
                description: "This QR code doesn't match any campus location",
                variant: "destructive",
              });
            }
          },
          (error) => {
            // Ignore scanning errors (happens continuously while scanning)
            console.log(error);
          }
        );

        scannerRef.current = scanner;
        setIsScanning(true);
      }, 100);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
        setIsScanning(false);
      }
    };
  }, [isOpen, onScan, toast]);

  const handleClose = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
    setIsScanning(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
      else setIsOpen(true);
    }}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-12 w-12 border-border bg-card hover:bg-muted/50"
        >
          <QrCode className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-accent" />
            Scan Campus QR Code
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Point your camera at a campus QR code to set your current location
          </p>
          <div 
            id="qr-reader" 
            className="w-full rounded-lg overflow-hidden bg-muted"
          />
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
