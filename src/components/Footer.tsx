import Link from "next/link";
import { NAV_ITEMS, SOCIAL_LINKS, CONTACT_DETAILS } from "@/lib/constants";
import { SOCIAL_ICONS, CONTACT_ICONS } from "@/lib/social";

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
              {CONTACT_DETAILS.map((detail) => {
                const Icon = CONTACT_ICONS[detail.label];
                return (
                  <li key={detail.text}>
                    <a
                      href={detail.href}
                      className="group inline-flex items-center gap-2 text-zinc-400 transition-colors hover:text-[var(--color-primary)]"
                    >
                      {Icon && (
                        <Icon
                          className="h-4 w-4 shrink-0 text-[var(--color-primary)]/80 transition-colors group-hover:text-[var(--color-primary)]"
                          aria-hidden="true"
                        />
                      )}
                      <span>{detail.text}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 2: Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center text-zinc-400 transition-colors hover:text-[var(--color-primary)]"
                  >
                    {item.label}
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
              {SOCIAL_LINKS.map((social) => {
                const Icon = SOCIAL_ICONS[social.label];
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      aria-label={social.label}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-secondary)]/30 text-zinc-300 transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]"
                    >
                      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                    </a>
                  </li>
                );
              })}
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
