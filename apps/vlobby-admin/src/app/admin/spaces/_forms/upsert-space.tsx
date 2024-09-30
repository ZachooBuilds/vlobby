"use client";
/**
 * @file SpaceUpsertForm Component
 * @description This component provides a form for creating or updating space information.
 * It uses react-hook-form for form management and zod for validation.
 */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import {
  UpsertSpaceFormData,
  upsertSpaceSchema,
} from "./upsert-space-validation";
import { useMutation, useQuery } from "convex/react";
import { SpaceType } from "../../settings/general/_tables/space-types-table";
import { useToast } from "@repo/ui/hooks/use-toast";
import { api } from "@repo/backend/convex/_generated/api";
import { BuildingFormValues } from "../../settings/general/_forms/upsert-building";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import useSheetStore from "../../../lib/global-state/sheet-state";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/ui/popover";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { Calendar } from "@repo/ui/components/ui/calendar";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { FileUploadWithPreview } from "../../_components/custom-form-fields/file-upload-form-field";
import { Switch } from "@repo/ui/components/ui/switch";

/**
 * @interface Props
 * @description Defines the structure of props for the SpaceUpsertForm component
 * @property {UpsertSpaceFormData} selectedSpace - Optional. The space data to be edited, if any
 */
type Props = {
  selectedSpace?: UpsertSpaceFormData;
};

/**
 * @function SpaceUpsertForm
 * @description The main component for creating or updating space information
 * @param {Props} props - The component props
 * @returns {JSX.Element} The rendered SpaceUpsertForm component
 */
