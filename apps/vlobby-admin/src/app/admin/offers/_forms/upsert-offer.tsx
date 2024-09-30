"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { useQuery } from "convex/react";
import { OfferCategory } from "../../settings/general/_tables/offer-categories-table";
import { z } from "zod";
import { useMutation } from "convex/react";
import { useToast } from "@repo/ui/hooks/use-toast";
import { api } from "@repo/backend/convex/_generated/api";
import useSheetStore from "../../../lib/global-state/sheet-state";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { ColorPicker } from "../../_components/custom-form-fields/color-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { FileUploadWithPreview } from "../../_components/custom-form-fields/file-upload-form-field";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/ui/popover";
import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/ui/button";
import { Calendar } from "@repo/ui/components/ui/calendar";
import { TimePicker } from "@repo/ui/components/custom-form-fields/time-picker/time-picker";
/**
 * @constant offerSchema
 * @description Zod schema for validating offer form data
 */
export const offerSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Type is required"),
  offerDescription: z.string().min(1, "Offer description is required"),
  colour: z.string().min(1, "Colour is required"),
  files: z
    .array(
      z.object({
        url: z.string().url(),
        storageId: z.string(),
      }),
    )
    .min(1, "A cover image is required"),
  startDate: z.date({
    required_error: "Start date is required",
    invalid_type_error: "That's not a valid date!",
  }),
  endDate: z.date({
    required_error: "End date is required",
    invalid_type_error: "That's not a valid date!",
  }),
});

export type OfferFormValues = z.infer<typeof offerSchema>;

/**
 * @interface Props
 * @description Defines the structure of props for the OfferUpsertForm component
 * @property {OfferFormValues} selectedOffer - Optional. The offer data to be edited, if any
 */
type Props = {
  selectedOffer?: OfferFormValues;
};

/**
 * @function OfferUpsertForm
 * @description A form component for creating or updating offers
 * @param {Props} props - The component props
 * @returns {JSX.Element} The rendered form
 */
const OfferUpsertForm = ({ selectedOffer }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Convert start and end dates to Date objects if selectedOffer is provided
  const initialOffer = selectedOffer
    ? {
        ...selectedOffer,
        startDate: new Date(selectedOffer.startDate),
        endDate: new Date(selectedOffer.endDate),
      }
    : undefined;

  // Fetch offer categories from the API
  const offerCategories = useQuery(
    api.offers.getAllOfferCategories,
  ) as OfferCategory[];

  console.log(offerCategories);

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: initialOffer ?? {
      title: "",
      type: "",
      offerDescription: "",
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  // Mutation for upserting an offer
  const upsertOfferMutation = useMutation(api.offers.upsertOffer);

  // Function to close the sheet (from global state)
  const closeSheet = useSheetStore((state) => state.closeSheet);

  /**
   * @function onSubmit
   * @description Handles form submission
   * @param {OfferFormValues} data - The form data
   */
  const onSubmit = async (data: OfferFormValues) => {
    console.log("Form submitted", data);
    setIsLoading(true);

    try {
      const result = await upsertOfferMutation({
        id: selectedOffer?._id as Id<"offers">,
        title: data.title,
        type: data.type,
        offerDescription: data.offerDescription,
        colour: data.colour,
        files: data.files,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
      });

      setIsLoading(false);
      toast({
        title: "Offer Saved",
        description: "The offer has been successfully saved.",
      });
      form.reset();
      if (selectedOffer) {
        closeSheet();
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save the offer. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving offer:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Offer Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter offer title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Offer Color Picker */}
          <ColorPicker name="colour" label="Offer Color" />

          {/* Offer Type Selector */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Offer Type</FormLabel>
                {offerCategories ? (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const selectedType = offerCategories.find(
                        (type) => type._id === value,
                      );
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select offer type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {offerCategories.map((type) => (
                        <SelectItem key={type._id} value={type._id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Skeleton className="h-10 w-full" />
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Offer Description Field */}
        <FormField
          control={form.control}
          name="offerDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer Details</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter offer details"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Offer Image Upload */}
        <div className="flex w-full">
          <FileUploadWithPreview
            name="files"
            label="Offer Image"
            multiple={false}
            maxFiles={1}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Start Date Picker */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
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
                          format(field.value, "PPP HH:mm:ss")
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
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                    <div className="border-t border-border p-3">
                      <TimePicker setDate={field.onChange} date={field.value} />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Date Picker */}
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
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
                          format(field.value, "PPP HH:mm:ss")
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
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                    <div className="border-t border-border p-3">
                      <TimePicker setDate={field.onChange} date={field.value} />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default OfferUpsertForm;
