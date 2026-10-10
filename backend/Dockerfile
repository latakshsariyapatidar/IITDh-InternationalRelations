# ── Stage 1: Builder ──────────────────────────────────────────────────────────
# Installs ALL dependencies (including devDependencies), compiles TypeScript,
# generates the Prisma client, then prunes to prod-only deps.
# Nothing from this stage leaks into the final image.
FROM node:22-alpine AS builder

WORKDIR /app

# openssl is required by the Prisma engine at generate time
RUN apk add --no-cache openssl

# Leverage Docker layer cache — reinstall deps only when manifests change
COPY package*.json ./
RUN npm ci

# Copy source and compile
COPY . .
# prisma generate reads the schema file only — it never connects to the database.
# The custom prisma.config.ts calls env("DATABASE_URL") which must resolve at
# config-parse time even though no connection is made. Provide a dummy value
# here so the build succeeds; the real URL is injected at runtime via docker-compose.
ARG DATABASE_URL=postgresql://build:build@localhost:5432/build
ENV DATABASE_URL=${DATABASE_URL}
RUN npm run db:generate
RUN npm run build

# Drop devDependencies from node_modules so only prod deps are copied across
RUN npm prune --omit=dev

# ── Stage 2: Production Runtime ───────────────────────────────────────────────
# Lean image: no TypeScript source, no dev tooling, no Prisma CLI.
FROM node:22-alpine AS production

WORKDIR /app

# openssl  — Prisma query engine requires it at runtime
# netcat   — used by entrypoint.sh to poll PostgreSQL readiness
RUN apk add --no-cache openssl netcat-openbsd \
    && addgroup -S appgroup \
    && adduser  -S appuser -G appgroup

# Copy only what is needed at runtime.
# --chown applies ownership at copy time (part of the layer write) which is
# essentially free. A post-copy "chown -R /app" would traverse every file in
# node_modules — tens of thousands of stat+chown syscalls — and takes minutes.
COPY --from=builder --chown=appuser:appgroup /app/dist         ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package.json ./package.json
# Prisma schema (needed for migrations at entrypoint).
# The generated client lives inside node_modules/@prisma/client — already above.
COPY --from=builder --chown=appuser:appgroup /app/prisma       ./prisma

# Create upload directories and chown only those two empty dirs (not node_modules).
RUN mkdir -p /app/uploads /app/private-uploads \
    && chown appuser:appgroup /app/uploads /app/private-uploads

COPY --chown=appuser:appgroup entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh \
    && chown appuser:appgroup /app/entrypoint.sh

# Drop root — all subsequent processes run as unprivileged appuser
USER appuser

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
