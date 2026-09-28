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

# Copy only what is needed at runtime
COPY --from=builder /app/dist           ./dist
COPY --from=builder /app/node_modules   ./node_modules
COPY --from=builder /app/package.json   ./package.json
# Prisma schema + generated client (needed for migrations at entrypoint + runtime queries)
COPY --from=builder /app/prisma         ./prisma
COPY --from=builder /app/generated      ./generated

# Persistent upload directories with correct ownership
RUN mkdir -p /app/uploads /app/private-uploads \
    && chown -R appuser:appgroup /app

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh \
    && chown appuser:appgroup /app/entrypoint.sh

# Drop root — all subsequent processes run as unprivileged appuser
USER appuser

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
