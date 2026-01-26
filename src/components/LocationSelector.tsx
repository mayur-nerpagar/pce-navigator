import { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, MapPin, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { campusLocations, categoryLabels, CampusLocation } from '@/data/campusLocations';

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: 'source' | 'destination';
}

export function LocationSelector({ value, onChange, placeholder, icon }: LocationSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedLocation = useMemo(() => 
    campusLocations.find(loc => loc.id === value),
    [value]
  );

  const groupedLocations = useMemo(() => {
    const groups: Record<CampusLocation['category'], CampusLocation[]> = {
      gate: [],
      academic: [],
      amenity: [],
      recreation: [],
      religious: [],
      admin: [],
    };
    
    campusLocations.forEach(loc => {
      groups[loc.category].push(loc);
    });
    
    return groups;
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12 bg-card border-border hover:bg-muted/50 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-1.5 rounded-full",
              icon === 'source' ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
            )}>
              {icon === 'source' ? (
                <MapPin className="h-4 w-4" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
            </div>
            <span className={cn(
              "truncate",
              !selectedLocation && "text-muted-foreground"
            )}>
              {selectedLocation?.name || placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search locations..." className="h-11" />
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            {Object.entries(groupedLocations).map(([category, locations]) => 
              locations.length > 0 && (
                <CommandGroup 
                  key={category} 
                  heading={categoryLabels[category as CampusLocation['category']]}
                >
                  {locations.map((location) => (
                    <CommandItem
                      key={location.id}
                      value={location.name}
                      onSelect={() => {
                        onChange(location.id);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === location.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span>{location.name}</span>
                        {location.description && (
                          <span className="text-xs text-muted-foreground truncate max-w-[240px]">
                            {location.description}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
