/**
 * @file ParcelValidation
 * @description This file defines the validation schema for parcel data using Zod.
 * It includes the schema definition and type export for use in forms and data handling.
 */

import { z } from "zod";

/**
 * @constant parcelFormSchema
 * @description Zod schema for validating parcel form data
 */
export const parcelFormSchema = z.object({
  _id: z.string().optional(),
  spaceId: z.string().min(1, "Space ID is required"),
  occupantId: z.string().min(1, "Occupant ID is required"),
  parcelTypeId: z.string().min(1, "Parcel type ID is required"),
  numPackages: z.number().min(1, "Number of packages must be at least 1"),
  description: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  isCollected: z.boolean().optional(),
});

/**
 * @type ParcelFormData
 * @description Type definition for parcel form data, inferred from the Zod schema
 */
export type ParcelFormData = z.infer<typeof parcelFormSchema>;
