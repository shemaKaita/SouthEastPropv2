/**
 * Prisma seed script.
 *
 * Seeds the database from the existing static property data,
 * creates a default admin user, and populates site content.
 *
 * Usage: npx prisma db seed
 *
 * Env vars required:
 *   DATABASE_URL          — Postgres connection string
 *   ADMIN_EMAIL           — Default admin email (default: admin@southeastproperties.co.za)
 *   ADMIN_PASSWORD        — Default admin password (required if no user exists)
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PROPERTIES } from "../src/data/properties";
import {
  NAV_ITEMS,
  SOCIAL_LINKS,
  CONTACT_DETAILS,
  PROPERTY_TYPES,
} from "../src/lib/constants";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function seedProperties(): Promise<void> {
  console.log("Seeding properties…");

  for (const p of PROPERTIES) {
    await prisma.property.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        location: p.location,
        price: p.price,
        priceLabel: p.priceLabel,
        beds: p.beds,
        baths: p.baths,
        area: p.area,
        lat: p.lat,
        lng: p.lng,
        availability: p.availability,
        badge: p.badge,
        featuredImage: p.featuredImage,
        galleryImages: p.galleryImages,
        description: p.description,
        amenities: p.amenities,
      },
    });
  }

  console.log(`✓ Seeded ${PROPERTIES.length} properties`);
}

async function seedAdminUser(): Promise<void> {
  const email = process.env.ADMIN_EMAIL ?? "admin@southeastproperties.co.za";
  const password = process.env.ADMIN_PASSWORD;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("✓ Admin user already exists, skipping");
    return;
  }

  if (!password) {
    console.log("⚠ No ADMIN_PASSWORD env var — skipping admin user creation");
    console.log("  Set ADMIN_PASSWORD to create the default admin.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { email, passwordHash, role: "ADMIN" },
  });

  console.log(`✓ Created admin user: ${email}`);
}

async function seedSiteContent(): Promise<void> {
  console.log("Seeding site content…");

  const items = [
    { key: "nav_items", value: NAV_ITEMS },
    { key: "social_links", value: SOCIAL_LINKS },
    { key: "contact_details", value: CONTACT_DETAILS },
    { key: "property_types", value: PROPERTY_TYPES },
  ];

  for (const item of items) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: {},
      create: { key: item.key, value: item.value },
    });
  }

  console.log(`✓ Seeded ${items.length} site content entries`);
}

async function runSeed(): Promise<void> {
  try {
    await seedProperties();
    await seedAdminUser();
    await seedSiteContent();
    console.log("\n🎉 Seed complete.");
  } catch (e: unknown) {
    console.error("Seed failed:", e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

runSeed();
