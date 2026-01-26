import { MapPin, Navigation, GraduationCap, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onAboutClick?: () => void;
}

export function Header({ onAboutClick }: HeaderProps) {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-primary shadow-lg relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent rounded-full translate-x-1/4 translate-y-1/4" />
      </div>
      
      <div className="container mx-auto px-4 py-4 relative">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-accent rounded-xl shadow-glow">
              <Navigation className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-primary-foreground">
                CampusQR Navigator
              </h1>
              <p className="text-sm text-primary-foreground/70 hidden sm:block">
                Priyadarshini College of Engineering, Nagpur
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="hidden md:flex items-center gap-6 text-primary-foreground/80">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">21 Locations</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span className="text-sm">Smart Navigation</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
