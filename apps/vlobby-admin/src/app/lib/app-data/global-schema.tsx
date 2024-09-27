import { z } from "zod";

export const audienceSchema = z.object({
  type: z
    .string()
    .min(1, { message: "Please enter a valid name" })
    .default("demo"),
  entity: z
    .string()
    .min(1, { message: "Please enter a valid slug" })
    .regex(/^[a-z0-9.-]+$/, {
      message:
        "Slug must contain only lowercase letters, numbers, and .- characters",
    }),
});