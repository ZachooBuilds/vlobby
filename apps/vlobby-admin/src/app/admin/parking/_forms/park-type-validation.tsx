// ... existing imports ...

import { z } from "zod";

export const pricingConditionSchema = z.object({
  _id: z.string().optional(),
  startMinutes: z.number().min(0, "Start minutes must be 0 or greater"),
  endMinutes: z.number().min(0, "End minutes must be 0 or greater").nullable(),
  interval: z.number().min(1, "Interval must be at least 1 minute"),
  rate: z.number().min(0, "Rate must be 0 or greater"),
  isFinalCondition: z.boolean().default(false),
});

export const parkTypeSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Park type name is required"),
  description: z.string().optional(),
  pricingConditions: z
    .array(pricingConditionSchema)
    .min(1, "At least one pricing condition is required"),
});

export type PricingCondition = z.infer<typeof pricingConditionSchema>;
export type ParkType = z.infer<typeof parkTypeSchema>;

