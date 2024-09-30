import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Occupant } from "../[id]/_components/occupants-summary";
import { useMutation } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { spaceRoleOptions } from "../../../lib/app-data/static-data";
import { Button } from "@repo/ui/components/ui/button";
const formSchema = z.object({
  userId: z.string().min(1, "User is required"),
  roleId: z.string().min(1, "Role is required"),
});

interface AddOccupantFormProps {
  allOccupants: Occupant[];
  spaceId: string;
}

const AddOccupantForm = ({ allOccupants, spaceId }: AddOccupantFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      roleId: "",
    },
  });

  // Fetch Convex queries and mutations
  const upsertSpaceMutation = useMutation(api.occupants.addUserToSpace);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await upsertSpaceMutation({
        id: values.userId as Id<"users">,
        spaceId: spaceId,
        role: values.roleId,
      });
      // Handle successful submission (e.g., show a success message, reset form)
      form.reset();
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error("Error adding occupant:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {allOccupants.length > 0 ? (
                    allOccupants.map((occupant) => (
                      <SelectItem key={occupant._id} value={occupant._id}>
                        {`${occupant.firstName} ${occupant.lastName}`}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="not-found" disabled>
                      Nobody to add!
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
          Add Occupant
        </Button>
      </form>
    </Form>
  );
};

export default AddOccupantForm;
