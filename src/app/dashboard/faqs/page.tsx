import { createClient } from "@/lib/supabase/server";
import FaqManager from "./FaqManager";

export default async function FaqsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("faqs")
    .select("id, question, answer, sort_order, is_active")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="text-xl font-bold text-brand-black">FAQs</h1>
      <p className="mt-2 text-sm text-gray-500">
        These questions appear as quick-reply buttons in the chatbot. Only active FAQs are shown to
        visitors.
      </p>
      <div className="mt-6">
        <FaqManager initialFaqs={data ?? []} />
      </div>
    </div>
  );
}
