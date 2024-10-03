'use client';
import { z } from 'zod';

// Booking /////////////////////////////////////////////////////////////////
export const BookingFormSchema = z.object({
  _id: z.string().optional(),
  facilityId: z.string(),
  bookingTypeId: z.string().min(1, "Booking type is required"),
  notes: z.string().optional(),
  userId: z.string().min(1, "User is required"),
  date: z
    .date()
    .refine(
      (date) => {
        if (date === null || date === undefined) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      {
        message: "Scheduled date must be today or in the future",
      },
    ),
  slots: z
    .array(
      z.object({
        slotIndex: z.number(),
        slotTime: z.date(),
      }),
    )
    .min(1, "At least one slot must be selected"),
});

export type BookingFormData = z.infer<typeof BookingFormSchema>;
