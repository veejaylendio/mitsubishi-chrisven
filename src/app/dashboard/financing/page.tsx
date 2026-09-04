import { createClient } from "@/lib/supabase/server";
import BankRatesManager from "./BankRatesManager";

export default async function FinancingPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bank_rates")
    .select("id, bank_name, interest_rate, min_term_months, max_term_months, notes, is_active")
    .order("bank_name", { ascending: true });

  return (
    <div>
      <h1 className="text-xl font-bold text-brand-black">Financing Rates</h1>
      <p className="mt-2 text-sm text-gray-500">
        These rates power the public financing calculator at /calculator. Only active banks are
        shown to visitors.
      </p>
      <div className="mt-6">
        <BankRatesManager initialRates={data ?? []} />
      </div>
    </div>
  );
}
