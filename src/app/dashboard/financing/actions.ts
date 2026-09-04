"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { bankRateSchema } from "./schemas";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");
  return { supabase, user };
}

function afterBankRatesChange() {
  revalidatePath("/dashboard/financing");
  revalidatePath("/calculator");
}

export async function createBankRate(input: z.infer<typeof bankRateSchema>) {
  const { supabase } = await requireAdmin();
  const data = bankRateSchema.parse(input);
  const { error } = await supabase.from("bank_rates").insert(data);
  if (error) throw error;
  afterBankRatesChange();
}

export async function updateBankRate(input: z.infer<typeof bankRateSchema>) {
  const { supabase } = await requireAdmin();
  const data = bankRateSchema.parse(input);
  if (!data.id) throw new Error("Missing bank rate id");
  const { id, ...rest } = data;
  const { error } = await supabase.from("bank_rates").update(rest).eq("id", id);
  if (error) throw error;
  afterBankRatesChange();
}

export async function toggleBankRateActive(id: string, isActive: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("bank_rates").update({ is_active: isActive }).eq("id", id);
  if (error) throw error;
  afterBankRatesChange();
}

export async function deleteBankRate(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("bank_rates").delete().eq("id", id);
  if (error) throw error;
  afterBankRatesChange();
}