const SpaceUpsertForm = ({ selectedSpace }: Props) => {
  // State variables and toast notifications setup
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Convert start and end dates to Date objects if selectedOffer is provided
  const formattedSpace = selectedSpace
    ? {
        ...selectedSpace,
        settlementDate: new Date(selectedSpace.settlementDate),
      }
    : undefined;

  // Configure form validation parameters based on the validation schema
  const form = useForm<UpsertSpaceFormData>({
    resolver: zodResolver(upsertSpaceSchema),
    defaultValues: formattedSpace ?? {
      lettingEnabled: false,
      accessibilityEnabled: false,
    },
  });

  // Fetch Convex queries and mutations
  const upsertSpaceMutation = useMutation(api.spaces.upsertSpace);
  const getSpaceTypes = useQuery(api.spaces.getAllSpaceTypes) as SpaceType[];
  const getBuildings = useQuery(api.site.getAllSites) as BuildingFormValues[];

  // Update the getFloorList query
  const getFloorList = useQuery(
    api.site.getFloorList,
    form.watch("building")
      ? { id: form.watch("building") as Id<"sites"> }
      : "skip",
  ) as { index: number; name: string }[] | undefined;

  // Function to close the sheet (from global state)
  const closeSheet = useSheetStore((state) => state.closeSheet);

  /**
   * @function onSubmit
   * @description Handles form submission and creates/updates space in Convex database
   * @param {UpsertSpaceFormData} data - The form data to be submitted
   */
  const onSubmit = async (data: UpsertSpaceFormData) => {
    console.log("Form submitted", data);
    setIsLoading(true);

    // Map files to an array of storage IDs
    const mappedFiles = data.files?.map((file) => file.storageId) ?? [];

    console.log("Mapped files", mappedFiles);

    try {
      await upsertSpaceMutation({
        _id: selectedSpace?._id as Id<"spaces">,
        spaceName: data.spaceName,
        titleNumber: data.titleNumber,
        type: data.type as Id<"spaceTypes">,
        description: data.description,
        building: data.building as Id<"sites">,
        floor: data.floor,
        files: mappedFiles,
        settlementDate: data.settlementDate.toISOString(),
        powerMeterNumber: data.powerMeterNumber,
        waterMeterNumber: data.waterMeterNumber,
        lettingEnabled: data.lettingEnabled,
        accessibilityEnabled: data.accessibilityEnabled,
        ...(data.lettingEnabled && {
          agentName: data.agentName,
          agentBusiness: data.agentBusiness,
          mobile: data.mobile,
          email: data.email,
        }),
        ...(data.accessibilityEnabled && {
          accessibilityRequirement: data.accessibilityRequirement,
          medicalInfo: data.medicalInfo,
          isOrientationRequired: data.isOrientationRequired,
        }),
      });

      setIsLoading(false);
      toast({
        title: "Space Saved",
        description: "The space has been successfully saved.",
      });
      form.reset();
      if (selectedSpace) {
        closeSheet();
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save the space. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving space:", error);
    }
  };

  // Render the form UI with relevant form fields
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Space Details Section */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Space Name Field */}
          <FormField
            control={form.control}
            name="spaceName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Space Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter space name" {...field} />
                </FormControl>
                <FormDescription>Enter the name of the space</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title Number Field */}
          <FormField
            control={form.control}
            name="titleNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title number" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the legal title number for the space
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Space Type Field */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Space Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select space type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getSpaceTypes?.map((type) => (
                      <SelectItem key={type._id} value={type._id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the type for this space
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Building Field */}
          <FormField
            control={form.control}
            name="building"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Building</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select building" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getBuildings?.map((building) => (
                      <SelectItem key={building._id} value={building._id!}>
                        {building.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the building where the space is located
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Floor Field */}
          <FormField
            control={form.control}
            name="floor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Floor</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!form.watch("building") || !getFloorList}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select floor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getFloorList?.map((floor) => (
                      <SelectItem key={floor.index} value={floor.name}>
                        {floor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select the floor of the space</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Settlement Date Field */}
          <FormField
            control={form.control}
            name="settlementDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Settlement Date</FormLabel>
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
                  Select the settlement date for the space
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter space description" {...field} />
              </FormControl>
              <FormDescription>
                Provide a detailed description of the space
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Offer Image Upload */}
        <div className="flex w-full">
          <FileUploadWithPreview
            name="files"
            label="Space Images (Max 20)"
            multiple={true}
            maxFiles={20}
          />
        </div>

        {/* Utilities Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Utilities</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Power Meter Number Field */}
            <FormField
              control={form.control}
              name="powerMeterNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Power Meter Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter power meter number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the power meter number for the space
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Water Meter Number Field */}
            <FormField
              control={form.control}
              name="waterMeterNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Water Meter Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter water meter number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the water meter number for the space
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Letting Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Letting</h2>
            <FormField
              control={form.control}
              name="lettingEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (!checked) {
                          form.setValue("agentName", "");
                          form.setValue("agentBusiness", "");
                          form.setValue("mobile", "");
                          form.setValue("email", "");
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {form.watch("lettingEnabled") && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Agent Name Field */}
              <FormField
                control={form.control}
                name="agentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter agent name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the name of the letting agent
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Business Field */}
              <FormField
                control={form.control}
                name="agentBusiness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter business name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the name of the letting agency
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mobile Field */}
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter mobile number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the mobile number of the letting agent
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the email address of the letting agent
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        {/* Accessibility Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Accessibility</h2>
            <FormField
              control={form.control}
              name="accessibilityEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (!checked) {
                          form.setValue("accessibilityRequirement", "");
                          form.setValue("medicalInfo", "");
                          form.setValue("isOrientationRequired", false);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {form.watch("accessibilityEnabled") && (
            <div className="space-y-4">
              {/* Accessibility Requirements */}
              <FormField
                control={form.control}
                name="accessibilityRequirement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accessibility Requirements</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter accessibility requirements"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe any specific accessibility requirements for the
                      space
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Medical Requirements */}
              <FormField
                control={form.control}
                name="medicalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Requirements</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter medical requirements"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe any medical requirements to be aware of
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Orientation Required */}
              <FormField
                control={form.control}
                name="isOrientationRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Accessibility Orientation Required
                      </FormLabel>
                      <FormDescription>
                        Indicate if space users require an accessibility
                        orientation
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save Space
        </Button>
      </form>
    </Form>
  );
};

export default SpaceUpsertForm;
