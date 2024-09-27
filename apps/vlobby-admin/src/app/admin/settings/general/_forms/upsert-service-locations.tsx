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

export const serviceLocationSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Location name is required"),
  description: z.string().min(1, "Description is required"),
});

export type ServiceLocationFormValues = z.infer<typeof serviceLocationSchema>;

type Props = {
  selectedServiceLocation?: ServiceLocationFormValues;
};

export function UpsertServiceLocationForm({ selectedServiceLocation }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const closeModal = useModalStore((state) => state.closeModal);

  const form = useForm<ServiceLocationFormValues>({
    resolver: zodResolver(serviceLocationSchema),
    defaultValues: selectedServiceLocation ?? {
      name: "",
      description: "",
    },
  });

  const upsertServiceLocation = useMutation(api.tickets.upsertTicketLocation);
  const removeServiceLocation = useMutation(api.tickets.removeTicketLocation);

  const onSubmit = async (data: ServiceLocationFormValues) => {
    setIsLoading(true);

    const result = await upsertServiceLocation({
      id: selectedServiceLocation?._id as Id<"ticketLocations">,
      name: data.name,
      description: data.description,
    });

    if (result) {
      setTimeout(() => {
        toast({
          title: "Success",
          description: (
            <div className="flex items-center">
              <BadgeCheck className="mr-2 h-4 w-4 fill-primary text-white" />
              <div>
                {data.name} service location
                {selectedServiceLocation ? " updated" : " added"} successfully
              </div>
            </div>
          ),
        });
        setIsLoading(false);
        form.reset();
      }, 200);
    }
  };

  const handleDelete = async () => {
    if (selectedServiceLocation?._id) {
      setIsLoading(true);
      await removeServiceLocation({
        id: selectedServiceLocation._id as Id<"ticketLocations">,
      });
      toast({
        title: "Success",
        description: (
          <div className="flex items-center">
            <BadgeCheck className="mr-2 h-4 w-4 fill-primary text-white" />
            <div>
              {selectedServiceLocation.name} service location deleted
              successfully
            </div>
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter service location name" {...field} />
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
                    placeholder="Enter service location description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {selectedServiceLocation ? "Update" : "Create"} Service Location
          </Button>
        </form>
      </Form>

      {selectedServiceLocation && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-sm font-semibold text-foreground">Danger Zone</h3>
          <p className="mt-2 text-sm text-gray-500">
            Deleting a service location is permanent and cannot be undone.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="mt-4 hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Service Location
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  service location and remove it from our servers.
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

export default UpsertServiceLocationForm;
