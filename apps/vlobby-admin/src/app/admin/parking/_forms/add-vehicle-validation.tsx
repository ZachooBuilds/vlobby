import { z } from "zod";

export const VehicleSchema = z.object({
  _id: z.string().optional(),
  rego: z.string().min(1, "Registration number is required"),
  make: z.string().min(1, "Vehicle make is required"),
  model: z.string().min(1, "Vehicle model is required"),
  color: z.string().min(1, "Vehicle color is required"),
  year: z.string().min(1, "Vehicle year is required"),
  spaceId: z.string().optional(),
  type: z.string().min(1, "Vehicle type is required"),
  drivers: z.array(z.object({ id: z.string() })).optional(),
  image: z
    .array(
      z.object({
        url: z.string().url(),
        storageId: z.string(),
      }),
    )
    .optional(),
  availableTo: z.enum(["space", "specific"]),
});

export type Vehicle = z.infer<typeof VehicleSchema>;
