import { z } from "zod";

// Update the schema to match the new file structure
export const feedPostSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  status: z.enum(["pending", "approved", "rejected"]),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        storageId: z.string(),
      }),
    )
    .default([]),
  isAdmin: z.boolean().optional(),
  authorId: z.string().optional(),
  _creationTime: z.string().optional(),
});

export type FeedPostFormData = z.infer<typeof feedPostSchema>;
