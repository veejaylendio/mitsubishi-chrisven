"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "./actions";
import { usePersistedBoolean } from "@/lib/hooks/usePersistedBoolean";

const STORAGE_KEY = "dashboard-sidebar-collapsed";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: (
      <path d="M3 11l9-7 9 7M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    ),
  },
  {
    href: "/dashboard/inquiries",
    label: "Inquiries",
    icon: <path d="M4 6h16v12H4zM4 7l8 6 8-6" />,
  },
  {
    href: "/dashboard/inventory",
    label: "Inventory",
    icon: (
      <>
        <path d="M4 16l1.5-5.5A2 2 0 0 1 7.4 9h9.2a2 2 0 0 1 1.9 1.5L20 16" />
        <rect x="3" y="16" width="18" height="4" rx="1.2" />
        <circle cx="7.5" cy="20" r="1.3" />
        <circle cx="16.5" cy="20" r="1.3" />
      </>
    ),
  },
  {
    href: "/dashboard/landing-content",
    label: "Page Configuration",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <line x1="9.5" y1="4" x2="9.5" y2="20" />
      </>
    ),
  },
  {
    href: "/dashboard/applications",
    label: "Applications",
    icon: (
      <>
        <path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
        <path d="M8 12h8M8 16h8M8 8h4" />
      </>
    ),
  },
  {
    href: "/dashboard/financing",
    label: "Financing Rates",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="9" cy="9.5" r="1.5" />
        <circle cx="15" cy="14.5" r="1.5" />
        <path d="M15.5 8.5l-7 7" />
      </>
    ),
  },
  {
    href: "/dashboard/faqs",
    label: "FAQs",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9.5a2.5 2.5 0 0 1 4.9.8c0 1.7-2.4 2-2.4 3.7" />
        <path d="M12 17.5h.01" />
      </>
    ),
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = usePersistedBoolean(
    STORAGE_KEY,
    false,
    () => window.innerWidth < 1280,
  );

  const toggle = () => setCollapsed(!collapsed);

  return (
    <aside
      className={`flex shrink-0 flex-col justify-between bg-brand-black transition-[width] duration-200 ease-out ${
        collapsed ? "w-[76px]" : "w-64"
      }`}
    >
      <div className={collapsed ? "flex flex-col items-center gap-4 px-0 py-5" : "px-3.5 py-5"}>
        <div className={collapsed ? "" : "mb-3.5 flex items-center gap-3 border-b border-white/10 pb-4.5"}>
          <button
            type="button"
            onClick={toggle}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="relative shrink-0 rounded-[10px] bg-brand-red"
          >
            <span className="flex h-10 w-10 items-center justify-center text-sm font-bold text-white">
              CR
            </span>
            {collapsed && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-[1.5px] border-brand-black bg-white">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </span>
            )}
          </button>
          {!collapsed && (
            <div>
              <p className="text-sm font-bold text-white">Chrisven Romagos</p>
              <p className="mt-0.5 text-[10px] font-semibold tracking-wider text-white/40">
                SALES DASHBOARD
              </p>
            </div>
          )}
        </div>

        {collapsed && <div className="h-px w-7 bg-white/10" />}

        <nav className={collapsed ? "flex flex-col items-center gap-1.5" : "mt-3.5 flex flex-col gap-1"}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-[10px] text-[13px] font-semibold transition ${
                  collapsed ? "h-11 w-11 justify-center" : "px-3 py-2.5"
                } ${
                  active
                    ? "bg-brand-red text-white shadow-[0_4px_12px_rgba(200,16,46,0.35)]"
                    : "text-white/75 hover:bg-white/5 hover:text-white"
                }`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={active ? "#ffffff" : "rgba(255,255,255,0.6)"}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  {item.icon}
                </svg>
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <form action={logout} className={collapsed ? "flex justify-center pb-5" : "px-3.5 pb-5"}>
        <button
          type="submit"
          title={collapsed ? "Log out" : undefined}
          className={`flex items-center gap-2.5 rounded-[10px] border border-white/10 text-[13px] font-semibold text-white/85 transition hover:bg-white/5 ${
            collapsed ? "h-11 w-11 justify-center" : "w-full px-3 py-2.5"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
          {!collapsed && "Log out"}
        </button>
      </form>
    </aside>
  );
}
