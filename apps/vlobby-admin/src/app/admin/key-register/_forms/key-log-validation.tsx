/**
 * @file KeyRegisterValidation
 * @description This file defines the validation schema for key register data using Zod.
 * It includes the schema definition and type export for use in forms and data handling.
 */

import { z } from "zod";

/**
 * @constant keyLogFormSchema
 * @description Zod schema for validating key register form data
 */
export const keyLogFormSchema = z.object({
  _id: z.string().optional(),
  keyId: z.string().min(1, "Key ID is required"),
  connectedUser: z.string().min(1, "Connected User is required"),
  userType: z.enum(["Visitor", "Contractor", "Occupant"]),
  spaceId: z.string().optional(),
  checkoutTime: z.date({
    required_error: "End date is required",
    invalid_type_error: "That's not a valid date!",
  }),
  checkinTime: z.date({
    required_error: "End date is required",
    invalid_type_error: "That's not a valid date!",
  }).optional(),
  expectedCheckinTime: z.date({
    required_error: "End date is required",
    invalid_type_error: "That's not a valid date!",
  }).optional(),
  notes: z.string().optional(),
});

/**
 * @type ContractorFormData
 * @description Type definition for contractor form data, inferred from the Zod schema
 */
export type KeyLogFormData = z.infer<typeof keyLogFormSchema>;
