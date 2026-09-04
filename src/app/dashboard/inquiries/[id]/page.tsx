import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function InquiryDetailPage(props: PageProps<"/dashboard/inquiries/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: session }, { data: messages }] = await Promise.all([
    supabase
      .from("chat_sessions")
      .select("id, visitor_name, visitor_phone, visitor_email, status, created_at")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("chat_messages")
      .select("id, sender, body, created_at")
      .eq("session_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (!session) notFound();

  return (
    <div>
      <Link href="/dashboard/inquiries" className="text-xs font-semibold text-brand-red hover:underline">
        ← Back to Inquiries
      </Link>

      <h1 className="mt-3 text-xl font-bold text-brand-black">
        {session.visitor_name ?? "(no name yet)"}
      </h1>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
        <span>Phone: {session.visitor_phone ?? "—"}</span>
        <span>Email: {session.visitor_email ?? "—"}</span>
        <span className="capitalize">Status: {session.status}</span>
        <span>Started: {new Date(session.created_at).toLocaleString()}</span>
      </div>

      <div className="mt-6 space-y-3 rounded-lg bg-white p-5 shadow-sm">
        {messages?.length ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "visitor" ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[70%]">
                <p
                  className={`rounded-2xl px-3 py-2 text-sm ${
                    message.sender === "visitor"
                      ? "bg-brand-red text-white"
                      : "bg-gray-100 text-brand-black"
                  }`}
                >
                  {message.body}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wide text-gray-400">
                  {message.sender} · {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">No messages yet.</p>
        )}
      </div>
    </div>
  );
}
