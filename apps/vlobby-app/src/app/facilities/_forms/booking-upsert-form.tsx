'use client';

/**
 * @file BookingUpsertForm Component
 * @description This component provides a form for adding or updating booking information.
 * It uses react-hook-form for form handling and Zod for validation.
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { CalendarIcon, Loader2 } from 'lucide-react';
import { format, isSameDay } from 'date-fns';

import { BookingFormData, BookingFormSchema } from './booking-validation';
import { useQuery, useMutation } from 'convex/react';
import { useToast } from '@repo/ui/hooks/use-toast';
import { api } from '@repo/backend/convex/_generated/api';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import { Card } from '@repo/ui/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { cn } from '@repo/ui/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover';
import { Button } from '@repo/ui/components/ui/button';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { Calendar } from '@repo/ui/components/ui/calendar';
import {
  BookingFormDataWithNames,
  BookingType,
  FacilityOverview,
  ValueLabelPair,
} from '../../../lib/app-types';
import BookingSlots from '../../_components/booking-slots';
import { useAuth } from '@clerk/clerk-react';
import useDrawerStore from '../../../lib/global-state';

/**
 * @interface BookingUpsertFormProps
 * @description Defines the props for the BookingUpsertForm component
 */
interface BookingUpsertFormProps {
  selectedBooking?: BookingFormData;
  selectedFacility: FacilityOverview;
  selectedDate?: Date;
}

/**
 * @function BookingUpsertForm
 * @description The main component for adding or updating booking information
 * @param {BookingUpsertFormProps} props - The component props
 * @returns {JSX.Element} The rendered BookingUpsertForm component
 */
