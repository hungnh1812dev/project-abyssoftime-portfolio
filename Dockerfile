# syntax=docker/dockerfile:1

# ─── Stage 1: install dependencies ───────────────────────────────────────────
FROM oven/bun:1-alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ─── Stage 2: build ──────────────────────────────────────────────────────────
# Use Node.js (not bun) so CJS __dirname resolves correctly in all packages
# (bun on Alpine loses __dirname context for transitive CJS requires in Turbopack externals)
FROM node:22-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Non-sensitive build config
ARG GRAPHQL_URL
ENV GRAPHQL_URL=$GRAPHQL_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Sensitive secrets via BuildKit — mounted at build time only, never stored in layers
RUN --mount=type=secret,id=GRAPHQL_TOKEN \
    --mount=type=secret,id=REVALIDATE_SECRET \
    GRAPHQL_TOKEN=$(cat /run/secrets/GRAPHQL_TOKEN) \
    REVALIDATE_SECRET=$(cat /run/secrets/REVALIDATE_SECRET) \
    node node_modules/.bin/next build

# ─── Stage 3: production runner ──────────────────────────────────────────────
# Uses node:alpine (not bun) — standalone output only needs Node.js at runtime
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# standalone/ contains a self-contained server.js + minimal node_modules
COPY --from=builder --chown=nextjs:nodejs /app/public          ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static    ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
