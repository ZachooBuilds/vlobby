"use client";

/**
 * @file EventUpsertForm Component
 * @description This component provides a form for adding or updating event information.
 * It uses react-hook-form for form handling and Zod for validation.
 */

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { Loader2, CalendarIcon, Trash, Plus } from "lucide-react";
import { format } from "date-fns";

import { EventFormData, eventFormSchema } from "./event-validation";
import { useMutation, useQuery } from "convex/react";
import useSheetStore from "../../../lib/global-state/sheet-state";
import { useToast } from "@repo/ui/hooks/use-toast";
import { api } from "@repo/backend/convex/_generated/api";
import { ValueLabelPair } from "../../../lib/app-data/app-types";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Card } from "@repo/ui/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/ui/popover";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { Calendar } from "@repo/ui/components/ui/calendar";
import { TimePicker } from "@repo/ui/components/custom-form-fields/time-picker/time-picker";
import Tiptap from "@repo/ui/components/custom-form-fields/rich-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import AudienceField from "../../_components/custom-form-fields/audience-form-field";
import { FileUploadWithPreview } from "../../_components/custom-form-fields/file-upload-form-field";
import { Switch } from "@repo/ui/components/ui/switch";



/**
 * @interface EventFormProps
 * @description Defines the props for the EventUpsertForm component
 */
type EventFormProps = {
  selectedEvent?: EventFormData | null;
  selectedDate?: Date | null;
};

/**
 * @function EventUpsertForm
 * @description The main component for adding or updating event information
 * @param {EventFormProps} props - The component props
 * @returns {JSX.Element} The rendered EventUpsertForm component
 */
export default function EventUpsertForm({
  selectedEvent,
  selectedDate,
}: EventFormProps) {
  // -------------- STATE & GENERAL CONFIG -------------- //
  const [isLoading, setIsLoading] = useState(false);
  const closeSheet = useSheetStore((state) => state.closeSheet);
  const { toast } = useToast();
  // ---------------------------------------------------- //

  // -------------- BACKEND QUERIES -------------- //
  // Add your backend queries here (e.g., fetching spaces, audience types, etc.)

  const facilityOptions = useQuery(
    api.facilities.getAllFacilityValueLabelPairs,
  ) as ValueLabelPair[];
  // ---------------------------------------------------- //

  // -------------- BACKEND MUTATIONS -------------- //
  /**
   * @constant upsertEventMutation
   * @description Mutation for adding or updating an event
   */
  const upsertEventMutation = useMutation(api.events.upsertEvent);

  const deleteEventMutation = useMutation(api.events.deleteEvent);
  // ---------------------------------------------------- //

  /**
   * @constant form
   * @description Initializes the form with react-hook-form and Zod validation
   */
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: selectedEvent ?? {
      title: "",
      startTime: selectedDate ?? new Date(),
      description: "",
      capacity: 1,
      audience: [],
      files: [],
      isPublicPlace: false,
      address: "",
      spaceId: "",
    },
  });

  const {
    fields: audienceFields,
    append: appendAudience,
    remove: removeAudience,
  } = useFieldArray({
    control: form.control,
    name: "audience",
  });

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteEventMutation({
        id: selectedEvent?._id as Id<"events">,
      });
      toast({
        title: "Event Deleted",
        description: "The event has been successfully deleted.",
      });
      closeSheet();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to delete the event. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting event:", error);
    }
  };

  /**
   * @function onSubmit
   * @description Handles form submission
   * @param {EventFormData} data - The form data to be submitted
   */
  const onSubmit = async (data: EventFormData) => {
    setIsLoading(true);

    // Map files to an array of storage IDs
    const mappedFiles = data.files?.map((file) => file.storageId) ?? [];

    try {
      await upsertEventMutation({
        ...data,
        files: mappedFiles,
        _id: selectedEvent?._id as Id<"events">,
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString(),
      });

      setIsLoading(false);
      toast({
        title: "Event Saved",
        description: "The event has been successfully saved.",
      });
      form.reset();
      if (selectedEvent) {
        closeSheet();
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save the event. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving event:", error);
    }
  };

  return (
    <Card className="h-full w-full overflow-scroll border-none p-1 shadow-none">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter event title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP HH:mm:ss")
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
                      <div className="border-t border-border p-3">
                        <TimePicker
                          setDate={field.onChange}
                          date={field.value}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP HH:mm:ss")
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
                      <div className="border-t border-border p-3">
                        <TimePicker
                          setDate={field.onChange}
                          date={field.value}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
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
                <FormLabel>Event Description</FormLabel>
                <FormControl>
                  <Tiptap
                    onChange={field.onChange}
                    initialContent={field.value}
                  />
                </FormControl>
                <FormMessage />
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

          {/* Offer Image Upload */}
          <div className="flex w-full">
            <FileUploadWithPreview
              name="files"
              label="Event Images (Max 20)"
              multiple={true}
              maxFiles={20}
            />
          </div>

          <FormField
            control={form.control}
            name="isPublicPlace"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm">
                    Meeting set in public place ?
                  </FormLabel>
                  <FormMessage />
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

          {form.watch("isPublicPlace") ? (
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="spaceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facility</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={facilityOptions?.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a space" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {facilityOptions?.map((facility) => (
                        <SelectItem key={facility.value} value={facility.value}>
                          {facility.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {selectedEvent ? "Update Event" : "Add Event"}
          </Button>

          {selectedEvent && (
            <div className="mt-8 rounded-md border border-destructive/20 p-4 transition-all duration-300 ease-in-out hover:border-destructive">
              <h3 className="text-lg font-semibold">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">
                Deleting this event is irreversible. Please proceed with
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
                Delete Event
              </Button>
            </div>
          )}
        </form>
      </Form>
    </Card>
  );
}
