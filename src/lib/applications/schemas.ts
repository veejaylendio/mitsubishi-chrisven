import { z } from "zod";

const PHONE_PATTERN = /^[0-9+\-()\s]{7,20}$/;

export const applicationSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name.").max(120),
    phone: z.string().trim().regex(PHONE_PATTERN, "Enter a valid phone number."),
    email: z
      .string()
      .trim()
      .max(200)
      .optional()
      .transform((v) => (v && v.length > 0 ? v : null))
      .refine((v) => v === null || z.string().email().safeParse(v).success, {
        message: "Enter a valid email address.",
      }),
    address: z.string().trim().max(300).optional(),
    vehicleId: z
      .string()
      .uuid()
      .optional()
      .transform((v) => v ?? null),
    financingType: z.enum(["cash", "loan"]),
    employer: z.string().trim().max(150).optional(),
    monthlyIncome: z.coerce.number().positive().optional(),
    downPayment: z.coerce.number().nonnegative().optional(),
    message: z.string().trim().max(1000).optional(),
  })
  .transform((data) => ({
    ...data,
    address: data.address && data.address.length > 0 ? data.address : null,
    employer: data.employer && data.employer.length > 0 ? data.employer : null,
    message: data.message && data.message.length > 0 ? data.message : null,
    monthlyIncome: data.monthlyIncome ?? null,
    downPayment: data.downPayment ?? null,
  }))
  .refine(
    (data) => data.financingType !== "loan" || !!data.employer,
    { message: "Employer is required for financing applications.", path: ["employer"] },
  )
  .refine(
    (data) => data.financingType !== "loan" || data.monthlyIncome !== null,
    { message: "Monthly income is required for financing applications.", path: ["monthlyIncome"] },
  );

export type ApplicationInput = z.input<typeof applicationSchema>;
