'use client';
import { useState, useEffect } from 'react';
import { useAction } from 'convex/react';
import { Loader2, Car } from 'lucide-react';
import { useToast } from '@repo/ui/hooks/use-toast';
import { api } from '@repo/backend/convex/_generated/api';
import { Input } from '@repo/ui/components/ui/input';
import { Button } from '@repo/ui/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { VehicleRegistrationData } from '../../../lib/app-types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@repo/ui/components/ui/card';
import { Badge } from '@repo/ui/components/ui/badge';
import useDrawerStore from '../../../lib/global-state';

const lookupSchema = z.object({
  plateNumber: z.string().min(1, 'Plate number is required'),
});

type LookupFormData = z.infer<typeof lookupSchema>;

export default function VehicleLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleData, setVehicleData] =
    useState<VehicleRegistrationData | null>(null);
  const { toast } = useToast();
  const fetchCarJamDetails = useAction(api.vehicles.fetchCarJamDetails);
  const { closeDrawer, openDrawer } = useDrawerStore();

  const form = useForm<LookupFormData>({
    resolver: zodResolver(lookupSchema),
    defaultValues: {
      plateNumber: '',
    },
  });

  useEffect(() => {
    if (vehicleData) {
      closeDrawer();
      setTimeout(() => {
        openDrawer(
          'Vehicle Found',
          'Vehicle details have been fetched successfully.',
          <VehicleSummaryCard vehicle={vehicleData} />
        );
      }, 100);
    }
  }, [vehicleData, closeDrawer, openDrawer]);

  const handlePlateSearch = async (data: LookupFormData) => {
    setIsLoading(true);
    const result = await fetchCarJamDetails({ plate: data.plateNumber });
    setIsLoading(false);

    if (result.success && result.data) {
      const fetchedVehicleData = result.data as VehicleRegistrationData;
      setVehicleData(fetchedVehicleData);
      console.log('Vehicle Data:', fetchedVehicleData);
      toast({
        title: 'Vehicle Found',
        description: 'Vehicle details have been fetched successfully.',
      });
    } else {
      console.error('Error fetching CarJam details:', result.error);
      toast({
        title: 'Error',
        description: 'Failed to fetch vehicle details. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleClearSearch = () => {
    setVehicleData(null);
    form.reset();
    closeDrawer();
  };

  const VehicleSummaryCard = ({
    vehicle,
  }: {
    vehicle: VehicleRegistrationData;
  }) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Car className="mr-2 h-6 w-6" />
          Vehicle Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Make & Model
            </p>
            <p className="text-lg font-semibold">
              {vehicle.make} {vehicle.model}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Year</p>
            <p className="text-lg font-semibold">
              {vehicle.year_of_manufacture}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Plate</p>
            <Badge variant="secondary" className="text-lg">
              {vehicle.plate}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Color</p>
            <p className="text-lg font-semibold">{vehicle.main_colour}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">VIN</p>
          <p className="text-lg font-mono">{vehicle.vin}</p>
        </div>
        <Button onClick={handleClearSearch} className="mt-4">
          Back to Search
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handlePlateSearch)}
        className="space-y-6"
      >
        <div className="flex flex-col space-y-2">
          <FormField
            control={form.control}
            name="plateNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plate Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter plate number"
                    {...field}
                    className="text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Search
          </Button>
        </div>
      </form>
    </Form>
  );
}
