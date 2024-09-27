"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { AttendeeFormData, attendeeFormSchema } from "./atendee-validation";
import { useMutation, useQuery } from "convex/react";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import useSheetStore from "../../../lib/global-state/sheet-state";
import { useToast } from "@repo/ui/hooks/use-toast";
import { api } from "@repo/backend/convex/_generated/api";
import { ValueLabelPair } from "../../../lib/app-data/app-types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Button } from "@repo/ui/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";

type AttendeeFormProps = {
  selectedAttendee?: AttendeeFormData | null;
  eventId: Id<"events">;
};

export default function AttendeeUpsertForm({
  selectedAttendee,
  eventId,
}: AttendeeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const closeSheet = useSheetStore((state) => state.closeSheet);
  const { toast } = useToast();

  const occupants = useQuery(
    api.occupants.getAllOccupantsValueLabelPair,
  ) as ValueLabelPair[];

  const upsertAttendeeMutation = useMutation(api.eventAttendees.upsertAttendee);
  const deleteAttendeeMutation = useMutation(api.eventAttendees.removeAttendee);

  const form = useForm<AttendeeFormData>({
    resolver: zodResolver(attendeeFormSchema),
    defaultValues: selectedAttendee ?? {
      isOccupant: true,
      numberOfAttendees: 1,
    },
  });

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteAttendeeMutation({
        id: selectedAttendee?._id as Id<"eventAttendees">,
        eventId,
      });
      toast({
        title: "Attendee Deleted",
        description: "The attendee has been successfully deleted.",
      });
      closeSheet();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to delete the attendee. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting attendee:", error);
    }
  };

  const onSubmit = async (data: AttendeeFormData) => {
    setIsLoading(true);

    try {
      const submissionData = data.isOccupant
        ? {
            isOccupant: true,
            occupantId: data.occupantId,
            numberOfAttendees: data.numberOfAttendees,
            notes: data.notes,
          }
        : {
            isOccupant: false,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            numberOfAttendees: data.numberOfAttendees,
            notes: data.notes,
          };

      await upsertAttendeeMutation({
        ...submissionData,
        _id: selectedAttendee?._id as Id<"eventAttendees">,
        eventId,
      });

      setIsLoading(false);
      toast({
        title: "Attendee Saved",
        description: "The attendee has been successfully saved.",
      });
      form.reset();
      if (selectedAttendee) {
        closeSheet();
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save the attendee. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving attendee:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="isOccupant"
          render={({ field }) => (
            <FormItem>
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant={field.value ? "default" : "outline"}
                  onClick={() => field.onChange(true)}
                >
                  Occupant
                </Button>
                <Button
                  type="button"
                  variant={!field.value ? "default" : "outline"}
                  onClick={() => field.onChange(false)}
                >
                  Other
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("isOccupant") ? (
          <FormField
            control={form.control}
            name="occupantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Occupant</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an occupant" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {occupants?.map((occupant) => (
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
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email address"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="numberOfAttendees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Attendees</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter number of attendees"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
              </FormControl>
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
                <Textarea
                  placeholder="Enter any additional notes"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {selectedAttendee ? "Update Attendee" : "Add Attendee"}
        </Button>

        {selectedAttendee && (
          <div className="mt-8 rounded-md border border-destructive/20 p-4 transition-all duration-300 ease-in-out hover:border-destructive">
            <h3 className="text-lg font-semibold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting this attendee is irreversible. Please proceed with
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
              Delete Attendee
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
