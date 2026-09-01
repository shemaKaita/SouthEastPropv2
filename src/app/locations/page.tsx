import type { Metadata } from "next";
import Link from "next/link";
import PropertyMap from "@/components/PropertyMap";
import SectionLabel from "@/components/ui/SectionLabel";
import { getAllProperties } from "@/lib/properties";
import { MapPin, BedDouble, Bath, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Explore our property listings across Observatory and Woodstock in Cape Town. Find your next home on our interactive map.",
  alternates: {
    canonical: "/locations",
  },
};

export default async function LocationsPage() {
  const properties = await getAllProperties();
  return (
    <section className="bg-[var(--color-background)]">
      {/* Warm up map tile hosts before Leaflet requests tiles: saves the
          DNS + TLS round-trips on the first ~15 tile fetches. React hoists
          these into <head>. */}
      <link rel="preconnect" href="https://tile.openstreetmap.org" />
      <link rel="preconnect" href="https://basemaps.cartocdn.com" />
      <link rel="dns-prefetch" href="https://basemaps.cartocdn.com" />
      <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        {/* Section header */}
        <div className="max-w-2xl">
          <SectionLabel>
            <MapPin className="h-3.5 w-3.5" />
            Explore Cape Town
          </SectionLabel>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-[var(--color-foreground)] sm:text-4xl lg:text-5xl">
            Property Locations
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-secondary)] sm:text-base">
            Discover our curated properties in Observatory and Woodstock — two
            of Cape Town&apos;s most vibrant and sought-after neighbourhoods.
            Click on a marker to view property details.
          </p>
        </div>

        {/* Map + property list sidebar */}
        <div className="mt-10 grid grid-cols-1 gap-8 sm:mt-12 lg:grid-cols-[1fr_360px]">
          {/* Map */}
          <div className="h-[400px] overflow-hidden rounded-2xl border border-[var(--color-secondary)]/20 shadow-lg sm:h-[460px] md:h-[480px] lg:h-[560px] xl:h-[640px]">
            <PropertyMap properties={properties} />
          </div>

          {/* Property list sidebar */}
          <aside aria-label="Property list" className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold tracking-[0.15em] text-[var(--color-secondary)] uppercase">
              All Listings ({properties.length})
            </h2>
            <ul role="list" className="flex flex-col gap-4">
              {properties.map((property) => (
                <li key={property.slug}>
                  <Link
                    href={`/properties/${property.slug}`}
                    className="group flex flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--brand-navy)]/40 hover:shadow-md dark:border-white/10 dark:bg-[var(--bg-surface)] dark:hover:border-amber-400/30"
                  >
                    <span className="inline-flex w-fit items-center rounded-full bg-[var(--brand-navy)] px-2.5 py-0.5 text-[9px] font-semibold tracking-[0.15em] text-[var(--accent-yellow)] uppercase ring-1 ring-white/10">
                      {property.badge}
                    </span>
                    <span className="mt-2 text-sm leading-snug font-semibold text-[var(--color-foreground)]">
                      {property.title}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 text-xs text-[var(--color-secondary)]">
                      <MapPin
                        className="h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      {property.location}
                    </span>
                    <span className="mt-3 flex items-center justify-between">
                      <span className="text-base font-bold text-[var(--text-primary)]">
                        {property.price}
                        <span className="ml-1 text-[10px] font-medium text-[var(--color-secondary)]">
                          {property.priceLabel}
                        </span>
                      </span>
                      <span className="flex items-center gap-3 text-xs text-[var(--color-foreground)]/70">
                        <span className="flex items-center gap-1">
                          <BedDouble
                            className="h-3.5 w-3.5 text-[var(--text-primary)]"
                            aria-hidden="true"
                          />
                          {property.beds}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath
                            className="h-3.5 w-3.5 text-[var(--text-primary)]"
                            aria-hidden="true"
                          />
                          {property.baths}
                        </span>
                      </span>
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold tracking-[0.15em] text-[var(--text-primary)] uppercase transition-all group-hover:gap-2">
                      View Details
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
