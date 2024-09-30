/**
 * @file HandoverNoteValidation
 * @description This file defines the validation schema for handover note data using Zod.
 * It includes the schema definition and type export for use in forms and data handling.
 */

import { z } from "zod";

/**
 * @constant handoverNoteFormSchema
 * @description Zod schema for validating handover note form data
 */
export const handoverNoteFormSchema = z.object({
  _id: z.string().optional(),
  priority: z.string().min(1, "Priority is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  followupDate: z.date().min(new Date(), "Followup date must be in the future"),
  isClosed: z.boolean().default(false),
});

/**
 * @type HandoverNoteFormData
 * @description Type definition for handover note form data, inferred from the Zod schema
 */
export type HandoverNoteFormData = z.infer<typeof handoverNoteFormSchema>;
