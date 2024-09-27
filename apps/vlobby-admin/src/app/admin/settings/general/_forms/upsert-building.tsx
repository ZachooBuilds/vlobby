"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { BadgeCheck, Loader2, Plus, Trash, Trash2 } from "lucide-react";
import { useMutation } from "convex/react";
import { z } from "zod";
import { useToast } from "@repo/ui/hooks/use-toast";
import useModalStore from "../../../../lib/global-state/modal-state";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Card } from "@repo/ui/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Button } from "@repo/ui/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@repo/ui/components/ui/alert-dialog";

const upsertBuildingFromSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(3, "Please create a meaningful name"),
  floors: z.number().min(1, "Floors must be at least 1").optional(),
  namedFloors: z
    .array(
      z.object({
        index: z.number().min(-100, "No way your that deep dude!"),
        name: z.string().min(1, "Floor name is required"),
      }),
    )
    .optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
});

export type BuildingFormValues = z.infer<typeof upsertBuildingFromSchema>;

type Props = {
  selectedBuildingDetails?: BuildingFormValues;
};

export function UpsertSiteForm({ selectedBuildingDetails }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const closeModal = useModalStore((state) => state.closeModal);

  const form = useForm<BuildingFormValues>({
    resolver: zodResolver(upsertBuildingFromSchema),
    defaultValues: selectedBuildingDetails,
  });

  const upsertBuilding = useMutation(api.site.upsertSite);
  const removeBuilding = useMutation(api.site.removeSite);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "namedFloors",
  });

  const onSubmit = async (data: BuildingFormValues) => {
    setIsLoading(true);

    const result = await upsertBuilding({
      id: selectedBuildingDetails?._id as Id<"sites">,
      name: data.name,
      description: data.description,
      floors: data.floors,
      namedFloors: data.namedFloors,
    });

    if (result) {
      setTimeout(() => {
        toast({
          title: "Success",
          description: (
            <div className="flex items-center">
              <BadgeCheck className="mr-2 h-4 w-4 fill-primary text-white" />
              <div>
                {data.name}
                {selectedBuildingDetails ? " updated" : " added"} successfully
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
    if (selectedBuildingDetails?._id) {
      setIsLoading(true);
      await removeBuilding({
        id: selectedBuildingDetails._id as Id<"sites">,
      });
      toast({
        title: "Success",
        description: (
          <div className="flex items-center">
            <BadgeCheck className="mr-2 h-4 w-4 fill-primary text-white" />
            <div>
              {selectedBuildingDetails.name} site deleted successfully
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
                <FormLabel>Site Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter site name" {...field} />
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
                    placeholder="Enter a description"
                    className="resize-vertical"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="floors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Floors</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter number of floors"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full flex-col items-start justify-start gap-2">
            <p className="text-sm font-medium">Named Floors</p>
            <p className="text-xs text-muted-foreground">
              Add the floors in your building and give them names for easy
              reference.
            </p>
          </div>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-row items-end justify-start gap-2"
            >
              <FormField
                control={form.control}
                name={`namedFloors.${index}.index`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    {index === 0 && <FormLabel>Floor Number</FormLabel>}
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter floor number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`namedFloors.${index}.name`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    {index === 0 && <FormLabel>Floor Name</FormLabel>}
                    <FormControl>
                      <Input placeholder="Enter floor name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ index: 0, name: "" })}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Named Floor
          </Button>

          {/* Submit button */}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {selectedBuildingDetails ? "Update" : "Create"} Building
          </Button>
        </form>
      </Form>

      {selectedBuildingDetails && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-sm font-semibold text-foreground">Danger Zone</h3>
          <p className="mt-2 text-sm text-gray-500">
            Deleting a building is permanent and cannot be undone.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="mt-4 hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Building
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  building and remove it from our servers.
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

export default UpsertSiteForm;
