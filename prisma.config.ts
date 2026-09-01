import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * DATABASE_URL resolves eagerly when this config is imported — including
 * for commands that never touch the database (`prisma generate`, CLI
 * --version, Docker builds). Fall back to a placeholder so those paths
 * succeed; commands that actually connect (migrate deploy, db seed) still
 * get the real value from the environment at runtime. The app's Prisma
 * client reads process.env.DATABASE_URL directly and is unaffected.
 */
const datasourceUrl =
  process.env.DATABASE_URL ??
  "postgresql://placeholder:placeholder@localhost:5432/placeholder";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: datasourceUrl,
  },
});
