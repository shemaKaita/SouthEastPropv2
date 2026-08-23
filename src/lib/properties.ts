/**
 * Property data repository.
 *
 * This is the single data access layer for property listings.
 * Components and server actions should import from here, NOT from
 * the raw data file directly.
 *
 * Currently backed by a static array, but the async interface means
 * swapping to a database, CMS, or external API requires changes only here.
 */

import type { Property } from "@/types/property";
import { PROPERTIES } from "@/data/properties";

/**
 * Get all properties.
 * Returns full Property objects.
 */
export async function getAllProperties(): Promise<Property[]> {
  return [...PROPERTIES];
}

/**
 * Get a single property by its slug.
 * Returns null if not found.
 */
export async function getPropertyBySlug(
  slug: string,
): Promise<Property | null> {
  return PROPERTIES.find((p) => p.slug === slug) ?? null;
}

/**
 * Get all property slugs — used by generateStaticParams.
 */
export async function getAllPropertySlugs(): Promise<{ slug: string }[]> {
  return PROPERTIES.map((p) => ({ slug: p.slug }));
}

/**
 * Get featured properties (those with a badge).
 */
export async function getFeaturedProperties(): Promise<Property[]> {
  return PROPERTIES.filter((p) => p.badge && p.badge.length > 0);
}
