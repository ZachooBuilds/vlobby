'use client';
import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { Button } from '@repo/ui/components/ui/button';
import { CarIconPath } from '../../../../../public/svg/icons';
import { Search, ChevronsUpDown } from 'lucide-react';
import { useQuery } from 'convex/react';
import { ValueLabelPair } from '../../../../lib/app-types';
import { api } from '@repo/backend/convex/_generated/api';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/ui/components/ui/command';
import { Check } from 'lucide-react';
import { cn } from '@repo/ui/lib/utils';
import { useRouter } from 'next/navigation';

export default function VehicleSearch() {
  const [selectedVehicle, setSelectedVehicle] = useState<ValueLabelPair | null>(
    null
  );

  const getVehicles = useQuery(api.vehicles.getAllVehicleValueLabelPair, {
    isDropoff: false,
  }) as ValueLabelPair[];

  const router = useRouter();

  const handleSearch = () => {
    console.log(selectedVehicle);
    if (selectedVehicle) {
      router.push(`/parking/map?vehicleId=${selectedVehicle.value}`);
    } else {
      console.error('No active parking log found for the selected vehicle');
    }
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-5 h-5 fill-foreground">
            <CarIconPath />
          </div>
          Find Vehicle
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                'w-full justify-between h-14s',
                !selectedVehicle && 'text-muted-foreground'
              )}
            >
              {selectedVehicle ? selectedVehicle.label : 'Select vehicle'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full">
            <Command className="w-full">
              <CommandInput placeholder="Search vehicles..." />
              <CommandList className="w-full">
                <CommandEmpty>No Vehicles Found</CommandEmpty>
                <CommandGroup>
                  {getVehicles?.map((vehicle) => (
                    <CommandItem
                      value={vehicle.label}
                      key={vehicle.value}
                      onSelect={() => {
                        setSelectedVehicle(vehicle);
                      }}
                      className="w-full"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          vehicle.value === selectedVehicle?.value
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {vehicle.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button
          onClick={handleSearch}
          className="flex items-center gap-2 w-full"
        >
          <Search className="w-4 h-4" />
          Search
        </Button>
      </CardContent>
    </Card>
  );
}
