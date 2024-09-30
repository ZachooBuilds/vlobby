import { z } from "zod";

export const AllocationSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Registration number is required"),
  description: z.string().optional(),
  allocatedParks: z.number().min(1, "Vehicle model is required"),
  spaceId: z.string().optional(),
  rentedSpaceId: z.string().optional(),
  parkTypeId: z.string(),
});

export type Allocation = z.infer<typeof AllocationSchema>;
