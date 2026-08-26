import Link from "next/link";

const LINKS = [
  { href: "/#inventory", label: "Vehicles" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/apply", label: "Application Form" },
  { href: "/calculator", label: "Financing Calculator" },
];

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-brand-black px-6 py-4 text-brand-white shadow-md">
      <Link href="/" className="text-lg font-bold tracking-wide">
        Chrisven Romagos <span className="text-brand-red">| Mitsubishi</span>
      </Link>
      <nav className="hidden gap-6 text-sm font-medium sm:flex">
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
    </header>
  );
}
