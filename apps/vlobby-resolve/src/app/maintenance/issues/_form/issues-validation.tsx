'use client';

import { z } from 'zod';

export const issueFormSchema = z.object({
  _id: z.string().optional(),
  locationId: z.string().optional(),
  spaceId: z.string().optional(),
  facilityId: z.string().optional(),
  floor: z.string().optional(),
  buildingId: z.string().optional(),
  priority: z.string(),
  issueType: z.string(),
  assignedToId: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  status: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  tags: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    })
  ),
  followUpDate: z.date().optional(),
  files: z
    .array(
      z.object({
        url: z.string().url(),
        storageId: z.string(),
      })
    )
    .optional(),
});

export type IssueFormData = z.infer<typeof issueFormSchema>;
