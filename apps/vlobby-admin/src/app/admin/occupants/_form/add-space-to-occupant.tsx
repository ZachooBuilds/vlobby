import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "convex/react";
import { SpaceSummary } from "../[id]/_components/spaces-summary";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { spaceRoleOptions } from "../../../lib/app-data/static-data";
import { Button } from "@repo/ui/components/ui/button";

/**
 * Zod schema for form validation
 */
const formSchema = z.object({
  spaceId: z.string().min(1, "Space is required"),
  roleId: z.string().min(1, "Role is required"),
});


/**
 * Props for the AddSpaceToOccupantForm component
 */
interface AddSpaceToOccupantFormProps {
  allSpaces: SpaceSummary[];
  userId: string;
}

/**
 * AddSpaceToOccupantForm component
 * @description Form to add a space to an occupant
 * @param {AddSpaceToOccupantFormProps} props - The component props
 * @returns {JSX.Element} The rendered AddSpaceToOccupantForm component
 */
const AddSpaceToOccupantForm = ({
  allSpaces,
  userId,
}: AddSpaceToOccupantFormProps) => {
  // Initialize form with react-hook-form and zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      spaceId: "",
      roleId: "",
    },
  });

  // Fetch Convex mutation
  const addSpaceToOccupantMutation = useMutation(api.occupants.addUserToSpace);

  /**
   * Handle form submission
   * @param {z.infer<typeof formSchema>} values - The form values
   */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await addSpaceToOccupantMutation({
        id: userId as Id<"users">,
        spaceId: values.spaceId,
        role: values.roleId,
      });
      // Reset form after successful submission
      form.reset();
    } catch (error) {
      console.error("Error adding space to occupant:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="spaceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Space</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a space" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {allSpaces.length > 0 ? (
                    allSpaces.map((space) => (
                      <SelectItem key={space._id} value={space._id}>
                        {`${space.spaceName} - ${space.buildingName}`}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="not-found" disabled>
                      No spaces available!
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
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

        <Button type="submit" className="w-full">
          Add Space to Occupant
        </Button>
      </form>
    </Form>
  );
};

export default AddSpaceToOccupantForm;
