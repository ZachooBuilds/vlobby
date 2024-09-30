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
export const storageFormSchema = z.object({
  _id: z.string().optional(),
  type: z.string().min(1, "First name is required"),
  name: z.string().min(1, "Last name is required"),
  description: z.string().min(1, "Company name is required"),
  spaceId: z.string().optional(),
  status: z.string(),
  notes: z.string().optional(),
});

/**
 * @type ContractorFormData
 * @description Type definition for contractor form data, inferred from the Zod schema
 */
export type StorageFormData = z.infer<typeof storageFormSchema>;
