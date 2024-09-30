/**
 * @file upsert-space-validation.tsx
 * @description Defines the validation schema for the space upsert form using Zod
 */

import { z } from "zod";

/**
 * @constant upsertSpaceSchema
 * @description Zod schema for validating space upsert form data
 */
export const upsertSpaceSchema = z
  .object({
    _id: z.string().optional(), // Optional ID for existing spaces
    spaceName: z.string().min(1, { message: "Space name is required" }),
    titleNumber: z.string().min(1, { message: "Title number is required" }),
    type: z.string().min(1, { message: "Space type is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    building: z.string().min(1, { message: "Building selection is required" }),
    floor: z.string().min(1, { message: "Floor number is required" }),
    settlementDate: z.date({
      required_error: "Settlement date is required",
      invalid_type_error: "That's not a valid date!",
    }),
    files: z
      .array(
        z.object({
          url: z.string().url(),
          storageId: z.string(),
        }),
      )
      .optional(),
    powerMeterNumber: z
      .string()
      .min(1, { message: "Power meter number is required" }),
    waterMeterNumber: z
      .string()
      .min(1, { message: "Water meter number is required" }),
    lettingEnabled: z.boolean(),
    accessibilityEnabled: z.boolean(),
  })
  .and(
    // Conditional validation for letting fields
    z.discriminatedUnion("lettingEnabled", [
      z.object({
        lettingEnabled: z.literal(true),
        agentName: z.string().min(1, { message: "Agent name is required" }),
        agentBusiness: z
          .string()
          .min(1, { message: "Agent business is required" }),
        mobile: z.string().min(1, { message: "Mobile number is required" }),
        email: z.string().email({ message: "Invalid email address" }),
      }),
      z.object({
        lettingEnabled: z.literal(false),
      }),
    ]),
  )
  .and(
    // Conditional validation for accessibility fields
    z.discriminatedUnion("accessibilityEnabled", [
      z.object({
        accessibilityEnabled: z.literal(true),
        accessibilityRequirement: z
          .string()
          .min(1, { message: "Accessibility requirement is required" }),
        medicalInfo: z
          .string()
          .min(1, { message: "Medical information is required" }),
        isOrientationRequired: z.boolean(),
      }),
      z.object({
        accessibilityEnabled: z.literal(false),
      }),
    ]),
  );

/**
 * @type UpsertSpaceFormData
 * @description Type definition for the space upsert form data, inferred from the Zod schema
 */
export type UpsertSpaceFormData = z.infer<typeof upsertSpaceSchema>;
