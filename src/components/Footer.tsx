import { Globe, AtSign, Send, Share2, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const quickLinks: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Home", href: "/" },
  { label: "Locations", href: "/locations" },
  { label: "Our Story", href: "/our-story" },
  { label: "Landlords", href: "/landlords" },
  { label: "Contact", href: "/contact" },
];

const socialLinks: ReadonlyArray<{
  label: string;
  href: string;
  icon: IconComponent;
}> = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    icon: Globe as IconComponent,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: AtSign as IconComponent,
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/",
    icon: Send as IconComponent,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: Share2 as IconComponent,
  },
];

const contactDetails: ReadonlyArray<{
  icon: IconComponent;
  text: string;
  href: string;
}> = [
  {
    icon: MapPin,
    text: "42 Lower Main Road, Observatory, Cape Town",
    href: "https://maps.google.com/?q=Observatory+Cape+Town",
  },
  {
    icon: Phone,
    text: "+27 (0) 21 000 0000",
    href: "tel:+27210000000",
  },
  {
    icon: Mail,
    text: "info@southeastproperties.co.za",
    href: "mailto:info@southeastproperties.co.za",
  },
];

const currentYear: number = new Date().getFullYear();

export default function Footer(): React.ReactElement {
  return (
    <footer
      className="bg-zinc-950 text-zinc-300 border-t border-[var(--color-secondary)]/20"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only text-balance">
        SouthEast Properties footer
      </h2>

      <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-2xl font-semibold tracking-tight text-white"
            >
              <span className="text-[var(--color-primary)]">SouthEast</span>
              <span>Properties</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
              A premium South African real estate platform connecting discerning
              tenants, landlords, and co-living residents with exceptional
              properties across the region.
            </p>
            <ul className="space-y-2 pt-2 text-sm">
              {contactDetails.map(({ icon: Icon, text, href }) => (
                <li key={text}>
                  <a
                    href={href}
                    className="group inline-flex items-center gap-2 text-zinc-400 transition-colors hover:text-[var(--color-primary)]"
                  >
                    <Icon
                      className="h-4 w-4 shrink-0 text-[var(--color-primary)]/80 transition-colors group-hover:text-[var(--color-primary)]"
                      aria-hidden="true"
                    />
                    <span>{text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center text-zinc-400 transition-colors hover:text-[var(--color-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & compliance */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Legal &amp; Compliance
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-zinc-400">
              <li className="flex items-start gap-2">
                <span
                  className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]"
                  aria-hidden="true"
                />
                <span>
                  <span className="font-medium text-zinc-200">
                    PPRA Registered
                  </span>{" "}
                  &mdash; Property Practitioners Regulatory Authority (Act 22 of
                  2019)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]"
                  aria-hidden="true"
                />
                <span>
                  <span className="font-medium text-zinc-200">
                    FFC No: 2026/1234567/07
                  </span>{" "}
                  (Fidelity Fund Certificate)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]"
                  aria-hidden="true"
                />
                <span>
                  <span className="font-medium text-zinc-200">VAT No:</span>{" "}
                  4120-198-726
                </span>
              </li>
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-zinc-500">
              All property practitioners hold valid Fidelity Fund Certificates
              issued by the PPRA.
            </p>
          </div>

          {/* Column 4: Social */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Follow Us
            </h3>
            <p className="mt-5 text-sm text-zinc-400">
              Stay connected for new listings, market insights, and exclusive
              property opportunities.
            </p>
            <ul className="mt-5 flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-secondary)]/30 text-zinc-300 transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-[var(--color-secondary)]/20 pt-6">
          <div className="flex flex-col items-start justify-between gap-4 text-sm text-zinc-400 sm:flex-row sm:items-center">
            <p>
              &copy; {currentYear} SouthEast Properties. All rights reserved.
            </p>
            <p className="max-w-2xl sm:text-right">
              SouthEast Properties is a registered property practitioner
              governed by the Property Practitioners Act 22 of 2019.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
