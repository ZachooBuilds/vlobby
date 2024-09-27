import { z } from "zod";

export const Stage1Schema = z.object({
  tenantName: z
    .string()
    .min(1, { message: "Please enter a valid name" })
    .default("demo"),
  domainSlug: z
    .string()
    .min(1, { message: "Please enter a valid slug" })
    .regex(/^[a-z0-9.-]+$/, {
      message:
        "Slug must contain only lowercase letters, numbers, and .- characters",
    }),
});

export const Stage2Schema = z.object({
  siteName: z.string().min(3, "Please create a meaningful name"),
  floors: z.number().min(1, "Floors must be at least 1").optional(),
  namedFloors: z
    .array(
      z.object({
        index: z.number().min(-100, "No way your that deep dude!"),
        name: z.string().min(1, "Floor name is required"),
      }),
    )
    .optional(),
  siteDescription: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
});

export const MultiStageFormSchema = z.object({
  stage1: Stage1Schema,
  stage2: Stage2Schema,
});

export type MultiStageFormData = z.infer<typeof MultiStageFormSchema>;
