import { z } from "zod";

export const pickupSchema = z.object({
  _id: z.string().optional(),
  requestType: z.string().min(1, "Level name is required"),
  vehicleId: z.string().min(1, "Vehicle is required"),
  notes: z.string().optional(),
});

export type PickupRequest = z.infer<typeof pickupSchema>;


export const dropoffSchema = z.object({
  _id: z.string().optional(),
  requestType: z.string().min(1, "Level name is required"),
  vehicleId: z.string().min(1, "Vehicle is required"),
  isCasualParking: z.boolean().optional(),
  parkTypeId: z.string().optional(),
  allocationId: z.string().optional(),
  evidenceImages: z.array(z.object({
    storageId: z.string().min(1, "Image is required"),
    url: z.string().min(1, "Description is required"),
  })).optional(),
  parkId: z.string().min(1, "Parking location is required"),
});

export type DropoffRequest = z.infer<typeof dropoffSchema>;
