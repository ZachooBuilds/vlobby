/**
 * @file upsert-space-validation.tsx
 * @description Defines the validation schema for the space upsert form using Zod
 */

import { z } from "zod";
import { audienceSchema } from "../../../lib/app-data/global-schema";

export const facilityFormSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Facility name is required"),
  description: z.string().min(1, "Facility description is required"),
  facilityTypeId: z.string().min(1, "Facility type is required"),
  buildingId: z.string().min(1, { message: "Building selection is required" }),
  floor: z.string().min(1, { message: "Floor number is required" }),
  isPublic: z.boolean(),
  files: z
    .array(
      z.object({
        url: z.string().url(),
        storageId: z.string(),
      }),
    )
   ,
  audience: z.array(audienceSchema).optional(),
});

export type FacilityFormData = z.infer<typeof facilityFormSchema>;

