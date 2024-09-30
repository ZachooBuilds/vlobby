
"use client";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { parkTypeSchema, ParkType } from "./park-type-validation";
import { useMutation } from "convex/react";
import useSheetStore from "../../../lib/global-state/sheet-state";
import { useToast } from "@repo/ui/hooks/use-toast";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Button } from "@repo/ui/components/ui/button";

type ParkTypeFormProps = {
  selectedParkType?: ParkType;
};

export default function UpsertParkTypeForm({
  selectedParkType,
}: ParkTypeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const closeSheet = useSheetStore((state) => state.closeSheet);
  const { toast } = useToast();

  const upsertParkTypeMutation = useMutation(api.parkTypes.upsertParkType);
  const deleteParkTypeMutation = useMutation(api.parkTypes.remove);

  const form = useForm<ParkType>({
    resolver: zodResolver(parkTypeSchema),
    defaultValues: selectedParkType ?? {
      name: "",
      description: "",
      pricingConditions: [
        {
          startMinutes: 0,
          endMinutes: null,
          interval: 60,
          rate: 0,
          isFinalCondition: false,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pricingConditions",
  });

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteParkTypeMutation({
        id: selectedParkType?._id as Id<"parkTypes">,
      });
      toast({
        title: "Park Type Deleted",
        description: "The park type has been successfully deleted.",
      });
      closeSheet();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to delete the park type. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting park type:", error);
    }
  };

  const onSubmit = async (data: ParkType) => {
    setIsLoading(true);

    try {
      await upsertParkTypeMutation({
        ...data,
        _id: selectedParkType?._id as Id<"parkTypes">,
      });

      setIsLoading(false);
      toast({
        title: "Park Type Saved",
        description: "The park type has been successfully saved.",
      });
      form.reset();
      if (selectedParkType) {
        closeSheet();
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save the park type. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving park type:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter park type name" {...field} />
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
                <Input placeholder="Enter park type description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <h3 className="mb-2 font-semibold">Pricing Conditions</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="mb-4 rounded-md border p-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`pricingConditions.${index}.startMinutes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Minutes</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`pricingConditions.${index}.endMinutes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Minutes</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseInt(e.target.value) : null,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`pricingConditions.${index}.interval`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interval (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`pricingConditions.${index}.rate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name={`pricingConditions.${index}.isFinalCondition`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Final Condition</FormLabel>
                      <FormDescription>
                        Check if this is the final pricing condition
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(index)}
                className="mt-2"
              >
                <X className="mr-2 h-4 w-4" /> Remove Condition
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                startMinutes: 0,
                endMinutes: null,
                interval: 60,
                rate: 0,
                isFinalCondition: false,
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" /> Add Pricing Condition
          </Button>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {selectedParkType ? "Update Park Type" : "Add Park Type"}
        </Button>

        {selectedParkType && (
          <div className="mt-8 rounded-md border border-destructive/20 p-4 transition-all duration-300 ease-in-out hover:border-destructive">
            <h3 className="text-lg font-semibold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting this park type is irreversible. Please proceed with
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
              Delete Park Type
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
