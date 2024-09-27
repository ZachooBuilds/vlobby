"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, Loader2 } from "lucide-react";
import { useMutation } from "convex/react";
import { Trash2 } from "lucide-react";
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
import { z } from "zod";

/**
 * SpaceTypeUpsertForm Component
 *
 * This form component is used for creating and updating space types.
 * It provides fields for the space type name and description, and includes
 * functionality for submitting the form, showing success messages, and
 * deleting existing space types.
 *
 * The form is divided into the following sections:
 * 1. Form Fields: Input fields for space type name and description
 * 2. Submit Button: For creating or updating the space type
 * 3. Delete Section: Only shown for existing space types, allows deletion
 */

export const spaceTypeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

export type SpaceTypeFormValues = z.infer<typeof spaceTypeSchema>;

type Props = {
  selectedSpaceType?: SpaceTypeFormValues & { id?: Id<"spaceTypes"> };
};

const SpaceTypeUpsertForm = ({ selectedSpaceType }: Props) => {
  console.log(selectedSpaceType);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Form initialization
  const form = useForm<SpaceTypeFormValues>({
    resolver: zodResolver(spaceTypeSchema),
    defaultValues: selectedSpaceType ?? {
      name: "",
      description: "",
    },
  });

  // Mutation hooks
  const upsertSpaceType = useMutation(api.spaces.upsertSpaceType);
  const removeSpaceType = useMutation(api.spaces.removeSpaceType);

  // Form submission handler
  const onSubmit = async (data: SpaceTypeFormValues) => {
    setIsLoading(true);
    console.log(selectedSpaceType);

    // Submit form data to upsert endpoint
    const result = await upsertSpaceType({
      id: selectedSpaceType?.id, // Pass the id if it exists
      name: data.name,
      description: data.description,
    });

    if (result) {
      setTimeout(() => {
        // Show success toast
        toast({
          title: "Success",
          description: (
            <div className="flex items-center">
              <BadgeCheck className="mr-2 h-4 w-4 fill-primary text-white" />
              <div>
                {data.name} space type
                {selectedSpaceType ? " updated" : " added"} successfully
              </div>
            </div>
          ),
        });
        setIsLoading(false);
        form.reset();
      }, 200);
    }
  };

  const closeModal = useModalStore((state) => state.closeModal);

  // Delete handler
  const handleDelete = async () => {
    if (selectedSpaceType?.id) {
      setIsLoading(true);
      await removeSpaceType({ id: selectedSpaceType.id });
      toast({
        title: "Success",
        description: (
          <div className="flex items-center">
            <BadgeCheck className="mr-2 h-4 w-4 fill-primary text-white" />
            <div>{selectedSpaceType.name} space type deleted successfully</div>
          </div>
        ),
      });
      setIsLoading(false);
      form.reset();
      closeModal();
    }
  };

  return (
    <Card className="h-full w-full overflow-scroll border-none p-1 shadow-none">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Space Type Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Space Type Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter space type name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Space Type Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter space type description"
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
            {selectedSpaceType ? "Update" : "Create"} Space Type
          </Button>
        </form>
      </Form>

      {/* Delete Section (only shown for existing space types) */}
      {selectedSpaceType && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-sm  font-semibold text-foreground">
            Danger Zone
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Deleting a space type is permanent and cannot be undone.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="mt-4 hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Space Type
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  space type and remove it from our servers.
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

export default SpaceTypeUpsertForm;
