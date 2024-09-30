"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { pickupSchema, PickupRequest } from "./request-validation";
import { useMutation, useQuery } from "convex/react";
import { useToast } from '@repo/ui/hooks/use-toast';
import { api } from '@repo/backend/convex/_generated/api';
import {
  ValueLabelPair,
} from '../../../lib/app-data/app-types';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover';
import { cn } from '@repo/ui/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/ui/components/ui/command';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { Input } from "@repo/ui/components/ui/input";



export default function NewRequestForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const upsertRequestMutation = useMutation(api.requests.upsertRequest);

  const getVehicles = useQuery(
    api.vehicles.getAllVehicleValueLabelPair,
    { isDropoff: false },
  ) as ValueLabelPair[];

  const form = useForm<PickupRequest>({
    resolver: zodResolver(pickupSchema),
    defaultValues: {
      requestType: "",
      vehicleId: "",
      notes: "",
    },
  });

  const onSubmit = async (data: PickupRequest) => {
    setIsLoading(true);
    console.log(data);

    try {
      await upsertRequestMutation({
        _id: data._id as Id<"requests">,
        requestType: data.requestType,
        vehicleId: data.vehicleId,
        notes: data.notes,
      });

      setIsLoading(false);
      toast({
        title: "Request Saved",
        description: "The request has been successfully saved.",
      });
      form.reset();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save the request. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving request:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="requestType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Request Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pickup Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pickup:item">Item Request</SelectItem>
                  <SelectItem value="pickup:vehicle">
                    Vehicle Request
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Select the pickup type</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vehicleId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Vehicle</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? getVehicles?.find(
                            (vehicle) => vehicle.value === field.value,
                          )?.label
                        : "Select vehicle"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[50vw]">
                  <Command className="w-full">
                    <CommandInput placeholder="Search vehicles..." />
                    <CommandList className="w-full">
                      <CommandEmpty>No Vehicles Found</CommandEmpty>
                      <CommandGroup>
                        {getVehicles?.map((vehicle) => (
                          <CommandItem
                            value={vehicle.label}
                            key={vehicle.value}
                            onSelect={() => {
                              form.setValue("vehicleId", vehicle.value);
                            }}
                            className="w-full"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                vehicle.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {vehicle.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select the vehicle that is being picked up.
              </FormDescription>
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
                <Input placeholder="Enter any additional notes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Add Request
        </Button>
      </form>
    </Form>
  );
}
