'use client';
import { z } from "zod";

export const attendeeFormSchema = z
  .object({
    _id: z.string().optional(),
    numberOfAttendees: z.number().min(1).default(1),
    notes: z.string().optional(),
  })
  ;

export type AttendeeFormData = z.infer<typeof attendeeFormSchema>;


