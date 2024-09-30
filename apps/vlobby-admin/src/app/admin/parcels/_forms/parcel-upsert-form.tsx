'use client';

/**
 * @file ParcelUpsertForm Component
 * @description This component provides a form for adding or updating parcel information.
 * It uses react-hook-form for form handling and Zod for validation.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Loader2 } from 'lucide-react';
import { ParcelFormData, parcelFormSchema } from './parcel-validation';
import { useMutation, useQuery } from 'convex/react';
import useSheetStore from '../../../lib/global-state/sheet-state';
import { useToast } from '@repo/ui/hooks/use-toast';
import { ValueLabelPair } from '../../../lib/app-data/app-types';
import { api } from '@repo/backend/convex/_generated/api';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { Input } from '@repo/ui/components/ui/input';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { Button } from '@repo/ui/components/ui/button';

/**
 * @interface ParcelFormProps
 * @description Defines the props for the ParcelUpsertForm component
 */
type ParcelFormProps = {
  selectedParcel?: ParcelFormData | null;
};

/**
 * @function ParcelUpsertForm
 * @description The main component for adding or updating parcel information
 * @param {ParcelFormProps} props - The component props
 * @returns {JSX.Element} The rendered ParcelUpsertForm component
 */
export default function ParcelUpsertForm({ selectedParcel }: ParcelFormProps) {
  // -------------- STATE & GENERAL CONFIG -------------- //
  const [isLoading, setIsLoading] = useState(false);
  const closeSheet = useSheetStore((state) => state.closeSheet);
  const { toast } = useToast();
  // ---------------------------------------------------- //

  // -------------- BACKEND QUERIES -------------- //
  /**
   * @constant spaceOptions
   * @description Fetches all spaces as value-label pairs for the space dropdown
   */
  const spaceOptions = useQuery(
    api.spaces.getAllSpaceValueLabelPairs
  ) as ValueLabelPair[];

  /**
   * @constant occupantOptions
   * @description Fetches all occupants as value-label pairs for the occupant dropdown
   */
  const occupantOptions = useQuery(
    api.occupants.getAllOccupantsValueLabelPair
  ) as ValueLabelPair[];

  /**
   * @constant parcelTypeOptions
   * @description Fetches all parcel types as value-label pairs for the parcel type dropdown
   */
  const parcelTypeOptions: ValueLabelPair[] = [
    { value: 'mail', label: 'Mail' },
    { value: 'package', label: 'Package' },
    { value: 'food_delivery', label: 'Food Delivery' },
    { value: 'other', label: 'Other' },
  ];
  // ---------------------------------------------------- //

  // -------------- BACKEND MUTATIONS -------------- //
  /**
   * @constant upsertParcelMutation
   * @description Mutation for adding or updating a parcel
   */
  const upsertParcelMutation = useMutation(api.parcels.upsertParcel);

  const deleteParcelMutation = useMutation(api.parcels.remove);
  // ---------------------------------------------------- //

  /**
   * @constant form
   * @description Initializes the form with react-hook-form and Zod validation
   */
  const form = useForm<ParcelFormData>({
    resolver: zodResolver(parcelFormSchema),
    defaultValues: selectedParcel ?? {
      spaceId: '',
      occupantId: '',
      parcelTypeId: '',
      numPackages: 1,
      description: '',
      location: '',
      isCollected: false,
    },
  });

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteParcelMutation({
        id: selectedParcel?._id as Id<'parcels'>,
      });
      toast({
        title: 'Parcel Deleted',
        description: 'The parcel has been successfully deleted.',
      });
      closeSheet();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to delete the parcel. Please try again.',
        variant: 'destructive',
      });
      console.error('Error deleting parcel:', error);
    }
  };

  const handleMarkAsCollected = async () => {
    setIsLoading(true);
    try {
      const formValues = form.getValues();
      await upsertParcelMutation({
        _id: selectedParcel?._id as Id<'parcels'>,
        spaceId: formValues.spaceId,
        occupantId: formValues.occupantId,
        parcelTypeId: formValues.parcelTypeId,
        numPackages: formValues.numPackages,
        description: formValues.description,
        location: formValues.location,
        isCollected: true,
      });
      toast({
        title: 'Parcel Collected',
        description: 'The parcel has been marked as collected.',
      });
      closeSheet();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description:
          'Failed to mark the parcel as collected. Please try again.',
        variant: 'destructive',
      });
      console.error('Error marking parcel as collected:', error);
    }
  };

  /**
   * @function onSubmit
   * @description Handles form submission
   * @param {ParcelFormData} data - The form data to be submitted
   */
  const onSubmit = async (data: ParcelFormData) => {
    setIsLoading(true);

    try {
      await upsertParcelMutation({
        ...data,
        _id: selectedParcel?._id as Id<'parcels'>,
        isCollected: false,
      });

      setIsLoading(false);
      toast({
        title: 'Parcel Saved',
        description: 'The parcel has been successfully saved.',
      });
      form.reset();
      if (selectedParcel) {
        closeSheet();
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to save the parcel. Please try again.',
        variant: 'destructive',
      });
      console.error('Error saving parcel:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="spaceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Space</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select space" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {spaceOptions?.map((space) => (
                    <SelectItem key={space.value} value={space.value}>
                      {space.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="occupantId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Occupant</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select occupant" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {occupantOptions?.map((occupant) => (
                    <SelectItem key={occupant.value} value={occupant.value}>
                      {occupant.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="parcelTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parcel Type</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select key type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {parcelTypeOptions?.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numPackages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Packages</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any additional description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter parcel location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {selectedParcel ? 'Update Parcel' : 'Add Parcel'}
        </Button>

        {selectedParcel && (
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={handleMarkAsCollected}
              disabled={isLoading || form.getValues().isCollected}
              className="ml-2"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Mark as Collected
            </Button>

            <div className="mt-8 rounded-md border border-destructive/20 p-4 transition-all duration-300 ease-in-out hover:border-destructive">
              <h3 className="text-lg font-semibold">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">
                Deleting this parcel is irreversible. Please proceed with
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
                Delete Parcel
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
