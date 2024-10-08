'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { dropoffSchema, DropoffRequest } from './request-validation';
import { useMutation, useQuery } from 'convex/react';

import { ParkType } from './park-type-validation';
import { Badge } from '@tremor/react';

import CarParkMap from '../_components/parkingMapLoader';

import { useToast } from '@repo/ui/hooks/use-toast';
import { api } from '@repo/backend/convex/_generated/api';
import {
  AllocationDetails,
  ValueLabelPair,
} from '../../../lib/app-data/app-types';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Button } from '@repo/ui/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover';
import { cn } from '@repo/ui/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/ui/components/ui/command';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { FileUploadWithPreview } from '../../_components/custom-form-fields/file-upload-form-field';
import useSheetStore from '../../../lib/global-state/sheet-state';

export default function NewDropoffRequestForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { closeSheet } = useSheetStore();

  const upsertRequestMutation = useMutation(api.requests.upsertRequest);

  const getVehicles = useQuery(api.vehicles.getAllVehicleValueLabelPair, {
    isDropoff: true,
  }) as ValueLabelPair[];

  const form = useForm<DropoffRequest>({
    resolver: zodResolver(dropoffSchema),
    defaultValues: {
      requestType: 'dropoff:vehicle',
      vehicleId: '',
      allocationId: '',
      evidenceImages: [],
      parkId: '',
    },
  });

  const vehicleId = form.watch('vehicleId');
  const getAllocations = useQuery(
    api.allocations.getAllocationsForVehicle,
    vehicleId ? { vehicleId: vehicleId as Id<'vehicles'> } : 'skip'
  ) as AllocationDetails[];

  const getParkTypes = useQuery(api.parkTypes.getAll) as ParkType[];

  console.log('allocations:', getAllocations);

  // Debug statements for getting allocation data
  useEffect(() => {
    console.log('Vehicle ID:', vehicleId);
    console.log('Raw Allocations Data:', getAllocations);
  }, [vehicleId, getAllocations]);

  // Add this effect to handle the logic
  useEffect(() => {
    const allocationId = form.watch('allocationId');
    const isCasualParking = form.watch('isCasualParking');

    if (allocationId) {
      form.setValue('isCasualParking', false);
    }

    if (isCasualParking) {
      form.setValue('allocationId', '');
    }
  }, [form.watch('allocationId'), form.watch('isCasualParking')]);

  // const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);

  const onSubmit = async (data: DropoffRequest) => {
    setIsLoading(true);
    console.log('Form Data:', data);
    try {
      const result = await upsertRequestMutation({
        _id: data._id as Id<'requests'>,
        requestType: 'dropoff:vehicle',
        vehicleId: data.vehicleId,
        allocationId: data.allocationId,
        evidenceImages: data.evidenceImages,
        parkId: selectedSpotId!, // Use the selected spot ID
        parkTypeId: data.parkTypeId,
      });
      console.log('Mutation Result:', result);
      setIsLoading(false);
      toast({
        title: 'Request Saved',
        description: 'The request has been successfully saved.',
      });
      form.reset();
      closeSheet();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to save the request. Please try again.',
        variant: 'destructive',
      });
      console.error('Error saving request:', error);
    }
  };
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);

  function handleSpotSelect(spotId: string | null) {
    setSelectedSpotId(spotId);
    form.setValue('parkId', spotId ?? '');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="vehicleId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Vehicle</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-full justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? getVehicles?.find(
                            (vehicle) => vehicle.value === field.value
                          )?.label
                        : 'Select vehicle'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[50vw]">
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
                              form.setValue('vehicleId', vehicle.value);
                              console.log('Selected Vehicle:', vehicle);
                            }}
                            className="w-full"
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                vehicle.value === field.value
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
              <FormDescription>
                Select the vehicle that is being picked up.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allocationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allocation</FormLabel>
              <FormControl>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {getAllocations?.map((allocation) => (
                    <Card
                      key={allocation._id}
                      className={cn(
                        'cursor-pointer hover:bg-accent',
                        allocation._id === field.value
                          ? 'border-primary'
                          : 'border-border'
                      )}
                      onClick={() => {
                        form.setValue('allocationId', allocation._id ?? '');
                        form.setValue('isCasualParking', false);
                        console.log('Selected Allocation:', allocation);
                      }}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{allocation.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {allocation.parkTypeName}
                        </p>
                        <p className="text-sm">
                          Parks: {allocation.allocatedParks}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </FormControl>
              <FormDescription>
                Select the allocation for this dropoff request.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isCasualParking"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parking Type</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-4">
                  <Card
                    className={cn(
                      'cursor-pointer hover:bg-accent',
                      !field.value ? 'border-primary' : 'border-border'
                    )}
                    onClick={() => {
                      field.onChange(false);
                      // No need to clear allocationId here as it's handled in the effect
                    }}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold">Allocated Parking</h3>
                      <p className="text-sm text-muted-foreground">
                        Use pre-allocated parking space
                      </p>
                    </CardContent>
                  </Card>
                  <Card
                    className={cn(
                      'cursor-pointer hover:bg-accent',
                      field.value ? 'border-primary' : 'border-border'
                    )}
                    onClick={() => {
                      field.onChange(true);
                      form.setValue('allocationId', undefined);
                    }}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold">Casual Parking</h3>
                      <p className="text-sm text-muted-foreground">
                        Use casual parking option
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </FormControl>
              <FormDescription>
                Select the type of parking for this request
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('isCasualParking') && (
          <FormField
            control={form.control}
            name="parkTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Park Type</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {getParkTypes?.map((parkType) => (
                      <Card
                        key={parkType._id}
                        className={cn(
                          'cursor-pointer hover:bg-accent',
                          parkType._id === field.value
                            ? 'border-primary'
                            : 'border-border'
                        )}
                        onClick={() => {
                          form.setValue('parkTypeId', parkType._id ?? '');
                          console.log('Selected Park Type:', parkType);
                        }}
                      >
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{parkType.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {parkType.description}
                          </p>
                          <p className="mb-2 text-sm">Pricing Conditions:</p>
                          <div className="flex flex-wrap gap-2">
                            {parkType.pricingConditions.map(
                              (condition, index) => (
                                <Badge key={index} size="xs">
                                  <span className="font-semibold">
                                    {condition.endMinutes
                                      ? `${condition.startMinutes}-${condition.endMinutes} minutes`
                                      : `${condition.startMinutes}+ minutes`}
                                  </span>
                                  <span className="mx-1">:</span>
                                  <span>
                                    ${condition.rate.toFixed(2)} every{' '}
                                    {condition.interval} minutes
                                  </span>
                                </Badge>
                              )
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </FormControl>
                <FormDescription>
                  Select the park type for this casual parking request.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="parkId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parking Spot</FormLabel>
              <FormControl>
                <CarParkMap
                  onSpotSelect={handleSpotSelect}
                  isSelecting={true}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full">
          <FileUploadWithPreview
            name="evidenceImages"
            label="Evidence Images (Max 20)"
            multiple={true}
            maxFiles={20}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Add Request
        </Button>
      </form>
    </Form>
  );
}
