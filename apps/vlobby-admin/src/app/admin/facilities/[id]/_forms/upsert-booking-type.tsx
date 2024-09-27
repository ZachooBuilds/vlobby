import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2, Trash, Plus } from "lucide-react";
import { format } from "date-fns";
import { useMutation } from "convex/react";
import {
  BookingTypeFormData,
  bookingTypeSchema,
} from "./booking-type-validation";
import useSheetStore from "../../../../lib/global-state/sheet-state";
import { useToast } from "@repo/ui/hooks/use-toast";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Card } from "@repo/ui/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { TimePicker } from "@repo/ui/components/custom-form-fields/time-picker/time-picker";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { FancyMultiSelect } from "../../../_components/custom-form-fields/multi-select-field";
import { dayWeekOptions } from "../../../../lib/app-data/static-data";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/ui/popover";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { Calendar } from "@repo/ui/components/ui/calendar";
import { Switch } from "@repo/ui/components/ui/switch";
import AudienceField from "../../../_components/custom-form-fields/audience-form-field";

type UpsertBookingTypeFormProps = {
  buildingId: string;
  facilityId: string;
  selectedType?: BookingTypeFormData;
};

export default function UpsertBookingTypeForm({
  buildingId,
  facilityId,
  selectedType,
}: UpsertBookingTypeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const closeSheet = useSheetStore((state) => state.closeSheet);
  const { toast } = useToast();

  console.log("building ID in upsert type form :", buildingId);

  // Convert start and end times to Date objects if selectedType is provided
  const initialType = selectedType
    ? {
        ...selectedType,
        startTime: new Date(selectedType.startTime),
        endTime: new Date(selectedType.endTime),
        exceptionDates: selectedType.exceptionDates.map((exception) => ({
          ...exception,
          date: new Date(exception.date),
        })),
      }
    : undefined;

  const form = useForm<BookingTypeFormData>({
    resolver: zodResolver(bookingTypeSchema),
    defaultValues: initialType ?? {
      name: "",
      status: "status:active",
      interval: 0,
      maxSlots: 0,
      startTime: new Date(new Date().setHours(8, 0, 0, 0)),
      endTime: new Date(new Date().setHours(22, 0, 0, 0)),
      description: "",
      requiresApproval: false,
      autoProvisionAccess: false,
      audience: [{ type: "", entity: "" }],
      avalibleDays: [],
      exceptionDates: [],
    },
  });

  // ########### DYNAMIC FIELD MANAGEMENT ###########
  const {
    fields: excludedDatesFields,
    append: appendExcludedDates,
    remove: removeExcludedDates,
  } = useFieldArray({
    control: form.control,
    name: "exceptionDates",
  });

  const {
    fields: audienceFields,
    append: appendAudience,
    remove: removeAudience,
  } = useFieldArray({
    control: form.control,
    name: "audience",
  });

  //Get mutation to upsert booking type
  const upsertBookingType = useMutation(api.bookingTypes.upsertBookingType);
  const onSubmit = async (values: BookingTypeFormData) => {
    console.log("Form submitted", values);
    setIsLoading(true);

    try {
      const result = await upsertBookingType({
        _id: selectedType?._id as Id<"bookingTypes">,
        name: values.name,
        facilityId: facilityId as Id<"facilities">,
        status: values.status,
        startTime: values.startTime.toISOString(),
        endTime: values.endTime.toISOString(),
        interval: values.interval,
        maxSlots: values.maxSlots,
        description: values.description,
        audience: values.audience ?? [],
        avalibleDays: values.avalibleDays,
        exceptionDates: values.exceptionDates.map((date) => ({
          date: date.date.toISOString(),
          reason: date.reason,
        })),
        requiresApproval: values.requiresApproval,
        autoProvisionAccess: values.autoProvisionAccess,
      });

      setIsLoading(false);
      toast({
        title: "Booking Type Saved",
        description: "The booking type has been successfully saved.",
      });
      form.reset();
      // If editing, close the sheet or navigate away
      if (selectedType) {
        closeSheet();
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save the booking type. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving booking type:", error);
    }
  };

  const deleteBookingType = useMutation(api.bookingTypes.removeBookingType);

  const handleDelete = async () => {
    if (!selectedType?._id) return;

    setIsLoading(true);
    try {
      await deleteBookingType({ _id: selectedType._id as Id<"bookingTypes"> });
      setIsLoading(false);
      toast({
        title: "Booking Type Deleted",
        description: "The booking type has been successfully deleted.",
      });
      form.reset();
      closeSheet();
      // Navigate away or close the form
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to delete the booking type. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting booking type:", error);
    }
  };

  return (
    <Card className="h-full w-full overflow-scroll border-none p-1 shadow-none">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking Type Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter booking type name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="status:active">Active</SelectItem>
                      <SelectItem value="status:inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <TimePicker setDate={field.onChange} date={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <TimePicker setDate={field.onChange} date={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slot Interval (minutes)</FormLabel>
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
              name="maxSlots"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Slots Per Booking</FormLabel>
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
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="avalibleDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avalible Days</FormLabel>
                <FormControl>
                  <FancyMultiSelect
                    options={dayWeekOptions}
                    initialSelected={field.value}
                    onChange={field.onChange}
                    name={field.name}
                    placeholder="Select days bookings can be made..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full flex-col items-start justify-start gap-2">
            <p className="text-sm font-medium">Excluded Dates</p>
            <p className="text-xs text-muted-foreground">
              If there are dates that bookings cannot be made, you can exclude
              them here.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {excludedDatesFields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-row items-end justify-start gap-2"
              >
                <FormField
                  control={form.control}
                  name={`exceptionDates.${index}.date`}
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col">
                      {index == 0 && <FormLabel>Date</FormLabel>}
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                " justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP ")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`exceptionDates.${index}.reason`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      {index == 0 && <FormLabel>Reason</FormLabel>}
                      <FormControl>
                        <Input placeholder="Enter reason ..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  className="h-10 w-10 p-2"
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeExcludedDates(index)}
                >
                  <Trash className="h-5 w-5" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              className="w-full border border-dashed border-primary bg-[#F6F5FF] text-primary hover:text-white"
              onClick={() =>
                appendExcludedDates({ date: new Date(), reason: "" })
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Add Date
            </Button>
          </div>

          <FormField
            control={form.control}
            name="requiresApproval"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Requires Approval</FormLabel>
                  <FormDescription>
                    Does an admin need to approve this booking before it is
                    confirmed ?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="autoProvisionAccess"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Auto Provision Access
                  </FormLabel>
                  <FormDescription>
                    Automatically provision access for confirmed bookings
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex w-full flex-col items-start justify-start gap-2">
            <p className="text-sm font-medium">Audience</p>
            <p className="text-xs text-muted-foreground">
              Set the audience for this booking type here you can add multiple
              different audiences to control who will be able to book using this
              type
            </p>
          </div>
          {audienceFields.map((field, index) => (
            <div key={field.id} className="flex flex-row items-end gap-2">
              <AudienceField index={index} />
              <Button
                type="button"
                variant="ghost"
                onClick={() => removeAudience(index)}
              >
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            className="w-full border border-dashed border-primary bg-[#F6F5FF] text-primary hover:text-white"
            onClick={() => appendAudience({ type: "", entity: "" })}
          >
            <Plus className="mr-2 h-4 w-4" /> Add another audience group
          </Button>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save Booking Type
          </Button>

          {selectedType && (
            <div className="mt-8 rounded-md border border-destructive/20 p-4 transition-all duration-300 ease-in-out hover:border-destructive">
              <h3 className="text-lg font-semibold ">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">
                Deleting this booking type is irreversible. Please proceed with
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
                Delete Booking Type
              </Button>
            </div>
          )}
        </form>
      </Form>
    </Card>
  );
}
