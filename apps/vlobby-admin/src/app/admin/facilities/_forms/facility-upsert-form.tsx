"use client";

import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash } from "lucide-react";
import { FacilityFormData, facilityFormSchema } from "./facility-validation";
import { useMutation, useQuery } from "convex/react";
import { useToast } from "@repo/ui/hooks/use-toast";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { FacilityTypeData } from "../../settings/general/_forms/upsert-facility-types";
import { BuildingFormValues } from "../../settings/general/_forms/upsert-building";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { FileUploadWithPreview } from "../../_components/custom-form-fields/file-upload-form-field";
import { Switch } from "@repo/ui/components/ui/switch";
import AudienceField from "../../_components/custom-form-fields/audience-form-field";
import { Button } from "@repo/ui/components/ui/button";

/**
 * @interface Props
 * @description Defines the structure of props for the FacilityUpsertForm component
 * @property {FacilityFormData} selectedFacility - Optional. The facility data to be edited, if any
 */
type Props = {
  selectedFacility?: FacilityFormData;
};

const FacilityUpsertForm = ({ selectedFacility }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FacilityFormData>({
    resolver: zodResolver(facilityFormSchema),
    defaultValues: selectedFacility ?? {
      isPublic: false,
      facilityTypeId: "",
      buildingId: "",
      floor: "",
      audience: [],
      files: [],
      name: "",
      description: "",
    },
  });

  const upsertFacilityMutation = useMutation(api.facilities.upsertFacility);

  const onSubmit = async (data: FacilityFormData) => {
    setIsLoading(true);

    const hasAudience =
      data.audience && data.audience.length > 0 ? true : false;
    const submissionData = {
      _id: data._id as Id<"facilities">,
      name: data.name,
      description: data.description,
      facilityTypeId: data.facilityTypeId as Id<"facilityTypes">,
      buildingId: data.buildingId as Id<"sites">,
      floor: data.floor,
      isPublic: data.isPublic,
      hasAudience,
      files: data.files.map((file) => ({ storageId: file.storageId })),
      audience: data.audience,
    };

    try {
      const result = await upsertFacilityMutation(submissionData);
      setIsLoading(false);
      toast({
        title: "Facility Saved",
        description: "The facility has been successfully saved.",
      });
      form.reset();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save the facility. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving facility:", error);
    }
  };

  // ########### DYNAMIC FIELD MANAGEMENT ###########
  const {
    fields: audienceFields,
    append: appendAudience,
    remove: removeAudience,
  } = useFieldArray({
    control: form.control,
    name: "audience",
  });

  // ########### GET DATA REQUIRED IN DROPDOWNS ###########

  // Fetch offer categories from the API
  const facilityTypes = useQuery(
    api.facilities.getAllFacilityTypes,
  ) as FacilityTypeData[];
  const getBuildings = useQuery(api.site.getAllSites) as BuildingFormValues[];
  // Update the getFloorList query
  const getFloorList = useQuery(
    api.site.getFloorList,
    form.watch("buildingId")
      ? { id: form.watch("buildingId") as Id<"sites"> }
      : "skip",
  ) as { index: number; name: string }[] | undefined;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facility Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter facility name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Facility Type Selector */}
          <FormField
            control={form.control}
            name="facilityTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facility Type</FormLabel>
                {facilityTypes ? (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const selectedType = facilityTypes.find(
                        (type) => type._id === value,
                      );
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select facility type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {facilityTypes.map((type) => (
                        <SelectItem
                          key={type._id}
                          value={type._id ?? "unknown"}
                        >
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Skeleton className="h-10 w-full" />
                )}
                <FormMessage />
                <FormDescription>
                  What type of facility is this ?
                </FormDescription>
              </FormItem>
            )}
          />

          {/* Building Field */}
          <FormField
            control={form.control}
            name="buildingId"
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
                  disabled={!form.watch("buildingId") || !getFloorList}
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
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facility Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter facility description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Offer Image Upload */}
        <div className="flex w-full">
          <FileUploadWithPreview
            name="files"
            label="Facility Cover Image"
            multiple={true}
            maxFiles={6}
          />
        </div>

        <div className="flex flex-col items-start justify-start gap-2">
          <p className="text-sm font-medium">Audience</p>
          <p className="text-sm text-muted-foreground">
            An audience defines who the announcement is targeted at. We provide
            different options so you can configure this to ensure the message is
            relayed only to the people you want. The type specifies the
            category, such as a user or a particular floor. The entity is the
            specific value, such as user Jane Doe or floor 7.
          </p>
        </div>

        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-sm font-medium">
                  Publicly Available
                </FormLabel>
                <FormDescription>
                  By marking this space as publicly available you will be able
                  to take bookings from external users.
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
        {/* Dynamic Audience Fields */}
        {audienceFields.map((field, index) => (
          <div key={field.id} className="flex flex-row items-end gap-2">
            <AudienceField
              index={index}
              buildingId={form.watch("buildingId")}
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => removeAudience(index)}
            >
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
        {/* Add Audience Button */}
        <Button
          type="button"
          className="w-full border border-dashed border-primary bg-[#F6F5FF] text-primary hover:text-white"
          onClick={() => appendAudience({ type: "", entity: "" })}
        >
          <Plus className="mr-2 h-4 w-4" /> Add another audience group
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default FacilityUpsertForm;
