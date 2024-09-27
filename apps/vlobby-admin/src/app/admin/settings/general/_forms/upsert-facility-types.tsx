"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, Loader2 } from "lucide-react";
import { useMutation } from "convex/react";
import { Trash2 } from "lucide-react";
import { z } from "zod";
import { useToast } from "@repo/ui/hooks/use-toast";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import useModalStore from "../../../../lib/global-state/modal-state";
import { Card } from "@repo/ui/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Button } from "@repo/ui/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@repo/ui/components/ui/alert-dialog";

/**
 * FacilityTypeUpsertForm Component
 *
 * This form component is used for creating and updating facility types.
 * It provides fields for the facility type name and description, and includes
 * functionality for submitting the form, showing success messages, and
 * deleting existing facility types.
 *
 * The form is divided into the following sections:
 * 1. Form Fields: Input fields for facility type name and description
 * 2. Submit Button: For creating or updating the facility type
 * 3. Delete Section: Only shown for existing facility types, allows deletion
 */

export const facilityTypeFormSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

export type FacilityTypeData = z.infer<typeof facilityTypeFormSchema>;

type Props = {
  selectedFacilityType?: FacilityTypeData;
};

const FacilityTypeUpsertForm = ({ selectedFacilityType }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Form initialization
  const form = useForm<FacilityTypeData>({
    resolver: zodResolver(facilityTypeFormSchema),
    defaultValues: selectedFacilityType ?? {
      name: "",
      description: "",
    },
  });

  // Mutation hooks
  const upsertFacilityType = useMutation(api.facilities.upsertFacilityType);
  const removeFacilityType = useMutation(api.facilities.removeFacilityType);

  // Form submission handler
  const onSubmit = async (data: FacilityTypeData) => {
    setIsLoading(true);

    try {
      // Submit form data to upsert endpoint
      const result = await upsertFacilityType({
        _id: selectedFacilityType?._id as Id<"facilityTypes">, // Pass the id if it exists
        name: data.name,
        description: data.description,
      });

      if (result) {
        toast({
          title: "Success",
          description: (
            <div className="flex items-center">
              <BadgeCheck className="mr-2 h-4 w-4 fill-primary text-white" />
              <div>
                {data.name} facility type
                {selectedFacilityType ? " updated" : " added"} successfully
              </div>
            </div>
          ),
        });
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save facility type. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = useModalStore((state) => state.closeModal);

  // Delete handler
  const handleDelete = async () => {
    if (selectedFacilityType?._id) {
      setIsLoading(true);
      try {
        await removeFacilityType({
          _id: selectedFacilityType._id as Id<"facilityTypes">,
        });
        toast({
          title: "Success",
          description: (
            <div className="flex items-center">
              <BadgeCheck className="mr-2 h-4 w-4 fill-primary text-white" />
              <div>
                {selectedFacilityType.name} facility type deleted successfully
              </div>
            </div>
          ),
        });
        form.reset();
        closeModal();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete facility type. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="h-full w-full overflow-scroll border-none p-1 shadow-none">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Facility Type Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facility Type Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter facility type name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Facility Type Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter facility type description"
                    className="resize-vertical"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {selectedFacilityType ? "Update" : "Create"} Facility Type
          </Button>
        </form>
      </Form>

      {/* Delete Section (only shown for existing facility types) */}
      {selectedFacilityType && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-sm  font-semibold text-foreground">
            Danger Zone
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Deleting a facility type is permanent and cannot be undone.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="mt-4 hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Facility Type
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  facility type and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </Card>
  );
};

export default FacilityTypeUpsertForm;
