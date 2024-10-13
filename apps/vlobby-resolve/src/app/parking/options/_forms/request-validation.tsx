import { z } from 'zod';

export const pickupSchema = z.object({
  _id: z.string().optional(),
  requestType: z.string().min(1, 'Level name is required'),
  vehicleId: z.string().min(1, 'Vehicle is required'),
  notes: z.string().optional(),
});

export type PickupRequest = z.infer<typeof pickupSchema>;

export const dropoffSchema = z
  .object({
    _id: z.string().optional(),
    requestType: z.string().min(1, 'Level name is required'),
    vehicleId: z.string().min(1, 'Vehicle is required'),
    isCasualParking: z.boolean(),
    parkTypeId: z.string().optional(),
    allocationId: z.string().optional(),
    evidenceImages: z
      .array(
        z.object({
          storageId: z.string().min(1, 'Image is required'),
          url: z.string().min(1, 'Description is required'),
        })
      )
      .optional(),
    parkId: z.string().min(1, 'Parking location is required'),
  })
  .refine(
    (data) => {
      if (!data.isCasualParking) {
        return data.allocationId !== undefined && data.allocationId !== '';
      }
      if (data.isCasualParking) {
        return data.parkTypeId !== undefined && data.parkTypeId !== '';
      }
      return true;
    },
    {
      message:
        'Allocation selection is required when not casual parking, and park type is required for casual parking',
      path: ['allocationId', 'parkTypeId'],
    }
  );

export type DropoffRequest = z.infer<typeof dropoffSchema>;
