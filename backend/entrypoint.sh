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

echo "[ENTRYPOINT] Seeding initial database records (idempotent / create-if-absent)..."
npm run seed || echo "[ENTRYPOINT] Note: Database seed step finished with non-fatal code."

echo "[ENTRYPOINT] Starting Backend Server (Production)..."
exec node dist/server.js
