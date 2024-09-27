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

const offerCategorySchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Description is required"),
});

export type OfferCategoryFormValues = z.infer<typeof offerCategorySchema>;
// Define props for the component
type Props = {
  selectedOfferCategory?: OfferCategoryFormValues;
};

// Main component function
export function UpsertOfferCategoryForm({ selectedOfferCategory }: Props) {
  // State and hooks
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const closeModal = useModalStore((state) => state.closeModal);

  // Initialize form with react-hook-form and zod resolver
  const form = useForm<OfferCategoryFormValues>({
    resolver: zodResolver(offerCategorySchema),
    defaultValues: selectedOfferCategory ?? {
      name: "",
      description: "",
    },
  });

  // Mutation hooks for Convex API
  const upsertOfferCategory = useMutation(api.offers.upsertOfferCategory);
  const removeOfferCategory = useMutation(api.offers.removeOfferCategory);

  // Form submission handler
  const onSubmit = async (data: OfferCategoryFormValues) => {
    setIsLoading(true);

    // Submit form data to upsert endpoint
    const result = await upsertOfferCategory({
      id: selectedOfferCategory?._id as Id<"offerCategories">, // Pass the id if it exists
      name: data.name,
      description: data.description,
    });

    if (result) {
      // Show success toast after a short delay
      setTimeout(() => {
        toast({
          title: "Success",
          description: (
            <div className="flex items-center">
              <BadgeCheck className="mr-2 h-4 w-4 fill-primary text-white" />
              <div>
                {data.name} offer category
                {selectedOfferCategory ? " updated" : " added"} successfully
              </div>
            </div>
          ),
        });
        setIsLoading(false);
        form.reset();
      }, 200);
    }
  };

  // Delete handler for existing offer categories
  const handleDelete = async () => {
    if (selectedOfferCategory?._id) {
      setIsLoading(true);
      await removeOfferCategory({
        id: selectedOfferCategory._id as Id<"offerCategories">,
      });
      toast({
        title: "Success",
        description: (
          <div className="flex items-center">
            <BadgeCheck className="mr-2 h-4 w-4 fill-primary text-white" />
            <div>
              {selectedOfferCategory.name} offer category deleted successfully
            </div>
          </div>
        ),
      });
      setIsLoading(false);
      form.reset();
      closeModal();
    }
  };

  // Render the form
  return (
    <Card className="h-full w-full overflow-scroll border-none p-1 shadow-none">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter offer category name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Description field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter offer category description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit button */}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {selectedOfferCategory ? "Update" : "Create"} Offer Category
          </Button>
        </form>
      </Form>

      {/* Delete section (only shown for existing offer categories) */}
      {selectedOfferCategory && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-sm font-semibold text-foreground">Danger Zone</h3>
          <p className="mt-2 text-sm text-gray-500">
            Deleting an offer category is permanent and cannot be undone.
          </p>
          {/* Alert dialog for delete confirmation */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="mt-4 hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Offer Category
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  offer category and remove it from our servers.
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
}

export default UpsertOfferCategoryForm;
