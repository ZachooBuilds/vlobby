
import { z } from "zod";
import { audienceSchema } from "../../../../lib/app-data/global-schema";

export const announcementFormSchema = z
  .object({
    _id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    type: z.string().min(1, "Type is required"),
    content: z.string().min(1, "Content is required"),
    audience: z.array(audienceSchema).optional(),
    scheduleSend: z.boolean().default(false),
    dateTime: z
      .date()
      .optional()
      .refine(
        (date) => {
          if (date === null || date === undefined) return true;
          return date > new Date();
        },
        {
          message: "Scheduled date must be in the future",
        },
      ),
  })
  .refine(
    (data) => {
      if (data.scheduleSend && !data.dateTime) {
        return false;
      }
      return true;
    },
    {
      message: "Date and time are required when scheduling",
      path: ["dateTime"],
    },
  );

export type AnnouncementFormData = z.infer<typeof announcementFormSchema>;
