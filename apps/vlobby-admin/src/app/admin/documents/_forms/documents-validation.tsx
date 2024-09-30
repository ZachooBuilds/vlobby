
import { z } from "zod";
import { audienceSchema } from "../../../lib/app-data/global-schema";

export const fileSchema = z.object({
  folderId: z.string().min(1, "Folder is required"),
  files: z
    .array(
      z.object({
        url: z.string().url(),
        storageId: z.string(),
        type: z.string(),
        name: z.string(),
      }),
    )
    .min(1, "A cover image is required"),
});

export type FileFormValues = z.infer<typeof fileSchema>;

export const folderSchema = z.object({
  name: z.string().min(1, { message: "Folder name is required" }),
  audience: z.array(audienceSchema).optional(),
});

export type FolderFormValues = z.infer<typeof folderSchema>;
