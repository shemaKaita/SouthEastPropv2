/**
 * Database-backed site content with module-level cache.
 *
 * Reads nav items, social links, and contact details from the
 * SiteContent table. Falls back to hardcoded defaults from
 * constants.ts when the DB is unavailable or the key doesn't exist.
 *
 * The cache is invalidated when updateSiteContentAction runs
 * (via revalidatePath) and on server restart.
 */

import { prisma } from "@/lib/prisma";
import {
  NAV_ITEMS,
  SOCIAL_LINKS,
  CONTACT_DETAILS,
  PROPERTY_TYPES,
} from "@/lib/constants";

type ContentValue =
  | typeof NAV_ITEMS
  | typeof SOCIAL_LINKS
  | typeof CONTACT_DETAILS
  | typeof PROPERTY_TYPES;

type ContentMap = {
  nav_items?: ContentValue;
  social_links?: ContentValue;
  contact_details?: ContentValue;
  property_types?: ContentValue;
};

let cache: ContentMap | null = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 1000; // 1 minute

async function loadContent(): Promise<ContentMap> {
  const now = Date.now();
  if (cache && now - cacheTime < CACHE_TTL) {
    return cache;
  }
  try {
    const rows = await prisma.siteContent.findMany();
    const map: ContentMap = {};
    for (const row of rows) {
      map[row.key as keyof ContentMap] = row.value as ContentValue;
    }
    cache = map;
    cacheTime = now;
    return map;
  } catch {
    // DB unavailable — return empty, callers use defaults
    return {};
  }
}

export async function getNavItems() {
  const content = await loadContent();
  return (content.nav_items as typeof NAV_ITEMS | undefined) ?? NAV_ITEMS;
}

export async function getSocialLinks() {
  const content = await loadContent();
  return (
    (content.social_links as typeof SOCIAL_LINKS | undefined) ?? SOCIAL_LINKS
  );
}

export async function getContactDetails() {
  const content = await loadContent();
  return (
    (content.contact_details as typeof CONTACT_DETAILS | undefined) ??
    CONTACT_DETAILS
  );
}

export async function getPropertyTypes() {
  const content = await loadContent();
  return (
    (content.property_types as typeof PROPERTY_TYPES | undefined) ??
    PROPERTY_TYPES
  );
}

/** Clear the in-memory cache (called after admin updates) */
export function clearContentCache(): void {
  cache = null;
  cacheTime = 0;
}
