"use client";
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
import { useState } from "react";

export const ticketTypeSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

export type TicketTypeFormValues = z.infer<typeof ticketTypeSchema>;

type Props = {
  selectedticketType?: TicketTypeFormValues;
};

export function UpsertTicketTypeForm({ selectedticketType }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const closeModal = useModalStore((state) => state.closeModal);

  const form = useForm<TicketTypeFormValues>({
    resolver: zodResolver(ticketTypeSchema),
    defaultValues: selectedticketType ?? {
      name: "",
      description: "",
    },
  });

  // Mutation hooks
  const upsertTicketType = useMutation(api.tickets.upsertTicketType);
  const removeTicketType = useMutation(api.tickets.removeTicketType);

  const onSubmit = async (data: TicketTypeFormValues) => {
    setIsLoading(true);

    // Submit form data to upsert endpoint
    const result = await upsertTicketType({
      id: selectedticketType?._id as Id<"ticketTypes">, // Pass the id if it exists
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
                {data.name} ticket type
                {selectedticketType ? " updated" : " added"} successfully
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
    if (selectedticketType?._id) {
      setIsLoading(true);
      await removeTicketType({
        id: selectedticketType._id as Id<"ticketTypes">,
      });
      toast({
        title: "Success",
        description: (
          <div className="flex items-center">
            <BadgeCheck className="mr-2 h-4 w-4 fill-primary text-white" />
            <div>
              {selectedticketType.name} ticket type deleted successfully
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
                  <Input placeholder="Enter ticket type name" {...field} />
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
                    placeholder="Enter ticket type description"
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
            {selectedticketType ? "Update" : "Create"} Ticket Type
          </Button>
        </form>
      </Form>

      {selectedticketType && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-sm font-semibold text-foreground">Danger Zone</h3>
          <p className="mt-2 text-sm text-gray-500">
            Deleting a ticket type is permanent and cannot be undone.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="mt-4 hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Ticket Type
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  ticket type and remove it from our servers.
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