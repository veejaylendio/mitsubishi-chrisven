"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { faqSchema } from "./schemas";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");
  return { supabase, user };
}

function afterFaqsChange() {
  revalidatePath("/dashboard/faqs");
}

async function nextSortOrder(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase
    .from("faqs")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.sort_order ?? -1) + 1;
}

export async function createFaq(input: z.infer<typeof faqSchema>) {
  const { supabase } = await requireAdmin();
  const data = faqSchema.parse(input);
  const sort_order = await nextSortOrder(supabase);
  const { error } = await supabase.from("faqs").insert({ ...data, sort_order });
  if (error) throw error;
  afterFaqsChange();
}

export async function updateFaq(input: z.infer<typeof faqSchema>) {
  const { supabase } = await requireAdmin();
  const data = faqSchema.parse(input);
  if (!data.id) throw new Error("Missing FAQ id");
  const { id, ...rest } = data;
  const { error } = await supabase.from("faqs").update(rest).eq("id", id);
  if (error) throw error;
  afterFaqsChange();
}

export async function toggleFaqActive(id: string, isActive: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("faqs").update({ is_active: isActive }).eq("id", id);
  if (error) throw error;
  afterFaqsChange();
}

export async function deleteFaq(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw error;
  afterFaqsChange();
}
