import { createClient } from "@/lib/supabase/server";

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("id, name, trim, is_available")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-xl font-bold text-brand-black">Inventory</h1>
      <p className="mt-2 text-sm text-gray-500">
        Editing (M4) is coming next — this is a read-only view of what&apos;s in Supabase.
      </p>
      <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Unit</th>
              <th className="px-4 py-3">Variant</th>
              <th className="px-4 py-3">Color</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Availability</th>
            </tr>
          </thead>
          <tbody>
            {vehicles?.map((v) => (
              <tr key={v.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{v.name}</td>
                <td className="px-4 py-3">{v.trim}</td>
                <td className="px-4 py-3">—</td>
                <td className="px-4 py-3">—</td>
                <td className="px-4 py-3">{v.is_available ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
