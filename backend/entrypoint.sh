#!/bin/sh

echo "Deploying Prisma Migrations..."
npm run db:deploy

echo "Seeding Database..."
npm run seed

echo "Starting Backend Server..."
npm start
