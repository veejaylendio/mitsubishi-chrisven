import { z } from "zod";

const PHONE_PATTERN = /^[0-9+\-()\s]{7,20}$/;

export const contactSchema = z
  .object({
    phone: z.string().trim().max(30).optional(),
    email: z.string().trim().max(200).optional(),
  })
  .transform(({ phone, email }) => ({
    phone: phone && phone.length > 0 ? phone : null,
    email: email && email.length > 0 ? email : null,
  }))
  .refine((data) => data.phone !== null || data.email !== null, {
    message: "Provide a phone number or an email address.",
    path: ["phone"],
  })
  .refine((data) => data.phone === null || PHONE_PATTERN.test(data.phone), {
    message: "Enter a valid phone number.",
    path: ["phone"],
  })
  .refine((data) => data.email === null || z.string().email().safeParse(data.email).success, {
    message: "Enter a valid email address.",
    path: ["email"],
  });

export const nameSchema = z.string().trim().min(2, "Name must be at least 2 characters.").max(80);

export const chatMessageSchema = z.object({
  sessionId: z.string().uuid(),
  body: z.string().trim().min(1, "Please enter a question.").max(1000),
});
