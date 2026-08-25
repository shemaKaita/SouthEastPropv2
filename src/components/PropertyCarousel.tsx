"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BedDouble,
  Bath,
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { Property } from "@/types/property";
import SectionLabel from "@/components/ui/SectionLabel";

function formatBedCount(count: number): string {
  return `${count} ${count === 1 ? "Bed" : "Beds"}`;
}

function formatBathCount(count: number): string {
  return `${count} ${count === 1 ? "Bath" : "Baths"}`;
}

export default function PropertyCarousel({
  properties,
}: {
  properties: Property[];
}): React.ReactElement {
  const scrollRef = useRef<HTMLUListElement>(null);

  const scroll = (dir: "left" | "right"): void => {
    const ul = scrollRef.current;
    if (!ul) return;
    const cardWidth =
      ul.querySelector("li")?.getBoundingClientRect().width ?? 340;
    const gap = 24;
    ul.scrollBy({
      left: dir === "left" ? -(cardWidth + gap) : cardWidth + gap,
      behavior: "smooth",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scroll("left");
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scroll("right");
    }
  };
  return (
    <section
      aria-labelledby="featured-properties-heading"
      className="w-full bg-[var(--color-background)] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <SectionLabel>Curated Selection</SectionLabel>
            <h2
              id="featured-properties-heading"
              className="mt-3 text-3xl font-semibold tracking-tight text-balance text-[var(--color-foreground)] sm:text-4xl lg:text-5xl"
            >
              Featured Properties
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-secondary)] sm:text-base">
              Hand-picked homes across Cape Town&apos;s most sought-after
              neighbourhoods. Swipe to explore our latest listings.
            </p>
          </div>

          <Link
            href="/locations"
            className="group inline-flex items-center gap-2 self-start border-b-2 border-[var(--color-primary)] pb-1 text-xs font-semibold tracking-[0.2em] whitespace-nowrap text-[var(--color-primary)] uppercase transition-all duration-200 hover:gap-3 hover:border-[var(--accent-yellow)] hover:text-[var(--accent-yellow)] active:gap-2 sm:self-auto dark:border-[var(--accent-yellow)] dark:text-[var(--accent-yellow)] dark:hover:border-white dark:hover:text-white"
          >
            <span className="transition-colors">View All</span>
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-active:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Carousel */}
        <div
          className="relative -mx-6 w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-yellow)] focus-visible:ring-offset-2 sm:-mx-8 lg:-mx-10"
          role="region"
          aria-label="Featured property listings"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {/* Right-edge fade mask — scroll affordance */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-12 bg-gradient-to-l from-[var(--bg-base)] to-transparent sm:w-24"
          />
          <ul
            ref={scrollRef}
            className="flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto scroll-smooth px-4 pb-8 sm:gap-6"
            style={{ scrollbarWidth: "none" }}
          >
            {properties.map((property) => (
              <li
                key={property.slug}
                className="shrink-0 basis-[85%] snap-start sm:basis-[45%] lg:basis-[31%]"
              >
                <Link
                  href={`/properties/${property.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--accent-yellow)]/60 hover:shadow-xl active:translate-y-0 active:shadow-md dark:border-white/10 dark:bg-[var(--bg-surface)]"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/2] w-full overflow-hidden bg-zinc-100">
                    <Image
                      src={property.featuredImage}
                      alt={property.title}
                      width={600}
                      height={400}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 80vw, 340px"
                    />
                    {/* Badge */}
                    <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-[var(--brand-navy)]/85 px-3 py-1 text-[10px] font-semibold tracking-[0.15em] text-[var(--accent-yellow)] uppercase shadow-md ring-1 ring-white/10 backdrop-blur-sm">
                      {property.badge}
                    </span>
                    {/* Price Tag */}
                    <div className="absolute right-3 bottom-3 inline-flex items-baseline gap-1 rounded-full bg-white/95 px-3 py-1.5 text-sm font-semibold text-[var(--text-primary)] shadow-md backdrop-blur-sm dark:bg-[var(--bg-surface)]/95">
                      <span>{property.price}</span>
                      <span className="text-[10px] font-medium text-[var(--color-secondary)]">
                        {property.priceLabel}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-secondary)]">
                      <MapPin
                        className="h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="truncate">{property.location}</span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-2 text-base leading-snug font-semibold text-[var(--color-foreground)] sm:text-lg">
                      {property.title}
                    </h3>

                    {/* Divider */}
                    <div
                      aria-hidden="true"
                      className="my-4 h-px w-full bg-[var(--color-secondary)]/20"
                    />

                    {/* Stats */}
                    <div className="mt-auto flex items-center gap-5 text-xs font-medium text-[var(--color-foreground)]/80">
                      <div
                        className="flex items-center gap-1.5"
                        aria-label={formatBedCount(property.beds)}
                      >
                        <BedDouble
                          className="h-4 w-4 text-[var(--color-primary)]"
                          aria-hidden="true"
                        />
                        <span>{property.beds}</span>
                      </div>
                      <div
                        className="flex items-center gap-1.5"
                        aria-label={formatBathCount(property.baths)}
                      >
                        <Bath
                          className="h-4 w-4 text-[var(--color-primary)]"
                          aria-hidden="true"
                        />
                        <span>{property.baths}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Scroll Controls */}
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="absolute top-1/2 left-2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-800 shadow-lg backdrop-blur transition-all hover:bg-white sm:h-11 sm:w-11 dark:border-white/10 dark:bg-[var(--bg-surface)]/90 dark:text-slate-100 dark:hover:bg-[var(--bg-surface)]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="absolute top-1/2 right-2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-800 shadow-lg backdrop-blur transition-all hover:bg-white sm:h-11 sm:w-11 dark:border-white/10 dark:bg-[var(--bg-surface)]/90 dark:text-slate-100 dark:hover:bg-[var(--bg-surface)]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
