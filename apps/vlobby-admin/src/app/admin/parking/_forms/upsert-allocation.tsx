"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { AllocationSchema, Allocation } from "./allocation-validation";
import { useMutation, useQuery } from "convex/react";
import { useToast } from '@repo/ui/hooks/use-toast';
import { api } from '@repo/backend/convex/_generated/api';
import { ValueLabelPair } from '../../../lib/app-data/app-types';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Button } from '@repo/ui/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { Input } from '@repo/ui/components/ui/input';
import useSheetStore from "../../../lib/global-state/sheet-state";


type AllocationFormProps = {
  selectedAllocation?: Allocation;
};

export default function UpsertAllocationForm({
  selectedAllocation,
}: AllocationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const closeSheet = useSheetStore((state) => state.closeSheet);
  const { toast } = useToast();

  const upsertAllocationMutation = useMutation(
    api.allocations.upsertAllocation,
  );
  const deleteAllocationMutation = useMutation(api.allocations.remove);

  const getSpaces = useQuery(
    api.spaces.getAllSpaceValueLabelPairs,
  ) as ValueLabelPair[];
  const getParkTypes = useQuery(api.parkTypes.getAllParkTypesValueLabelPair) as ValueLabelPair[];

  const form = useForm<Allocation>({
    resolver: zodResolver(AllocationSchema),
    defaultValues: selectedAllocation ?? {
      name: "",
      description: "",
      allocatedParks: 1,
      spaceId: "",
      rentedSpaceId: "",
    },
  });

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteAllocationMutation({
        id: selectedAllocation?._id as Id<"allocations">,
      });
      toast({
        title: "Allocation Deleted",
        description: "The allocation has been successfully deleted.",
      });
      closeSheet();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to delete the allocation. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting allocation:", error);
    }
  };

  const onSubmit = async (data: Allocation) => {
    setIsLoading(true);
    console.log(data);

    try {
      await upsertAllocationMutation({
        _id: selectedAllocation?._id as Id<"allocations">,
        name: data.name,
        description: data.description,
        allocatedParks: data.allocatedParks,
        spaceId: data.spaceId,
        rentedSpaceId: data.rentedSpaceId,
        parkTypeId: data.parkTypeId as Id<"parkTypes">,
      });

      setIsLoading(false);
      toast({
        title: "Allocation Saved",
        description: "The allocation has been successfully saved.",
      });
      form.reset();
      if (selectedAllocation) {
        closeSheet();
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save the allocation. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving allocation:", error);
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
                <Input placeholder="Enter allocation name" {...field} />
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
                <Input placeholder="Enter allocation description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allocatedParks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allocated Parks</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of allocated parks"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="parkTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Park Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select park type for this allocation" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getParkTypes?.map((parkType) => (
                    <SelectItem key={parkType.value} value={parkType.value}>
                      {parkType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the park type this allocation is associated with
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="spaceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Space</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select space for this allocation" />
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
                Select the space this allocation is associated with
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rentedSpaceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rented Space</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rented space (optional)" />
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
                Optionally select a rented space for this allocation
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {selectedAllocation ? "Update Allocation" : "Add Allocation"}
        </Button>

        {selectedAllocation && (
          <div className="mt-8 rounded-md border border-destructive/20 p-4 transition-all duration-300 ease-in-out hover:border-destructive">
            <h3 className="text-lg font-semibold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting this allocation is irreversible. Please proceed with
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
              Delete Allocation
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
