
import { z } from "zod";
import { audienceSchema } from "../../../../lib/app-data/global-schema";

export const bookingTypeSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  status: z.enum(["status:active", "status:inactive"]),
  startTime: z.date({
    required_error: "Start time is required",
    invalid_type_error: "That's not a valid date!",
  }),
  endTime: z.date({
    required_error: "End time is required",
    invalid_type_error: "That's not a valid date!",
  }),
  interval: z
    .number()
    .min(1, { message: "Interval must be at least 1 minute" }),
  maxSlots: z.number().min(1, { message: "Max slots must be at least 1" }),
  facilityId: z.string().optional(),
  description: z.string().min(1, { message: "Description is required" }),
  audience: z.array(audienceSchema).optional(),
  avalibleDays: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    }),
  ),
  exceptionDates: z.array(
    z.object({
      date: z.date(),
      reason: z.string(),
    }),
  ),
  requiresApproval: z.boolean(),
  autoProvisionAccess: z.boolean(),
});

export type BookingTypeFormData = z.infer<typeof bookingTypeSchema>;
