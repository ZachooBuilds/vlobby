import { z } from "zod";

// Schemas
export const locationSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Location name is required"),
});

export type Location = z.infer<typeof locationSchema>;

export const levelSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Level name is required"),
  locationId: z.string().min(1, "Location is required"),
  image: z.array(
    z.object({
      url: z.string().url(),
      storageId: z.string(),
    }),
  ),
});

export type Level = z.infer<typeof levelSchema>;
export const parkingSpotSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Parking spot name is required"),
  levelId: z.string(),
  x: z.number(),
  y: z.number(),
});
export type ParkingSpot = z.infer<typeof parkingSpotSchema>;
