import { createClient } from "@/lib/supabase/server";

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const { data: applications } = await supabase
    .from("applications")
    .select("id, full_name, phone, email, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-xl font-bold text-brand-black">Applications</h1>
      <p className="mt-2 text-sm text-gray-500">
        Submissions from the public application form (M5) will land here.
      </p>
      <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications?.length ? (
              applications.map((a) => (
                <tr key={a.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{a.full_name}</td>
                  <td className="px-4 py-3">{a.phone}</td>
                  <td className="px-4 py-3">{a.email}</td>
                  <td className="px-4 py-3">{a.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-3 text-gray-400" colSpan={4}>
                  No applications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
