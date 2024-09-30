/**
 * @file KeyRegisterValidation
 * @description This file defines the validation schema for key register data using Zod.
 * It includes the schema definition and type export for use in forms and data handling.
 */

import { z } from "zod";

/**
 * @constant keyFormSchema
 * @description Zod schema for validating key register form data
 */
export const keyFormSchema = z.object({
  _id: z.string().optional(),
  keyId: z.string().min(1, "Key ID is required"),
  keyTypeId: z.string().min(1, "Key Type is required"),
  notes: z.string().min(1, "Notes is required"),
  spaceId: z.string().optional(),
});

/**
 * @type ContractorFormData
 * @description Type definition for contractor form data, inferred from the Zod schema
 */
export type KeyFormData = z.infer<typeof keyFormSchema>;
