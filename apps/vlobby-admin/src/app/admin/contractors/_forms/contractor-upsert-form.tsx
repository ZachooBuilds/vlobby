"use client";

/**
 * @file ContractorUpsertForm Component
 * @description This component provides a form for adding or updating contractor information.
 * It uses react-hook-form for form handling and Zod for validation.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import {
  ContractorFormData,
  contractorFormSchema,
} from "./contractor-validation";
import { useMutation, useQuery } from "convex/react";
import useSheetStore from "../../../lib/global-state/sheet-state";
import { useToast } from "@repo/ui/hooks/use-toast";
import { api } from "@repo/backend/convex/_generated/api";
import { ValueLabelPair } from "../../../lib/app-data/app-types";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { FancyMultiSelect } from "../../_components/custom-form-fields/multi-select-field";
import { Button } from "@repo/ui/components/ui/button";


/**
 * @interface ContractorFormProps
 * @description Defines the props for the ContractorUpsertForm component
 */
type ContractorFormProps = {
  selectedContractor?: ContractorFormData | null;
};

/**
 * @function ContractorUpsertForm
 * @description The main component for adding or updating contractor information
 * @param {ContractorFormProps} props - The component props
 * @returns {JSX.Element} The rendered ContractorUpsertForm component
 */
export default function ContractorUpsertForm({
  selectedContractor,
}: ContractorFormProps) {
  // -------------- STATE & GENERAL CONFIG -------------- //
  const [isLoading, setIsLoading] = useState(false);
  const closeSheet = useSheetStore((state) => state.closeSheet);
  const { toast } = useToast();
  // ---------------------------------------------------- //

  // -------------- BACKEND QUERIES -------------- //
  /**
   * @constant serviceCategoryOptions
   * @description Fetches all ticket types as value-label pairs for the service categories dropdown
   */
  const serviceCategoryOptions = useQuery(
    api.tickets.getAllTicketTypesValueLabelPair,
  ) as ValueLabelPair[];
  // ---------------------------------------------------- //

  // -------------- BACKEND MUTATIONS -------------- //
  /**
   * @constant upsertContractorMutation
   * @description Mutation for adding or updating a contractor
   */
  const upsertContractorMutation = useMutation(
    api.contractors.upsertContractor,
  );

  const deleteContractorMutation = useMutation(api.contractors.remove);
  // ---------------------------------------------------- //

  /**
   * @constant form
   * @description Initializes the form with react-hook-form and Zod validation
   */
  const form = useForm<ContractorFormData>({
    resolver: zodResolver(contractorFormSchema),
    defaultValues: selectedContractor ?? {
      firstName: "",
      lastName: "",
      companyName: "",
      email: "",
      phone: "",
      notes: "",
      preferredServiceCategories: [],
    },
  });

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteContractorMutation({
        id: selectedContractor?._id as Id<"contractors">,
      });
      toast({
        title: "Contractor Deleted",
        description: "The contractor has been successfully deleted.",
      });
      closeSheet();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to delete the contractor. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting contractor:", error);
    }
  };

  /**
   * @function onSubmit
   * @description Handles form submission
   * @param {ContractorFormData} data - The form data to be submitted
   */
  const onSubmit = async (data: ContractorFormData) => {
    setIsLoading(true);

    try {
      await upsertContractorMutation({
        ...data,
        _id: selectedContractor?._id as Id<"contractors">,
      });

      setIsLoading(false);
      toast({
        title: "Contractor Saved",
        description: "The contractor has been successfully saved.",
      });
      form.reset();
      if (selectedContractor) {
        closeSheet();
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save the contractor. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving contractor:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        </div>

        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter email address"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter phone number"
                    type="tel"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
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

        <FormField
          control={form.control}
          name="preferredServiceCategories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Service Categories</FormLabel>
              <FormControl>
                <FancyMultiSelect
                  options={serviceCategoryOptions ?? []}
                  initialSelected={field.value}
                  onChange={field.onChange}
                  name={field.name}
                  placeholder="Select preferred service categories..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {selectedContractor ? "Update Contractor" : "Add Contractor"}
        </Button>

        {selectedContractor && (
          <div className="mt-8 rounded-md border border-destructive/20 p-4 transition-all duration-300 ease-in-out hover:border-destructive">
            <h3 className="text-lg font-semibold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting this contractor is irreversible. Please proceed with
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
              Delete Contractor
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
