import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function InquiriesPage() {
  const supabase = await createClient();
  const { data: sessions } = await supabase
    .from("chat_sessions")
    .select("id, visitor_name, visitor_phone, visitor_email, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-xl font-bold text-brand-black">Inquiries</h1>
      <p className="mt-2 text-sm text-gray-500">Conversations started through the chatbot.</p>
      <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Started</th>
            </tr>
          </thead>
          <tbody>
            {sessions?.length ? (
              sessions.map((session) => (
                <tr key={session.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/inquiries/${session.id}`} className="font-medium text-brand-red hover:underline">
                      {session.visitor_name ?? "(no name yet)"}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{session.visitor_phone ?? "—"}</td>
                  <td className="px-4 py-3">{session.visitor_email ?? "—"}</td>
                  <td className="px-4 py-3 capitalize">{session.status}</td>
                  <td className="px-4 py-3">{new Date(session.created_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-3 text-gray-400" colSpan={5}>
                  No chat inquiries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
