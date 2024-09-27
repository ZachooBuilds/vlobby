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
 * KeyTypeUpsertForm Component
 *
 * This form component is used for creating and updating key types.
 * It provides fields for the key type name and description, and includes
 * functionality for submitting the form, showing success messages, and
 * deleting existing key types.
 *
 * The form is divided into the following sections:
 * 1. Form Fields: Input fields for key type name and description
 * 2. Submit Button: For creating or updating the key type
 * 3. Delete Section: Only shown for existing key types, allows deletion
 */

const keyTypeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

export type KeyTypeFormValues = z.infer<typeof keyTypeSchema>;

type Props = {
  selectedKeyType?: KeyTypeFormValues & { id?: Id<"keyTypes"> };
};

const KeyTypeUpsertForm = ({ selectedKeyType }: Props) => {
  console.log(selectedKeyType);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Form initialization
  const form = useForm<KeyTypeFormValues>({
    resolver: zodResolver(keyTypeSchema),
    defaultValues: selectedKeyType ?? {
      name: "",
      description: "",
    },
  });

  // Mutation hooks
  const upsertKeyType = useMutation(api.keys.upsertKeyType);
  const removeKeyType = useMutation(api.keys.removeKeyType);

  // Form submission handler
  const onSubmit = async (data: KeyTypeFormValues) => {
    setIsLoading(true);
    console.log(selectedKeyType);

    // Submit form data to upsert endpoint
    const result = await upsertKeyType({
      id: selectedKeyType?.id, // Pass the id if it exists
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
                {data.name} key type
                {selectedKeyType ? " updated" : " added"} successfully
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
    if (selectedKeyType?.id) {
      setIsLoading(true);
      await removeKeyType({ id: selectedKeyType.id });
      toast({
        title: "Success",
        description: (
          <div className="flex items-center">
            <BadgeCheck className="mr-2 h-4 w-4 fill-primary text-white" />
            <div>{selectedKeyType.name} key type deleted successfully</div>
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
          {/* Key Type Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Type Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter key type name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Key Type Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter key type description"
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
            {selectedKeyType ? "Update" : "Create"} Key Type
          </Button>
        </form>
      </Form>

      {/* Delete Section (only shown for existing key types) */}
      {selectedKeyType && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-sm  font-semibold text-foreground">
            Danger Zone
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Deleting a key type is permanent and cannot be undone.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="mt-4 hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Key Type
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  key type and remove it from our servers.
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

export default KeyTypeUpsertForm;
