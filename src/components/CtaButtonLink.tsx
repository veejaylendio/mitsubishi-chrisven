import type { CtaButton } from "@/lib/types";

const STYLE_CLASS: Record<CtaButton["style"], string> = {
  primary: "bg-brand-red text-white border border-brand-red hover:bg-brand-red-dark",
  secondary: "bg-brand-black text-white border border-brand-black hover:bg-black/80",
  outline: "border border-white text-white hover:bg-white hover:text-brand-black",
  ghost: "text-white underline-offset-4 hover:underline",
};

const SIZE_CLASS: Record<CtaButton["size"], string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function CtaButtonLink({ button }: { button: CtaButton }) {
  return (
    <a
      href={button.url}
      className={`inline-flex w-fit items-center justify-center font-semibold tracking-wide transition ${STYLE_CLASS[button.style]} ${SIZE_CLASS[button.size]}`}
    >
      {button.label}
    </a>
  );
}
