"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const LINKS = [
  { href: "/#inventory", label: "Vehicles" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/apply", label: "Apply" },
  { href: "/calculator", label: "Financing" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-black text-brand-white shadow-md">
      <div className="flex h-20 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 text-lg font-bold tracking-wide" onClick={() => setOpen(false)}>
          <Image
            src="/mitsubishi-full-white.png"
            alt="Mitsubishi Motors"
            width={2394}
            height={2300}
            className="h-18 w-auto"
            loading="eager"
            fetchPriority="high"
          />
        </Link>
        <nav className="hidden gap-6 text-sm font-bold uppercase tracking-wider sm:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/80 transition hover:text-brand-red"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center sm:hidden"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/10 px-6 pb-4 text-sm font-bold uppercase tracking-wider sm:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-white/5 py-3 text-white/80 transition hover:text-brand-red"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
