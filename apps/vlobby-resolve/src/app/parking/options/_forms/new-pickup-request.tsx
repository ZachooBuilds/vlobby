'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { pickupSchema, PickupRequest } from './request-validation';
import { useMutation, useQuery } from 'convex/react';
import { useToast } from '@repo/ui/hooks/use-toast';
import { api } from '@repo/backend/convex/_generated/api';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { Input } from '@repo/ui/components/ui/input';
import { ValueLabelPair } from '../../../../lib/app-types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { ParkIconPath } from '../../../../../public/svg/icons';
import { useRouter } from 'next/navigation';

export default function NewRequestForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const upsertRequestMutation = useMutation(api.requests.upsertRequest);
  const [selectedVehicle, setSelectedVehicle] = useState<ValueLabelPair | null>(
    null
  );

  const getVehicles = useQuery(api.vehicles.getAllVehicleValueLabelPair, {
    isDropoff: false,
  }) as ValueLabelPair[];

  const form = useForm<PickupRequest>({
    resolver: zodResolver(pickupSchema),
    defaultValues: {
      requestType: '',
      vehicleId: '',
      notes: '',
    },
  });

  const onSubmit = async (data: PickupRequest) => {
    setIsLoading(true);
    console.log(data);

    try {
      await upsertRequestMutation({
        _id: data._id as Id<'requests'>,
        requestType: data.requestType,
        vehicleId: data.vehicleId,
        notes: data.notes,
      });

      setIsLoading(false);
      toast({
        title: 'Request Saved',
        description: 'The request has been successfully saved.',
      });
      form.reset();
      router.push('/parking/requests');
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

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-row w-full gap-4">
          <div className="w-5 h-5 fill-foreground">
            <ParkIconPath />
          </div>
          <CardTitle>Collect Vehicle</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <FormField
              control={form.control}
              name="requestType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full h-14">
                        <SelectValue placeholder="Pickup Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        value="pickup:item"
                        className="text-foreground h-14"
                      >
                        Item Request
                      </SelectItem>
                      <SelectItem
                        value="pickup:vehicle"
                        className="text-foreground h-14"
                      >
                        Vehicle Request
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the pickup type</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicleId"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Vehicle</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-full justify-between h-14',
                          !selectedVehicle && 'text-muted-foreground'
                        )}
                      >
                        {selectedVehicle
                          ? selectedVehicle.label
                          : 'Select vehicle'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full!">
                      <Command className="w-full">
                        <CommandInput
                          placeholder="Search vehicles..."
                          className="h-14 text-base w-full"
                        />
                        <CommandList className="w-full">
                          <CommandEmpty>No Vehicles Found</CommandEmpty>
                          <CommandGroup>
                            {getVehicles?.map((vehicle) => (
                              <CommandItem
                                value={vehicle.label}
                                key={vehicle.value}
                                onSelect={() => {
                                  form.setValue('vehicleId', vehicle.value);
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
                  <FormDescription>
                    Select the vehicle that is being picked up.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input
                      className="h-14"
                      placeholder="Enter any additional notes"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-white"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Add Request
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
