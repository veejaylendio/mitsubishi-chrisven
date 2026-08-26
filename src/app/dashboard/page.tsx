import { createClient } from "@/lib/supabase/server";

async function getCounts() {
  const supabase = await createClient();

  const [vehicles, applications, chatSessions] = await Promise.all([
    supabase.from("vehicles").select("*", { count: "exact", head: true }),
    supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("chat_sessions")
      .select("*", { count: "exact", head: true })
      .eq("status", "open"),
  ]);

  return {
    vehicles: vehicles.count ?? 0,
    newApplications: applications.count ?? 0,
    openChats: chatSessions.count ?? 0,
  };
}

export default async function DashboardOverviewPage() {
  const counts = await getCounts();

  const cards = [
    { label: "Vehicles in inventory", value: counts.vehicles },
    { label: "New applications", value: counts.newApplications },
    { label: "Open chat inquiries", value: counts.openChats },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-brand-black">Overview</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg bg-white p-5 shadow-sm">
            <p className="text-3xl font-bold text-brand-red">{card.value}</p>
            <p className="mt-1 text-sm text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
