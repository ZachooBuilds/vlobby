"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash, Plus } from "lucide-react";
import { z } from "zod";
import { useMutation, useQuery } from "convex/react";
import { useOrganization} from '@clerk/clerk-react';
import { useToast } from "@repo/ui/hooks/use-toast";
import { api } from "@repo/backend/convex/_generated/api";
import useSheetStore from "../../../lib/global-state/sheet-state";
import { addUser } from "../../../../clerk-server/clerk";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Card } from "@repo/ui/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { spaceRoleOptions } from "../../../lib/app-data/static-data";
import { Button } from "@repo/ui/components/ui/button";

// Define props for the component
type Props = {
  selectedOccupant?: z.infer<typeof occupantSchema> | null;
};

// Placeholder data for spaces and roles
// TODO: Replace with actual data fetched from the backend

// Define schema for occupant spaces
export const occupantSpacesSchema = z.object({
  spaceId: z.string().min(1, "Space is required"),
  role: z.string().min(1, "Role is required"),
});

// Define schema for occupant data
export const occupantSchema = z.object({
  _id: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  parcelPreference: z.enum(["hold", "deliver", "notify"]),
  notes: z.string().optional(),
  occupantSpaces: z.array(occupantSpacesSchema).optional(),
});

export type OccupantFormData = z.infer<typeof occupantSchema>;

// Component for creating or updating an occupant
const OccupantUpsertForm = ({ selectedOccupant }: Props) => {
  // State for loading
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize form with react-hook-form and zod resolver
  const form = useForm<OccupantFormData>({
    resolver: zodResolver(occupantSchema),
    defaultValues: selectedOccupant ?? {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      parcelPreference: "hold",
      notes: "",
      occupantSpaces: [],
    },
  });

  // Manage the field array for occupant spaces and roles
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "occupantSpaces",
  });

  // Convex mutation for upserting occupant
  const upsertOccupant = useMutation(api.occupants.upsertOccupant);

  // Fetch Convex queries and mutations
  const getSpaceDropdowns = useQuery(api.spaces.getAllSpacesDropdown);

  // Get organization data from Clerk
  const { isLoaded, organization } = useOrganization();

  // Function to close the sheet (from global state)
  const closeSheet = useSheetStore((state) => state.closeSheet);

  // Handle form submission
  async function onSubmit(data: OccupantFormData) {
    setIsLoading(true);

    try {
      // Check if organization is loaded
      if (!isLoaded || !organization) {
        return <>Loading</>;
      }

      // Add user to Clerk
      const { userId } = await addUser(data);

      // Check if user is already a member of the organization
      const members = await organization.getMemberships();
      const isAlreadyMember = members.data.some(
        (member) => member.publicUserData.userId === userId,
      );

      // Add user to organization if not already a member
      if (!isAlreadyMember) {
        await organization.addMember({
          userId: userId,
          role: "org:occupant",
        });
      }

      // Upsert occupant in Convex database
      const occupantId = await upsertOccupant({
        _id: selectedOccupant?._id as Id<"users">,
        userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        parcelPreference: data.parcelPreference,
        notes: data.notes,
        occupantSpaces: data.occupantSpaces ?? [],
      });

      // Show success toast
      toast({
        title: "Occupant saved successfully",
        description: "Successfully updated occupant details",
      });

      // Reset form and close sheet if editing
      form.reset();
      if (selectedOccupant) {
        closeSheet();
      }
    } catch (error) {
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to add occupant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="h-full w-full overflow-scroll border-none p-1 shadow-none">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          {/* Personal Information Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* First Name Field */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name Field */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} />
                  </FormControl>
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
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number Field */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Parcel Preference Field */}
            <FormField
              control={form.control}
              name="parcelPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parcel Preference</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parcel preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="hold">Hold</SelectItem>
                      <SelectItem value="deliver">Deliver</SelectItem>
                      <SelectItem value="notify">Notify</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Notes Field */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any additional notes"
                    className="resize-vertical"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Optional: Add any relevant notes about the occupant
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Spaces and Roles Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Spaces and Roles</h2>
            </div>
            {/* Render dynamic fields for spaces and roles */}
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-row items-end justify-start gap-2"
              >
                <FormField
                  control={form.control}
                  name={`occupantSpaces.${index}.spaceId`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Space</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select space" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getSpaceDropdowns?.map((space) => (
                            <SelectItem key={space._id as string} value={space._id as string}>
                              {space.spaceName}
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
                  name={`occupantSpaces.${index}.role`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {spaceRoleOptions.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="h-10 w-10 p-2"
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash className="h-5 w-5" />
                </Button>
              </div>
            ))}
            {/* Button to add new space and role */}
            <Button
              type="button"
              className="w-full border border-dashed border-primary bg-[#F6F5FF] text-primary hover:text-white"
              onClick={() => append({ spaceId: "", role: "" })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add another space and role
            </Button>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {selectedOccupant ? "Update Occupant" : "Add Occupant"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default OccupantUpsertForm;
