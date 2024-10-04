"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { AttendeeFormData, attendeeFormSchema } from "./atendee-validation";
import { useMutation, useQuery } from "convex/react";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import useDrawerStore from "../../../lib/global-state";
import { useToast } from "@repo/ui/hooks/use-toast";
import { api } from "@repo/backend/convex/_generated/api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Button } from "@repo/ui/components/ui/button";
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
  const closeDrawer = useDrawerStore((state) => state.closeDrawer);
  const { toast } = useToast();

  const upsertAttendeeMutation = useMutation(api.eventAttendees.upsertAttendee);
  const deleteAttendeeMutation = useMutation(api.eventAttendees.removeAttendee);

  const currentOccupant = useQuery(api.occupants.getCurrentOccupant);

  const form = useForm<AttendeeFormData>({
    resolver: zodResolver(attendeeFormSchema),
    defaultValues: selectedAttendee ?? {
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
      closeDrawer();
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
      await upsertAttendeeMutation({
        ...data,
        isOccupant: true,
        occupantId: currentOccupant?._id as Id<'occupants'>,
        _id: selectedAttendee?._id as Id<'eventAttendees'>,
        eventId,
      });

      setIsLoading(false);
      toast({
        title: "Attendee Saved",
        description: "The attendee has been successfully saved.",
      });
      form.reset();
      if (selectedAttendee) {
        closeDrawer();
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
          name="numberOfAttendees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Attendees</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter number of attendees"
                  type="number"
                  className="text-base"
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
                  className="resize-none text-base"
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
              Cancelling your attendence will remove you from the event.
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
              I cant attend 
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
