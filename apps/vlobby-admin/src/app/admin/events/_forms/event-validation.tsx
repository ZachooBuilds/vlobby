
import { z } from "zod";
import { audienceSchema } from "../../../lib/app-data/global-schema";

export const eventFormSchema = z
  .object({
    _id: z.string().optional(),
    title: z.string().min(1, "Event title is required"),
    startTime: z.date({
      required_error: "Start time is required",
      invalid_type_error: "That's not a valid date!",
    }),
    endTime: z.date({
      required_error: "End time is required",
      invalid_type_error: "That's not a valid date!",
    }),
    description: z.string().min(1, "Event description is required"),
    capacity: z.number().min(1, "Capacity must be at least 1"),
    audience: z.array(audienceSchema).optional(),
    files: z
      .array(
        z.object({
          url: z.string().url(),
          storageId: z.string(),
        }),
      )
      .optional(),
    isPublicPlace: z.boolean(),
    address: z.string().optional(),
    spaceId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.isPublicPlace) {
        return !!data.address;
      } else {
        return !!data.spaceId;
      }
    },
    {
      message:
        "Address is required for public places, Space is required for non-public places",
      path: ["address", "spaceId"],
    },
  );

export type EventFormData = z.infer<typeof eventFormSchema>;
