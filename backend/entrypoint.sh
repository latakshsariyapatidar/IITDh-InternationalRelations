#!/bin/sh
set -e

DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}

echo "[ENTRYPOINT] Waiting for PostgreSQL at ${DB_HOST}:${DB_PORT}..."
until nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
done
echo "[ENTRYPOINT] PostgreSQL is reachable."

echo "[ENTRYPOINT] Deploying Prisma Migrations..."
npm run db:deploy

# Seeding is deliberately NOT run here.
#
# It used to be, on every container start, and that had two consequences. Rows
# an admin had edited in the panel were rewritten back to the seeded defaults on
# each deploy; and a faculty directory entry deleted to withdraw faculty-portal
# access was recreated on the next restart with portal access enabled again.
#
# A new database needs it exactly once, to create the admin account and the
# site-content rows (that module has no create route). Run it by hand:
#
#     docker compose exec backend npm run seed
#
# It is idempotent, so a repeat run is harmless — but it is not this script's job.

echo "[ENTRYPOINT] Starting Backend Server (Production)..."
exec node dist/server.js
