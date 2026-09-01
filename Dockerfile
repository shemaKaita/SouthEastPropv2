# syntax=docker/dockerfile:1.7

# ─────────────────────────────────────────────
# Stage 1 — Dependencies
# Installs all node_modules (including devDeps) needed for building.
# ─────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

# Copy lockfile and manifest first to leverage Docker layer caching.
# Prisma files are needed too: npm's postinstall runs `prisma generate`,
# which requires prisma.config.ts and prisma/schema.prisma to be present.
# prisma.config.ts resolves DATABASE_URL eagerly at load time, but generate
# only needs the schema (no DB connection) — supply a placeholder.
COPY package.json package-lock.json* ./
COPY prisma.config.ts ./
COPY prisma ./prisma

RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npm install --no-audit --no-fund

# ─────────────────────────────────────────────
# Stage 2 — Builder
# Compiles the Next.js standalone production build.
# ─────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
# prisma.config.ts resolves DATABASE_URL eagerly at import time; `generate`
# and `next build` only need the variable to exist (page-level queries fall
# back to static seed data when the DB is unreachable at build time).
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client before building the app
RUN npx prisma generate

RUN npm run build

# ─────────────────────────────────────────────
# Stage 3 — Runner
# Minimal production image containing only the standalone output.
# ─────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV UPLOAD_DIR=/uploads

# Install openssl (required by Prisma engine in production)
RUN apk add --no-cache openssl

# Create a non-root user for security.
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Create uploads directory (Railway Volume is mounted at /uploads)
RUN mkdir -p /uploads && chown nextjs:nodejs /uploads

# Copy the standalone server output produced by `next build`.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Copy static assets that the standalone server references.
COPY --from=builder --chown=nextjs:nodejs /app/.next/static /app/.next/static
# Copy the public folder for favicons, robots, etc.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Copy Prisma schema, config, and the FULL builder node_modules.
# The standalone output only includes @prisma/client — not the `prisma`
# CLI or its dependency tree — which made the old `npx prisma migrate
# deploy` CMD download an arbitrary prisma version from the registry at
# every boot: slow, non-deterministic, and it hung the container when
# the registry was unreachable (observed as a FAILED Railway deploy).
# Copying the builder's complete node_modules guarantees the pinned CLI
# version and all transitive deps are present; startup makes zero
# network calls before the server is up.
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

# Healthcheck — verify the server responds on the configured port
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://localhost:' + (process.env.PORT || 3000) + '/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Run migrations on startup, then start the server.
# `node_modules/prisma/build/index.js` — the CLI ships in the image (no
# npx network fetch at boot). migrate deploy is a no-op when the schema
# is already up to date, and exits non-zero with a clear error if the
# database is unreachable (fail-fast, restart policy handles it).
CMD ["sh", "-c", "node node_modules/prisma/build/index.js migrate deploy && node server.js"]
