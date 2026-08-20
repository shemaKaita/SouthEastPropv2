import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary";

interface ButtonProps extends ComponentPropsWithoutRef<"a"> {
  variant?: Variant;
  href?: string;
  children: ReactNode;
}

/**
 * Lightweight pill-style button used by the Hero bento grid.
 * Renders as a Next.js <Link> when `href` is provided, otherwise an <a>.
 */
export default function Button({
  variant = "primary",
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-2xl hover:[&>svg]:translate-x-1 active:translate-y-0 active:shadow-lg sm:px-8 sm:text-base";

  const styles: Record<Variant, string> = {
    primary:
      "bg-[var(--accent-yellow)] text-[#091229] shadow-lg hover:bg-[var(--accent-yellow-hover)] hover:shadow-2xl",
    secondary:
      "border-2 border-slate-900/15 bg-white text-[#091229] hover:bg-[#091229] hover:text-white hover:border-[#091229] hover:[&_svg]:text-[var(--accent-yellow)] dark:border-white/20 dark:bg-navy-800 dark:text-white dark:hover:bg-navy-700 dark:hover:border-[var(--accent-yellow)] dark:hover:text-white",
  };

  const cls = `${base} ${styles[variant]} ${className}`;

  const content = (
    <>
      {children}
      {variant === "primary" ? (
        <ArrowRight className="h-4 w-4" />
      ) : (
        <Phone className="h-4 w-4" />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls} {...(props as object)}>
        {content}
      </Link>
    );
  }
  return (
    <a className={cls} {...props}>
      {content}
    </a>
  );
}
