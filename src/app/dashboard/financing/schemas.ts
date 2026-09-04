import { z } from "zod";

export const bankRateSchema = z
  .object({
    id: z.string().optional(),
    bank_name: z.string().min(1).max(100),
    interest_rate: z.coerce.number().positive().max(100),
    min_term_months: z.coerce.number().int().positive(),
    max_term_months: z.coerce.number().int().positive(),
    notes: z.string().max(500).optional().nullable(),
    is_active: z.boolean(),
  })
  .refine((data) => data.max_term_months >= data.min_term_months, {
    message: "Max term must be greater than or equal to min term",
    path: ["max_term_months"],
  });
