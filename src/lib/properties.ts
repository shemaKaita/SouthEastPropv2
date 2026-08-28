/**
 * Property data repository.
 *
 * This is the single data access layer for property listings.
 * Components and server actions should import from here, NOT from
 * the raw data file directly.
 *
 * Backed by PostgreSQL via Prisma. Falls back to the static seed
 * data when the database is unavailable (e.g. during build without
 * a DB connection). The async interface means all downstream code
 * (server components, server actions) works unchanged.
 */

import type { Property, Amenity } from "@/types/property";
import { prisma } from "@/lib/prisma";
import { PROPERTIES } from "@/data/properties";

/**
 * Convert a Prisma property row to the domain `Property` type.
 */
function toDomain(row: {
  slug: string;
  title: string;
  location: string;
  price: string;
  priceLabel: string;
  beds: number;
  baths: number;
  area: number;
  lat: number;
  lng: number;
  availability: string;
  badge: string;
  featuredImage: string;
  galleryImages: string[];
  description: string;
  amenities: unknown;
}): Property {
  return {
    slug: row.slug,
    title: row.title,
    location: row.location,
    price: row.price,
    priceLabel: row.priceLabel,
    beds: row.beds,
    baths: row.baths,
    area: row.area,
    lat: row.lat,
    lng: row.lng,
    availability: row.availability,
    badge: row.badge,
    featuredImage: row.featuredImage,
    galleryImages: row.galleryImages,
    description: row.description,
    amenities: (row.amenities as Amenity[]) ?? [],
  };
}

/**
 * Get all properties (async — for server components and server actions).
 * Falls back to static data if the database is unavailable.
 */
export async function getAllProperties(): Promise<Property[]> {
  try {
    const rows = await prisma.property.findMany({
      orderBy: { createdAt: "asc" },
    });
    return rows.length > 0 ? rows.map(toDomain) : [...PROPERTIES];
  } catch {
    return [...PROPERTIES];
  }
}

/**
 * Get all properties (sync — for client components that receive data
 * from a server component parent but need a static fallback).
 */
export function getAllPropertiesSync(): Property[] {
  return [...PROPERTIES];
}

/**
 * Get a single property by its slug.
 * Returns null if not found. Falls back to static data on DB error.
 */
export async function getPropertyBySlug(
  slug: string,
): Promise<Property | null> {
  try {
    const row = await prisma.property.findUnique({ where: { slug } });
    return row ? toDomain(row) : null;
  } catch {
    return PROPERTIES.find((p) => p.slug === slug) ?? null;
  }
}

/**
 * Get all property slugs — used by generateStaticParams.
 * Falls back to static data if the database is unavailable.
 */
export async function getAllPropertySlugs(): Promise<{ slug: string }[]> {
  try {
    const rows = await prisma.property.findMany({
      select: { slug: true },
    });
    return rows.length > 0
      ? rows.map((r) => ({ slug: r.slug }))
      : PROPERTIES.map((p) => ({ slug: p.slug }));
  } catch {
    return PROPERTIES.map((p) => ({ slug: p.slug }));
  }
}
