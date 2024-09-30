"use client";

/**
 * @file StorageUpsertForm Component
 * @description This component provides a form for adding or updating storage information.
 * It uses react-hook-form for form handling and Zod for validation.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";
import { StorageFormData, storageFormSchema } from "./storage-validation";
import { useMutation, useQuery } from "convex/react";
import useSheetStore from "../../../lib/global-state/sheet-state";
import { useToast } from "@repo/ui/hooks/use-toast";
import { api } from "@repo/backend/convex/_generated/api";
import { ValueLabelPair } from "../../../lib/app-data/app-types";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { Button } from "@repo/ui/components/ui/button";


/**
 * @interface StorageFormProps
 * @description Defines the props for the StorageUpsertForm component
 */
type StorageFormProps = {
  selectedStorage?: StorageFormData | null;
};

/**
 * @function StorageUpsertForm
 * @description The main component for adding or updating storage information
 * @param {StorageFormProps} props - The component props
 * @returns {JSX.Element} The rendered StorageUpsertForm component
 */
export default function StorageUpsertForm({
  selectedStorage,
}: StorageFormProps) {
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
  const getSpaces = useQuery(
    api.spaces.getAllSpaceValueLabelPairs,
  ) as ValueLabelPair[];
  // ---------------------------------------------------- //

  // -------------- BACKEND MUTATIONS -------------- //
  /**
   * @constant upsertStorageMutation
   * @description Mutation for adding or updating a storage item
   */
  const upsertStorageMutation = useMutation(api.storageSpaces.upsertStorage);

  const deleteStorageMutation = useMutation(api.storageSpaces.remove);
  // ---------------------------------------------------- //

  /**
   * @constant form
   * @description Initializes the form with react-hook-form and Zod validation
   */
  const form = useForm<StorageFormData>({
    resolver: zodResolver(storageFormSchema),
    defaultValues: selectedStorage ?? {
      type: "",
      name: "",
      description: "",
      spaceId: "",
      status: "",
      notes: "",
    },
  });

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteStorageMutation({
        id: selectedStorage?._id as Id<"storage">,
      });
      toast({
        title: "Storage Item Deleted",
        description: "The storage item has been successfully deleted.",
      });
      closeSheet();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to delete the storage item. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting storage item:", error);
    }
  };

  /**
   * @function onSubmit
   * @description Handles form submission
   * @param {StorageFormData} data - The form data to be submitted
   */
  const onSubmit = async (data: StorageFormData) => {
    setIsLoading(true);

    try {
      await upsertStorageMutation({
        ...data,
        spaceId: data.spaceId ? (data.spaceId as Id<"spaces">) : undefined,
        _id: selectedStorage?._id as Id<"storage">,
      });

      setIsLoading(false);
      toast({
        title: "Storage Item Saved",
        description: "The storage item has been successfully saved.",
      });
      form.reset();
      if (selectedStorage) {
        closeSheet();
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save the storage item. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving storage item:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input placeholder="Enter storage type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter storage name" {...field} />
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
                  placeholder="Enter storage description"
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
          name="spaceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Space (Optional) </FormLabel>
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
                  {getSpaces?.map((space) => (
                    <SelectItem key={space.value} value={space.value}>
                      {space.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the space who owns this storage area
              </FormDescription>
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="owned">Owned</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
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
          {selectedStorage ? "Update Storage Item" : "Add Storage Item"}
        </Button>

        {selectedStorage && (
          <div className="mt-8 rounded-md border border-destructive/20 p-4 transition-all duration-300 ease-in-out hover:border-destructive">
            <h3 className="text-lg font-semibold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting this storage item is irreversible. Please proceed with
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
              Delete Storage Item
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
