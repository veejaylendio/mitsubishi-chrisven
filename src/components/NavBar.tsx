import Image from "next/image";
import Link from "next/link";

const LINKS = [
  { href: "/#inventory", label: "Vehicles" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/apply", label: "Application Form" },
  { href: "/calculator", label: "Financing Calculator" },
];

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between bg-brand-black px-6 text-brand-white shadow-md">
      <Link href="/" className="flex items-center gap-3 text-lg font-bold tracking-wide">
        <Image
          src="/mitsubishi-full-white.png"
          alt="Mitsubishi Motors"
          width={2394}
          height={2300}
          className="h-18 w-auto"
          loading="eager"
          fetchPriority="high"
        />
        Chrisven Romagos
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
