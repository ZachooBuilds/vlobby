/**
 * @file ContractorValidation
 * @description This file defines the validation schema for contractor data using Zod.
 * It includes the schema definition and type export for use in forms and data handling.
 */

import { z } from "zod";

/**
 * @constant contractorFormSchema
 * @description Zod schema for validating contractor form data
 */
export const contractorFormSchema = z.object({
  _id: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  notes: z.string().optional(),
  preferredServiceCategories: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    }),
  ),
});

/**
 * @type ContractorFormData
 * @description Type definition for contractor form data, inferred from the Zod schema
 */
export type ContractorFormData = z.infer<typeof contractorFormSchema>;
