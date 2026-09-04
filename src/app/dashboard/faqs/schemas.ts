import { z } from "zod";

export const faqSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(1).max(200),
  answer: z.string().min(1).max(1000),
  is_active: z.boolean(),
});
