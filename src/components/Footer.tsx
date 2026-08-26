// TikTok intentionally omitted until Chrisven has an account (per requirements.md).
const SOCIALS = [
  {
    label: "Instagram",
    href: "#",
    path: "M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm5.5-3.5a1 1 0 100 2 1 1 0 000-2z",
  },
  {
    label: "Facebook",
    href: "#",
    path: "M13.5 22v-8.5H16l.5-3.5h-3V7.8c0-1 .3-1.8 1.8-1.8H16.5V3c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.6H7v3.5h2.5V22h4z",
  },
];

export default function Footer() {
  return (
    <footer className="bg-brand-black px-6 py-10 text-brand-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-sm text-white/70">
          &copy; {new Date().getFullYear()} Chrisven Jay Romagos — Mitsubishi Motors Sales
        </p>
        <div className="flex gap-4">
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className="rounded-full bg-white/10 p-2 transition hover:bg-brand-red"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d={social.path} />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
