// ... existing imports ...

import { z } from "zod";

export const operatorSchema = z.object({
  _id: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});
export type Operator = z.infer<typeof operatorSchema>;
