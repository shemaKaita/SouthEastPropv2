# syntax=docker/dockerfile:1.7

# ─────────────────────────────────────────────
# Stage 1 — Dependencies
# Installs all node_modules (including devDeps) needed for building.
# ─────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

# Copy lockfile and manifest first to leverage Docker layer caching.
COPY package.json package-lock.json* ./

RUN npm ci

# ─────────────────────────────────────────────
# Stage 2 — Builder
# Compiles the Next.js standalone production build.
# ─────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

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

# Create a non-root user for security.
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copy the standalone server output produced by `next build`.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Copy static assets that the standalone server references.
COPY --from=builder --chown=nextjs:nodejs /app/.next/static /app/.next/static
# Copy the public folder for favicons, robots, etc.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]