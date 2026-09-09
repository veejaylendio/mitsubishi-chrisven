"use server";

import { createClient } from "@/lib/supabase/server";
import { applicationSchema, type ApplicationInput } from "./schemas";
import { notifyDiscordApplication } from "./discord";

export async function submitApplication(
  input: ApplicationInput,
): Promise<{ error: string } | { ok: true }> {
  const parsed = applicationSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }
  const data = parsed.data;

  const supabase = await createClient();

  let vehicleLabel: string | null = null;
  if (data.vehicleId) {
    const { data: vehicle } = await supabase
      .from("vehicles")
      .select("name, trim")
      .eq("id", data.vehicleId)
      .maybeSingle();
    vehicleLabel = vehicle ? [vehicle.name, vehicle.trim].filter(Boolean).join(" ") : null;
  }

  // Anon submitters have INSERT-only access to applications (no SELECT policy),
  // so this must not chain .select() — that would require RLS read-back access.
  const { error } = await supabase.from("applications").insert({
    full_name: data.fullName,
    phone: data.phone,
    email: data.email,
    address: data.address,
    vehicle_id: data.vehicleId,
    financing_type: data.financingType,
    employer: data.employer,
    monthly_income: data.monthlyIncome,
    down_payment: data.downPayment,
    message: JSON.stringify({
      principalBorrower: data.principalBorrower,
      coMakers: data.coMakers,
      notes: data.message,
    }),
  });
  if (error) return { error: "Something went wrong. Please try again." };

  await notifyDiscordApplication({
    fullName: data.fullName,
    phone: data.phone,
    email: data.email,
    financingType: data.financingType,
    vehicleLabel,
  });

  return { ok: true };
}
