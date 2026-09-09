import { z } from "zod";

const PHONE_PATTERN = /^[0-9+\-()\s]{7,20}$/;
const requiredText = (label: string, max = 200) =>
  z.string().trim().min(1, `${label} is required.`).max(max);
const optionalText = (max = 200) => z.string().trim().max(max).optional();

const personSchema = z.object({
  lastName: requiredText("Last name"),
  firstName: requiredText("First name"),
  middleName: optionalText(),
  birthday: requiredText("Birthday"),
  birthplace: requiredText("Birthplace"),
  civilStatus: requiredText("Civil status"),
  presentAddress: requiredText("Present address", 300),
  permanentAddress: requiredText("Permanent address", 300),
  residenceOwnership: requiredText("Rented or owned"),
  yearsInAddress: requiredText("Years in address"),
  email: z.string().trim().email("Enter a valid email address.").optional().or(z.literal("")),
  phone: z.string().trim().regex(PHONE_PATTERN, "Enter a valid contact number."),
});

const incomeSchema = z.object({
  employerBusiness: requiredText("Employer or business"),
  employerBusinessPhone: z.string().trim().regex(PHONE_PATTERN, "Enter a valid employer telephone number."),
  employerBusinessEmail: z.string().trim().email("Enter a valid company email address."),
  employerBusinessAddress: requiredText("Employer or business address", 300),
  position: requiredText("Position"),
  yearsInEmployment: requiredText("Years in employment or business"),
  grossMonthlyIncome: z.string().trim().regex(/^\d+(\.\d{1,2})?$/, "Enter a valid gross monthly income."),
});

const coMakerSchema = personSchema.extend({
  relationship: requiredText("Relationship to borrower"),
  hasIncome: z.boolean(),
  dependents: optionalText(),
  tin: optionalText(),
  mothersMaidenName: optionalText(),
  employerBusiness: optionalText(),
  employerBusinessPhone: optionalText(30),
  employerBusinessEmail: z.string().trim().email("Enter a valid company email address.").optional().or(z.literal("")),
  employerBusinessAddress: optionalText(300),
  position: optionalText(),
  yearsInEmployment: optionalText(),
  grossMonthlyIncome: optionalText(30),
}).superRefine((data, ctx) => {
  if (!data.hasIncome) return;
  for (const field of [
    "dependents",
    "tin",
    "mothersMaidenName",
    "employerBusiness",
    "employerBusinessPhone",
    "employerBusinessEmail",
    "employerBusinessAddress",
    "position",
    "yearsInEmployment",
    "grossMonthlyIncome",
  ] as const) {
    if (!data[field]) ctx.addIssue({ code: "custom", path: [field], message: "This field is required." });
  }
});

export const applicationSchema = z
  .object({
    principalBorrower: personSchema.extend({
      dependents: requiredText("Dependents"),
      tin: requiredText("TIN"),
      mothersMaidenName: requiredText("Mother's maiden name"),
      ...incomeSchema.shape,
    }),
    coMakers: z.array(coMakerSchema),
    vehicleId: z
      .string()
      .uuid()
      .optional()
      .transform((v) => v ?? null),
    message: optionalText(1000),
  })
  .transform((data) => ({
    ...data,
    fullName: `${data.principalBorrower.firstName} ${data.principalBorrower.lastName}`,
    phone: data.principalBorrower.phone,
    email: data.principalBorrower.email || null,
    address: data.principalBorrower.presentAddress,
    financingType: "loan" as const,
    employer: data.principalBorrower.employerBusiness,
    monthlyIncome: Number(data.principalBorrower.grossMonthlyIncome),
    downPayment: null,
    message: data.message && data.message.length > 0 ? data.message : null,
  }))
  .refine(
    (data) => data.principalBorrower.civilStatus.toLowerCase() !== "married" || data.coMakers.length > 0,
    { message: "A co-maker is required if the principal borrower is married.", path: ["coMakers"] },
  );

export type ApplicationInput = z.input<typeof applicationSchema>;
