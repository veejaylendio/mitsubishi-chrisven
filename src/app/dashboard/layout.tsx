import Link from "next/link";
import { logout } from "./actions";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/inquiries", label: "Inquiries" },
  { href: "/dashboard/inventory", label: "Inventory" },
  { href: "/dashboard/landing-content", label: "Landing Content" },
  { href: "/dashboard/applications", label: "Applications" },
];

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="flex w-56 flex-col justify-between bg-brand-black text-brand-white">
        <div>
          <div className="border-b border-white/10 px-4 py-5">
            <p className="text-sm font-semibold">Chrisven Romagos</p>
            <p className="text-xs text-white/60">Sales Dashboard</p>
          </div>
          <nav className="flex flex-col py-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm text-white/80 hover:bg-brand-red hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <form action={logout} className="border-t border-white/10 p-4">
          <button
            type="submit"
            className="w-full rounded-md bg-white/10 py-2 text-sm hover:bg-white/20"
          >
            Log out
          </button>
        </form>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
