/**
 * Prisma client singleton.
 *
 * Prevents exhausting Postgres connections during hot-reload in dev
 * by reusing the global instance. In production, a new client is
 * created per process.
 *
 * Prisma 7 uses a driver adapter (@prisma/adapter-pg) for the
 * database connection instead of a datasource block in the schema.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
