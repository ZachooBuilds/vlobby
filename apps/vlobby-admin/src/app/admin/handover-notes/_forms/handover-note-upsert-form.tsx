"use client";

/**
 * @file HandoverNoteUpsertForm Component
 * @description This component provides a form for adding or updating handover note information.
 * It uses react-hook-form for form handling and Zod for validation.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import {
  HandoverNoteFormData,
  handoverNoteFormSchema,
} from "./handover-note-validation";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import useSheetStore from "../../../lib/global-state/sheet-state";
import { useToast } from "@repo/ui/hooks/use-toast";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/ui/popover";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { Calendar } from "@repo/ui/components/ui/calendar";

/**
 * @interface HandoverNoteFormProps
 * @description Defines the props for the HandoverNoteUpsertForm component
 */
type HandoverNoteFormProps = {
  selectedHandoverNote?: HandoverNoteFormData | null;
};

/**
 * @function HandoverNoteUpsertForm
 * @description The main component for adding or updating handover note information
 * @param {HandoverNoteFormProps} props - The component props
 * @returns {JSX.Element} The rendered HandoverNoteUpsertForm component
 */
export default function HandoverNoteUpsertForm({
  selectedHandoverNote,
}: HandoverNoteFormProps) {
  // -------------- STATE & GENERAL CONFIG -------------- //
  const [isLoading, setIsLoading] = useState(false);
  const closeSheet = useSheetStore((state) => state.closeSheet);
  const { toast } = useToast();
  // ---------------------------------------------------- //

  // -------------- BACKEND MUTATIONS -------------- //
  /**
   * @constant upsertHandoverNoteMutation
   * @description Mutation for adding or updating a handover note
   */
  const upsertHandoverNoteMutation = useMutation(
    api.handoverNotes.upsertHandoverNote,
  );

  const deleteHandoverNoteMutation = useMutation(api.handoverNotes.remove);
  // ---------------------------------------------------- //

  /**
   * @constant form
   * @description Initializes the form with react-hook-form and Zod validation
   */
  const form = useForm<HandoverNoteFormData>({
    resolver: zodResolver(handoverNoteFormSchema),
    defaultValues: selectedHandoverNote ?? {
      priority: "",
      title: "",
      description: "",
      followupDate: new Date(),
      isClosed: false,
    },
  });

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteHandoverNoteMutation({
        id: selectedHandoverNote?._id as Id<"handoverNotes">,
      });
      toast({
        title: "Handover Note Deleted",
        description: "The handover note has been successfully deleted.",
      });
      closeSheet();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to delete the handover note. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting handover note:", error);
    }
  };

  /**
   * @function onSubmit
   * @description Handles form submission
   * @param {HandoverNoteFormData} data - The form data to be submitted
   */
  const onSubmit = async (data: HandoverNoteFormData) => {
    setIsLoading(true);

    try {
      await upsertHandoverNoteMutation({
        ...data,
        _id: selectedHandoverNote?._id as Id<"handoverNotes">,
        followupDate: data.followupDate.toISOString(),
      });

      setIsLoading(false);
      toast({
        title: "Handover Note Saved",
        description: "The handover note has been successfully saved.",
      });
      form.reset();
      if (selectedHandoverNote) {
        closeSheet();
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save the handover note. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving handover note:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
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
                  placeholder="Enter description"
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
          name="followupDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Follow-up Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isClosed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Mark as Closed</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {selectedHandoverNote ? "Update Handover Note" : "Add Handover Note"}
        </Button>

        {selectedHandoverNote && (
          <div className="mt-8 rounded-md border border-destructive/20 p-4 transition-all duration-300 ease-in-out hover:border-destructive">
            <h3 className="text-lg font-semibold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting this handover note is irreversible. Please proceed with
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
              Delete Handover Note
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
