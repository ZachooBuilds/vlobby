'use client';
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Loader2, Plus, X, Car, Users } from 'lucide-react';
import { VehicleSchema, Vehicle } from './add-vehicle-validation';
import { useMutation, useQuery } from 'convex/react';
import useDrawerStore from '../../../lib/global-state';
import { useToast } from '@repo/ui/hooks/use-toast';
import { api } from '@repo/backend/convex/_generated/api';
import { ValueLabelPair } from '../../../lib/app-types';
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
import { Input } from '@repo/ui/components/ui/input';
import { Button } from '@repo/ui/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';

type VehicleFormProps = {
  selectedVehicle?: Vehicle;
};

export default function AddVehicleForm({ selectedVehicle }: VehicleFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const closeDrawer = useDrawerStore((state) => state.closeDrawer);
  const { toast } = useToast();

  const upsertVehicleMutation = useMutation(api.vehicles.upsertVehicle);
  const deleteVehicleMutation = useMutation(api.vehicles.remove);

  const getSpaces = useQuery(
    api.spaces.getAllSpaceValueLabelPairs
  ) as ValueLabelPair[];
  const getOccupants = useQuery(
    api.occupants.getAllOccupantsValueLabelPair
  ) as ValueLabelPair[];

  const form = useForm<Vehicle>({
    resolver: zodResolver(VehicleSchema),
    defaultValues: selectedVehicle ?? {
      rego: '',
      make: '',
      model: '',
      color: '',
      year: '',
      type: '',
      image: [],
      availableTo: 'space',
      spaceId: '',
    },
  });

  const {
    fields: driverFields,
    append: appendDriverFields,
    remove: removeDriverFields,
  } = useFieldArray({
    control: form.control,
    name: 'drivers',
  });

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteVehicleMutation({
        id: selectedVehicle?._id as Id<'vehicles'>,
      });
      toast({
        title: 'Vehicle Deleted',
        description: 'The vehicle has been successfully deleted.',
      });
      closeDrawer();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to delete the vehicle. Please try again.',
        variant: 'destructive',
      });
      console.error('Error deleting vehicle:', error);
    }
  };

  const onSubmit = async (data: Vehicle) => {
    setIsLoading(true);

    try {
      await upsertVehicleMutation({
        ...data,
        _id: selectedVehicle?._id as Id<'vehicles'>,
      });

      setIsLoading(false);
      toast({
        title: 'Vehicle Saved',
        description: 'The vehicle has been successfully saved.',
      });
      form.reset();

      closeDrawer();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to save the vehicle. Please try again.',
        variant: 'destructive',
      });
      console.error('Error saving vehicle:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="rego"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registration Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter registration number"
                  {...field}
                  className="text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Make</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter vehicle make"
                    {...field}
                    className="text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter vehicle model"
                    {...field}
                    className="text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter vehicle color"
                    {...field}
                    className="text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter vehicle year"
                    {...field}
                    className="text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Type</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter vehicle type"
                  {...field}
                  className="text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="availableTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available To</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder="Select availability"
                      className="text-base"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="space">
                    <Car className="mr-2 h-4 w-4 inline-block text-base" />
                    Available to entire space
                  </SelectItem>
                  <SelectItem value="specific">
                    <Users className="mr-2 h-4 w-4 inline-block text-base" />
                    Available to specific drivers
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose whether this vehicle is available to the entire space or
                specific drivers
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('availableTo') === 'space' && (
          <FormField
            control={form.control}
            name="spaceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Space</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Select space"
                        className="text-base"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getSpaces?.map((space) => (
                      <SelectItem
                        key={space.value}
                        value={space.value}
                        className="text-base"
                      >
                        {space.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  You can assign vehicles to a space to make it available to all
                  members of that space
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {form.watch('availableTo') === 'specific' && (
          <>
            {/* Dynamic Driver Fields */}
            {driverFields.map((field, index) => (
              <div key={field.id} className="flex flex-row items-end gap-2">
                <FormField
                  control={form.control}
                  name={`drivers.${index}.id`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder="Select driver"
                              className="text-base"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getOccupants?.map((driver) => (
                            <SelectItem
                              key={driver.value}
                              value={driver.value}
                              className="text-base"
                            >
                              {driver.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeDriverFields(index)}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            {/* Add Driver Button */}
            <Button
              type="button"
              className="w-full border border-dashed border-primary bg-[#F6F5FF] text-primary hover:text-white"
              onClick={() => appendDriverFields({ id: '' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add another driver
            </Button>
          </>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {selectedVehicle ? 'Update Vehicle' : 'Add Vehicle'}
        </Button>

        {selectedVehicle && (
          <div className="mt-8 rounded-md border border-destructive/20 p-4 transition-all duration-300 ease-in-out hover:border-destructive">
            <h3 className="text-lg font-semibold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting this vehicle is irreversible. Please proceed with
              caution.
            </p>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
              className="mt-4"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete Vehicle
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
