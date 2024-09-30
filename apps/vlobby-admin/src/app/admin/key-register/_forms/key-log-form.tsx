"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

import { Loader2, CalendarIcon } from "lucide-react";



import { keyLogFormSchema, KeyLogFormData } from "./key-log-validation";
import { useMutation, useQuery } from "convex/react";
import { useToast } from "@repo/ui/hooks/use-toast";
import { api } from "@repo/backend/convex/_generated/api";
import { ValueLabelPair } from "../../../lib/app-data/app-types";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { KeyLogTypeToggle } from "../../_components/custom-form-fields/key-log-type-selector";
import { Input } from "@repo/ui/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/ui/popover";
import { Button } from "@repo/ui/components/ui/button";
import { Calendar } from "@repo/ui/components/ui/calendar";
import { TimePicker } from "@repo/ui/components/custom-form-fields/time-picker/time-picker";
import { cn } from "@repo/ui/lib/utils";
import { Textarea } from "@repo/ui/components/ui/textarea";



const KeyLogForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<KeyLogFormData>({
    resolver: zodResolver(keyLogFormSchema),
    defaultValues: {
      keyId: "",
      connectedUser: "",
      userType: "Visitor",
      checkoutTime: new Date(),
      notes: "",
    },
  });

  const getKeys = useQuery(
    api.keys.getAllKeysValueLabelPair,
  ) as ValueLabelPair[];
  const getContractors = useQuery(
    api.contractors.getAllContractorsValueLabelPair,
  ) as ValueLabelPair[];
  const getSpaces = useQuery(
    api.spaces.getAllSpaceValueLabelPairs,
  ) as ValueLabelPair[];
  const getOccupants = useQuery(
    api.occupants.getAllOccupantsValueLabelPair,
  ) as ValueLabelPair[];

  const addKeyLog = useMutation(api.keys.upsertKeyLog);

  const onSubmit = async (data: KeyLogFormData) => {
    setIsLoading(true);
    try {
      await addKeyLog({
        keyId: data.keyId,
        notes: data.notes,
        spaceId: data.spaceId as Id<"spaces">,
        connectedUser: data.connectedUser,
        userType: data.userType,
        checkoutTime: data.checkoutTime.toISOString(),
        expectedCheckinTime: data.expectedCheckinTime?.toISOString(),
        isReturned: false,
      });
      toast({
        title: "Key Log Submitted",
        description: "The key log has been successfully submitted.",
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting key log:", error);
      toast({
        title: "Error",
        description: "Failed to submit key log. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="keyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a key" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getKeys?.map((key) => (
                    <SelectItem key={key.value} value={key.value}>
                      {key.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Type</FormLabel>
              <FormControl>
                <KeyLogTypeToggle
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>Select the type of user</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="connectedUser"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User</FormLabel>
              {form.watch("userType") === "Occupant" && (
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an occupant" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getOccupants?.map((occupant) => (
                      <SelectItem key={occupant.value} value={occupant.value}>
                        {occupant.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {form.watch("userType") === "Contractor" && (
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a contractor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getContractors?.map((contractor) => (
                      <SelectItem
                        key={contractor.value}
                        value={contractor.value}
                      >
                        {contractor.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {form.watch("userType") === "Visitor" && (
                <FormControl>
                  <Input placeholder="Enter visitor name" {...field} />
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("userType") === "Visitor" && (
          <FormField
            control={form.control}
            name="spaceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Space</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="What space are they visiting ?" />
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
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="checkoutTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Checkout Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP HH:mm:ss")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                      date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                  <div className="border-t border-border p-3">
                    <TimePicker setDate={field.onChange} date={field.value} />
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expectedCheckinTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expected Return Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP HH:mm:ss")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                      date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                  <div className="border-t border-border p-3">
                    <TimePicker setDate={field.onChange} date={field.value} />
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any additional notes"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Submit Key Log
        </Button>
      </form>
    </Form>
  );
};

export default KeyLogForm;
