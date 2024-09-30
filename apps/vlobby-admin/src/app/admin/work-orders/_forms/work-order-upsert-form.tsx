"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import {
  workOrderFormSchema,
  WorkOrderFormData,
} from "./work-order-validation";
import { useMutation, useQuery } from "convex/react";
import { IssueFormData } from "../../issues/_forms/issues-validation";
import useSheetStore from "../../../lib/global-state/sheet-state";
import { useToast } from "@repo/ui/hooks/use-toast";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { ValueLabelPair } from "../../../lib/app-data/app-types";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { IssueTypeToggle } from "../../_components/custom-form-fields/issue-type-selector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/ui/popover";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { Calendar } from "@repo/ui/components/ui/calendar";
import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { FancyMultiSelect } from "../../_components/custom-form-fields/multi-select-field";
import { FileUploadWithPreview } from "../../_components/custom-form-fields/file-upload-form-field";

type Props = {
  selectedWorkOrder?: WorkOrderFormData;
  referenceIssue?: IssueFormData;
};

const WorkOrderUpsertForm = ({ selectedWorkOrder, referenceIssue }: Props) => {
  // -------------- STATE & GENERAL CONFIG -------------- //
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<{ value: string; label: string }[]>([]);
  const closeSheet = useSheetStore((state) => state.closeSheet);
  const { toast } = useToast();
  // ---------------------------------------------------- //

  // -------------- BACKEND MUTATIONS -------------- //
  const upsertWorkOrderMutation = useMutation(api.workOrders.upsertWorkOrder);
  // ---------------------------------------------------- //

  const formattedWorkOrder = selectedWorkOrder
    ? {
        ...selectedWorkOrder,
        dueDate: selectedWorkOrder.dueDate
          ? new Date(selectedWorkOrder.dueDate)
          : undefined,
      }
    : undefined;

  // Prepare the linkedTickets array with the referenceIssue if it exists
  const initialLinkedTickets = referenceIssue
    ? [
        {
          value: referenceIssue._id as Id<"issues">,
          label: referenceIssue.title,
        },
      ]
    : [];

  // When setting up the form if passed a referenceTicket then set the default values for the form
  const form = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderFormSchema),
    defaultValues: formattedWorkOrder ?? {
      locationId: referenceIssue?.locationId,
      priority: referenceIssue?.priority,
      description: referenceIssue?.description,
      linkedTickets: initialLinkedTickets,
      title: referenceIssue?.title,
      workOrderType: referenceIssue?.issueType,
      facilityId: referenceIssue?.facilityId,
      spaceId: referenceIssue?.spaceId,
      buildingId: referenceIssue?.buildingId,
      floor: referenceIssue?.floor,
      dueDate: referenceIssue?.followUpDate
        ? new Date(referenceIssue.followUpDate)
        : undefined,
    },
  });

  // -------------- BACKEND QUERIES -------------- //
  const getLocations = useQuery(
    api.tickets.getAllTicketLocationsValueLabelPair,
  ) as ValueLabelPair[];
  const getSpaces = useQuery(
    api.spaces.getAllSpaceValueLabelPairs,
  ) as ValueLabelPair[];
  const getFacilities = useQuery(
    api.facilities.getAllFacilityValueLabelPairs,
  ) as ValueLabelPair[];
  const getWorkOrderTypes = useQuery(
    api.tickets.getAllTicketTypesValueLabelPair,
  ) as ValueLabelPair[];
  const getSites = useQuery(
    api.site.getAllSitesValueLabelPairs,
  ) as ValueLabelPair[];
  const getIssues = useQuery(
    api.tickets.getAllIssuesValueLabelPair,
  ) as ValueLabelPair[];
  const getContractors = useQuery(
    api.contractors.getAllContractorsValueLabelPair,
  ) as ValueLabelPair[];

  const getFloorList = useQuery(
    api.site.getFloorListValueLabelPairs,
    form.watch("buildingId")
      ? { id: form.watch("buildingId") as Id<"sites"> }
      : "skip",
  ) as { value: number; label: string }[] | undefined;

  // Use useEffect to update linkedTickets when getIssues loads and referenceIssue exists
  useEffect(() => {
    if (getIssues && referenceIssue) {
      const matchingIssue = getIssues.find(
        (issue) => issue.value === referenceIssue._id,
      );
      if (matchingIssue) {
        form.setValue("linkedTickets", [matchingIssue]);
      }
    }
  }, [getIssues, referenceIssue, form]);
  // ---------------------------------------------------- //

  const onSubmit = async (data: WorkOrderFormData) => {
    setIsLoading(true);

    const mappedFiles = data.files?.map((file) => file.storageId) ?? [];

    try {
      await upsertWorkOrderMutation({
        ...data,
        files: mappedFiles,
        facilityId: data.facilityId as Id<"facilities">,
        spaceId: data.spaceId as Id<"spaces">,
        buildingId: data.buildingId as Id<"sites">,
        locationId: (data.locationId as Id<"ticketLocations">) ?? undefined,
        _id: selectedWorkOrder?._id as Id<"workOrders">,
        dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
      });

      setIsLoading(false);
      toast({
        title: "Work Order Saved",
        description: "The work order has been successfully saved.",
      });
      form.reset();
      if (selectedWorkOrder) {
        closeSheet();
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save the work order. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving work order:", error);
    }
  };

  console.log("workOrderType field value:", form.getValues("workOrderType"));
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="workOrderType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work Order Type</FormLabel>
              <FormControl>
                <IssueTypeToggle
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>Select the type of work order</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Rest of the form fields */}
          {form.watch("workOrderType") === "facility" && (
            <FormField
              control={form.control}
              name="facilityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facility (Optional) </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.resetField("spaceId");
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select facility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getFacilities?.map((facility) => (
                        <SelectItem key={facility.value} value={facility.value}>
                          {facility.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the facility where the issue is located
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {form.watch("workOrderType") === "space" && (
            <FormField
              control={form.control}
              name="spaceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Space (Optional) </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.resetField("facilityId"); // Reset facilityId when spaceId changes
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select space" />
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
                    Select the space where the issue is located
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {form.watch("workOrderType") === "general" && (
            <>
              <FormField
                control={form.control}
                name="buildingId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Building</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select building" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getSites?.map((site) => (
                          <SelectItem key={site.value} value={site.value}>
                            {site.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the issue location</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="floor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Floor</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select floor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getFloorList?.map((site) => (
                          <SelectItem
                            key={site.value}
                            value={site.value.toString()}
                          >
                            {site.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the issue Floor</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="locationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getLocations?.map((location) => (
                      <SelectItem key={location.value} value={location.value}>
                        {location.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select the issue location</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date > new Date("2100-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Set a targeted completion date for the issue
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the work order priority
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignedContractorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned Contractor</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
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
                <FormDescription>
                  Assign the work order to a approved contractor
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work Order Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Provide a brief title for the work order
              </FormDescription>
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
                  placeholder="Enter work order description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a detailed description of the work order
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work Order Tags</FormLabel>
              <FormControl>
                <FancyMultiSelect
                  options={getWorkOrderTypes ?? []}
                  initialSelected={field.value}
                  onChange={field.onChange}
                  name={field.name}
                  placeholder="Select tags..."
                />
              </FormControl>
              <FormDescription>
                Add relevant tags to help with categorization and reporting
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="linkedTickets"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Linked Tickets</FormLabel>
              <FormControl>
                <FancyMultiSelect
                  options={getIssues ?? []}
                  initialSelected={field.value}
                  onChange={field.onChange}
                  name={field.name}
                  placeholder="Select Tickets..."
                />
              </FormControl>
              <FormDescription>
                If this work order is connected to a ticket then log that here
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full">
          <FileUploadWithPreview
            name="files"
            label="Work Order Images (Max 5)"
            multiple={true}
            maxFiles={5}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save Work Order
        </Button>
      </form>
    </Form>
  );
};

export default WorkOrderUpsertForm;
