import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Wifi,
  Car,
  Shield,
  Waves,
  Wind,
  Dumbbell,
  WashingMachine,
  Tv,
  ArrowLeft,
  ArrowRight,
  Calendar,
  type LucideIcon,
} from "lucide-react";

import { getPropertyBySlug, getAllPropertySlugs } from "@/lib/properties";
import { notFound } from "next/navigation";
import EnquireNowForm from "@/components/EnquireNowForm";
import type { ReactElement } from "react";

const AMENITY_ICONS: Record<string, LucideIcon> = {
  Wifi,
  Car,
  Shield,
  Waves,
  Wind,
  Dumbbell,
  WashingMachine,
  Tv,
};

export async function generateStaticParams() {
  const slugs = await getAllPropertySlugs();
  return slugs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) {
    return { title: "Property Not Found | SouthEast Properties" };
  }
  return {
    title: `${property.title} | SouthEast Properties`,
    description: property.description.slice(0, 160),
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<ReactElement> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  // Split description on \n\n to render paragraphs; fall back to the whole string.
  const descriptionParagraphs = property.description.includes("\n\n")
    ? property.description.split("\n\n")
    : [property.description];

  return (
    <div className="bg-[var(--color-background)] pt-20 pb-24 sm:pt-24 sm:pb-32 lg:pt-28 lg:pb-16">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10 space-y-10">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-secondary)] transition-colors hover:text-[var(--accent-yellow)]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Properties</span>
        </Link>

        {/* Bento Box image gallery */}
        <div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
            {/* Featured image - left */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-[4/3] lg:min-h-[480px]">
              <Image
                src={property.featuredImage}
                fill
                alt={property.title}
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Gallery grid - right */}
            <div className="grid grid-cols-2 gap-3 lg:gap-4 lg:grid-rows-2">
              {property.galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-auto lg:h-full"
                >
                  <Image
                    src={image}
                    fill
                    alt={`${property.title} — image ${index + 2}`}
                    loading="lazy"
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile/tablet Enquire Now pill — sits below gallery, lg:hidden */}
          <div className="mt-8 flex justify-center lg:hidden">
            <a
              href="#enquiry-form"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent-yellow)] px-8 text-base font-bold text-navy-900 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-yellow-hover)] hover:shadow-xl active:translate-y-0 active:shadow-lg"
            >
              Enquire Now
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
          {/* Left: Main content */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <span className="inline-flex items-center rounded-full bg-[var(--brand-navy)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white shadow-md dark:ring-1 dark:ring-white/10">
                {property.badge}
              </span>
              <h1 className="mt-4 pt-2 text-3xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-4xl text-balance">
                {property.title}
              </h1>
              <div className="mt-3 flex items-center gap-2 text-sm text-[var(--color-secondary)]">
                <MapPin className="h-4 w-4" />
                <span>{property.location}</span>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-6 border-y border-[var(--color-secondary)]/20 py-5">
              <div className="flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-[var(--color-primary)]" />
                <span className="text-sm font-medium">
                  {property.beds} Beds
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-[var(--color-primary)]" />
                <span className="text-sm font-medium">
                  {property.baths} Baths
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize className="h-5 w-5 text-[var(--color-primary)]" />
                <span className="text-sm font-medium">{property.area} m²</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[var(--color-foreground)] text-balance">
                About this property
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-[var(--color-foreground)]/70 sm:text-base">
                {descriptionParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[var(--color-foreground)] text-balance">
                Amenities
              </h2>
              <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {property.amenities.map((amenity) => {
                  const Icon = AMENITY_ICONS[amenity.icon];
                  return (
                    <li
                      key={amenity.label}
                      className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] dark:border-white/10 p-3"
                    >
                      {Icon ? (
                        <Icon className="h-5 w-5 text-[var(--color-primary)]" />
                      ) : null}
                      <span className="text-sm font-medium text-[var(--color-foreground)]/80">
                        {amenity.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Right: Sticky sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start" id="enquiry-form">
            <div className="flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-base)] dark:bg-[var(--bg-surface)] dark:border-white/10 p-6 shadow-lg sm:p-8 scroll-mt-24">
              {/* Price */}
              <div className="inline-flex w-fit items-baseline gap-2 rounded-full bg-[var(--bg-surface)] dark:bg-navy-900/60 px-4 py-2 border border-[var(--border-subtle)] dark:border-white/10">
                <span className="text-2xl font-bold text-[var(--color-primary)]">
                  {property.price}
                </span>
                <span className="text-sm text-[var(--color-secondary)]">
                  {property.priceLabel}
                </span>
              </div>
              {/* Availability */}
              <div className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--accent-yellow)]/15 px-3 py-1 text-xs font-semibold text-[var(--accent-yellow)] ring-1 ring-[var(--accent-yellow)]/30">
                <Calendar className="h-3.5 w-3.5" />
                {property.availability}
              </div>
              {/* Divider */}
              <div className="my-6 h-px w-full bg-[var(--color-secondary)]/20" />
              {/* Form heading */}
              <h3 className="text-lg font-semibold tracking-tight text-[var(--color-foreground)]">
                Enquire Now
              </h3>
              <p className="mt-1 text-xs text-[var(--color-secondary)]">
                Fill in the form below and we&apos;ll get back to you within 24
                hours.
              </p>
              {/* Form */}
              <div className="mt-5">
                <EnquireNowForm
                  propertySlug={property.slug}
                  propertyTitle={property.title}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
