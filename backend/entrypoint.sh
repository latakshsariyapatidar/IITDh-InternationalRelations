#!/bin/sh

echo "Waiting for PostgreSQL to be ready..."
while ! nc -z db 5432; do
  sleep 1
done
echo "PostgreSQL is reachable."

echo "Deploying Prisma Migrations..."
npm run db:deploy

echo "Seeding Database..."
npm run seed || echo "Seeding finished with notices or already seeded."

echo "Starting Backend Server..."
exec npm start