const BookingUpsertForm = (props: BookingUpsertFormProps) => {
  // -------------- STATE & GENERAL CONFIG -------------- //
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { closeDrawer } = useDrawerStore();
  // ---------------------------------------------------- //

  // -------------- FORM SETUP -------------- //
  /**
   * Initialize the form with react-hook-form and Zod validation
   * Set default values from props or initialize with empty values
   */
  const form = useForm<BookingFormData>({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: props.selectedBooking ?? {
      facilityId: props.selectedFacility?._id,
      date: props.selectedDate ?? new Date(),
      userId: useAuth().userId ?? '',
    },
  });
  // ---------------------------------------- //

  // -------------- BACKEND QUERIES -------------- //

  /**
   * Fetch booking types for the selected facility
   */
  const bookingTypes = useQuery(
    api.bookingTypes.getBookingTypesForFacilityForCurrentOccupant,
    {
      facilityId: props.selectedFacility._id as Id<'facilities'>,
    }
  ) as BookingType[];

  /**
   * Transform booking types into options for the select field
   */
  const bookingTypesOptions = bookingTypes?.map((bookingType) => ({
    value: bookingType._id,
    label: bookingType.name,
  })) as ValueLabelPair[];

  /**
   * Find the selected booking type based on the form value
   */
  const selectedBookingType = bookingTypes?.find(
    (bookingType) => bookingType._id === form.watch('bookingTypeId')
  );

  const selectedFormDate = form.watch('date');

  /**
   * Calculate the start time for the booking based on the selected date and booking type
   */
  const startTime = selectedBookingType?.startTime
    ? (() => {
        const startDate = new Date(selectedBookingType.startTime);
        return selectedFormDate
          ? new Date(
              selectedFormDate.getFullYear(),
              selectedFormDate.getMonth(),
              selectedFormDate.getDate(),
              startDate.getHours(),
              startDate.getMinutes()
            )
          : undefined;
      })()
    : undefined;

  /**
   * Calculate the end time for the booking based on the selected date and booking type
   */
  const endTime = selectedBookingType?.endTime
    ? (() => {
        const endDate = new Date(selectedBookingType.endTime);
        return selectedFormDate
          ? new Date(
              selectedFormDate.getFullYear(),
              selectedFormDate.getMonth(),
              selectedFormDate.getDate(),
              endDate.getHours(),
              endDate.getMinutes()
            )
          : undefined;
      })()
    : undefined;

  /**
   * Fetch existing bookings for the selected facility and date range
   */
  const rawFacilityBookings = useQuery(
    api.bookings.getBookingsForFacilityOnDate,
    form.watch('facilityId') && startTime && endTime
      ? {
          facilityId: form.watch('facilityId') as Id<'facilities'>,
          startDate: startTime.toISOString(),
          endDate: endTime.toISOString(),
          excludeBookingId: props.selectedBooking?._id as Id<'bookings'>,
        }
      : 'skip'
  ) as BookingFormDataWithNames[] | undefined;

  /**
   * Transform the fetched bookings, converting date strings to Date objects
   */
  const facilityBookings = rawFacilityBookings?.map((booking) => ({
    ...booking,
    startTime: new Date(booking.startTime),
    endTime: new Date(booking.endTime),
    date: new Date(booking.date),
  })) as BookingFormDataWithNames[];
  // ---------------------------------------------------- //

  // -------------- BACKEND MUTATIONS -------------- //
  /**
   * Initialize mutation for upserting (creating or updating) a booking
   */
  const upsertBookingMutation = useMutation(api.bookings.upsertBooking);

  const user = useQuery(api.occupants.getCurrentOccupant);

  /**
   * Initialize mutation for deleting a booking
   */
  const deleteBookingMutation = useMutation(api.bookings.deleteBooking);
  // ------------------------------------------------ //

  // -------------- FORM SUBMISSION HANDLER -------------- //
  /**
   * Handle form submission
   * @param {BookingFormData} values - The form values to be submitted
   */
  const onSubmit = async (values: BookingFormData) => {
    setIsLoading(true);
    try {
      const sortedSlots = values.slots.sort(
        (a, b) => a.slotIndex - b.slotIndex
      );
      const startTime = sortedSlots[0]!.slotTime.toISOString();
      const endTime =
        sortedSlots[sortedSlots.length - 1]!.slotTime.toISOString();

      await upsertBookingMutation({
        _id: values._id ? (values._id as Id<'bookings'>) : undefined,
        facilityId: values.facilityId as Id<'facilities'>,
        bookingTypeId: values.bookingTypeId as Id<'bookingTypes'>,
        notes: values.notes,
        userId: user?._id as Id<'users'>,
        date: values.date.toISOString(),
        slots: values.slots.map((slot) => ({
          slotIndex: slot.slotIndex,
          slotTime: slot.slotTime.toISOString(),
        })),
        startTime: startTime,
        endTime: endTime,
        status: selectedBookingType?.requiresApproval ? 'pending' : 'approved',
      });

      toast({
        title: 'Booking saved',
        description: 'Your booking has been successfully saved.',
      });
      closeDrawer();
    } catch (error) {
      console.error('Error saving booking:', error);
      toast({
        title: 'Error',
        description:
          'There was an error saving your booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  // ---------------------------------------------------- //

  // -------------- DELETE HANDLER -------------- //
  /**
   * Handle booking deletion
   */
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteBookingMutation({
        id: props.selectedBooking?._id as Id<'bookings'>,
      });
      toast({
        title: 'Booking deleted',
        description: 'The booking has been successfully deleted.',
      });
      closeDrawer();
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast({
        title: 'Error',
        description:
          'There was an error deleting the booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  // --------------------------------------------- //

  // -------------- RENDER FORM -------------- //
  return (
    <Card className="h-full w-full overflow-scroll border-none p-1 shadow-none">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
            {/* Booking Type Field */}
            <FormField
              control={form.control}
              name="bookingTypeId"
              render={({ field }) => (
                <FormItem className="text-base">
                  <FormLabel>Booking Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                    disabled={
                      !bookingTypesOptions || bookingTypesOptions.length === 0
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select booking type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bookingTypesOptions?.map((bookingType) => (
                        <SelectItem
                          key={bookingType.value}
                          value={bookingType.value}
                        >
                          {bookingType.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Field */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 text-base">
                  <FormLabel>Booking Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      {!form.watch('bookingTypeId') ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          Please select a booking type first
                        </div>
                      ) : (
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const dayOfWeek = format(date, 'EEEE');
                            const isAllowedDay =
                              selectedBookingType?.avalibleDays.some(
                                (day) => day.label === dayOfWeek
                              );

                            const isExceptionDate =
                              selectedBookingType!.exceptionDates.some(
                                (exception) =>
                                  isSameDay(new Date(exception.date), date)
                              );
                            return (
                              date <
                                new Date(new Date().setHours(0, 0, 0, 0)) ||
                              !isAllowedDay ||
                              isExceptionDate
                            );
                          }}
                          initialFocus
                        />
                      )}
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Booking Slots */}
          {form.watch('facilityId') &&
            form.watch('bookingTypeId') &&
            form.watch('date') && (
              <BookingSlots
                bookingSlots={
                  form.watch('bookingTypeId') ===
                  props.selectedBooking?.bookingTypeId
                    ? props.selectedBooking?.slots
                    : []
                }
                date={new Date(form.watch('date')) ?? new Date()}
                bookings={facilityBookings}
                startTime={selectedBookingType?.startTime ?? new Date()}
                endTime={selectedBookingType?.endTime ?? new Date()}
                interval={selectedBookingType?.interval ?? 30}
                maxSlots={selectedBookingType?.maxSlots ?? 2}
              />
            )}

          {/* Notes Field */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="text-base">
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter booking notes" {...field} />
                </FormControl>
                <FormDescription>
                  Provide any additional notes for the booking
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save Booking
          </Button>

          {/* Delete Section */}
          {props.selectedBooking && (
            <div className="mt-8 rounded-md border border-destructive/20 p-4 transition-all duration-300 ease-in-out hover:border-destructive">
              <h3 className="text-lg font-semibold ">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">
                Deleting this booking is irreversible. Please proceed with
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
                Delete Booking
              </Button>
            </div>
          )}
        </form>
      </Form>
    </Card>
  );
};

export default BookingUpsertForm;
